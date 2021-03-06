'use strict'

// Core
const fs = require('fs'),
	zlib = require('zlib')

// Vendor
const pumpify = require('pumpify'),
	streamEach = require('stream-each')

// Local
const PerGenomePipelineModule = require('lib/PerGenomePipelineModule'),
	NCBIDataHelper = require('./NCBIDataHelper'),
	AseqsService = require('mist-lib/services/AseqsService'),
	DseqsService = require('mist-lib/services/DseqsService'),
	IdService = require('mist-lib/services/IdService'),
	LocationStringParser = require('mist-lib/bio/LocationStringParser'),
	genbankStream = require('mist-lib/streams/genbank-stream'),
	genbankMistStream = require('lib/streams/genbank-mist-stream'),
	mutil = require('mist-lib/mutil'),
	ncbiAssemblyReportStream = require('lib/streams/ncbi-assembly-report-stream')

// Other
let streamEachPromise = Promise.promisify(streamEach)

/**
 * This module handles downloading and loading raw genomic data into the database.
 *
 * For performance reasons, care is taken to insert all records (per table) with primary keys
 * ordered in a contiguous, ungaped sequence. For example, if a genome has 10 components, the
 * first component would have an id of X, the second of X + 1, and so on. The same applies for
 * genes, xrefs, and the other tables. This is achieved by using a distinct table (id_sequences)
 * to store specific sequences (which are by default named after the model name, See
 * MistBootService::addGlobalClassMethods_). When allocating a specific sequence, this row is
 * selected for update (locked), and updated with the relevant new sequence value. Of course,
 * for this to work properly, all ids must be allocated on the client side using the IdService.
 * This does not apply to all tables in the database, only those used in this module:
 *
 * - genomes_references
 * - components
 * - genes
 * - components_features
 * - xrefs
 *
 * Other tables, will most likely stick with the default serial, auto-incrementing database
 * sequences to generate identifiers on insertion.
 */
module.exports =
class NCBICoreData extends PerGenomePipelineModule {
	static description() {
		return 'load NCBI RefSeq genome data'
	}

	constructor(app, genome) {
		super(app, genome)

		this.ncbiDataHelper_ = new NCBIDataHelper(this.fileMapper_, this.logger_)
		this.locationStringParser_ = new LocationStringParser()
		this.aseqsService_ = new AseqsService(this.models_.Aseq, this.logger_)
		this.dseqsService_ = new DseqsService(this.models_.Dseq, this.logger_)
		this.idService_ = new IdService(this.models_.IdSequence, this.logger_)
		// {RefSeq accession: {}}
		this.assemblyReportMap_ = new Map()
	}

	/**
	 * This module downloads files from NCBI and thus needs a directory to store these files.
	 *
	 * @returns {Boolean}
	 */
	needsDataDirectory() {
		return true
	}

	optimize() {
		return this.analyze(
			this.models_.Component.getTableName(),
			this.models_.GenomeReference.getTableName(),
			this.models_.ComponentFeature.getTableName(),
			this.models_.Gene.getTableName(),
			this.models_.Aseq.getTableName(),
			this.models_.Dseq.getTableName(),
			this.models_.Xref.getTableName()
		)
	}

	/**
	 * Does not remove any inserted Aseqs / Dseqs :\
	 * @returns {Promise}
	 */
	undo() {
		return this.sequelize_.transaction((transaction) => {
			this.logger_.info('Deleting genome references')
			return this.models_.GenomeReference.destroy({
				where: {
					genome_id: this.genome_.id
				},
				transaction
			})
			.then(() => {
				this.logger_.info('Deleting genome components (cascades to genes, components_features, etc)')
				return this.models_.Component.destroy({
					where: {
						genome_id: this.genome_.id
					},
					transaction
				})
			})
		})
	}

	run() {
		let self = this
		return Promise.coroutine(function *() {
			// 1. Obtain the core genome files (if not already downloaded and stored locally)
			yield self.download_('assembly-report')
			yield self.download_('genomic-genbank')

			// 2. Index the information from the assembly report
			yield self.indexAssemblyReport_()

			// 3. Parse and load the genomic genbank file
			yield self.parseAndLoadGenome_()
		})()
	}

	// ----------------------------------------------------
	// Private methods
	/**
	 * @param {String} sourceType - type of data file to download for this genome; e.g. assembly-report. See FileMapper for a full list of options
	 * @returns {Promise}
	 */
	download_(sourceType) {
		return this.ncbiDataHelper_.isDownloaded(sourceType)
		.then((isDownloaded) => {
			if (!isDownloaded)
				return this.ncbiDataHelper_.download(sourceType)

			return null
		})
		.then(() => this.shutdownCheck_())
	}

	/**
	 * Downloads and indexes the information from the assembly report.
	 * @returns {Promise}
	 */
	indexAssemblyReport_() {
		return Promise.try(() => {
			let assemblyReportFile = this.fileMapper_.pathFor('assembly-report'),
				readStream = fs.createReadStream(assemblyReportFile),
				ncbiAssemblyReportReader = ncbiAssemblyReportStream(),
				pipeline = pumpify.obj(readStream, ncbiAssemblyReportReader)

			return streamEachPromise(pipeline, (assembly, next) => {
				this.assemblyReportMap_.set(assembly.refseqAccession, assembly)
				next()
			})
			.then(() => {
				this.logger_.info(`Read ${this.assemblyReportMap_.size} row(s) from the assembly report`)
				this.shutdownCheck_()
			})
		})
	}

	/**
	 * At this point, the relevant data files have been downloaded successfully. This methods
	 * governs the overall data processing:
	 *
	 * 1) Read entire GenBank data into memory
	 * 2) Allocate a range of identifiers for all rows to be inserted for each table
	 * 3) Load them into the database in a single transaction
	 *
	 * @returns {Promise}
	 */
	parseAndLoadGenome_() {
		return this.readAllGenBankData_()
		.then(this.reserveAndAssignIds_.bind(this))
		.then((mistData) => {
			return this.sequelize_.transaction({
				isolationLevel: 'READ COMMITTED' // Necessary to avoid getting: could not serialize access due to concurrent update errors
			}, (transaction) => {
				return this.loadComponents_(mistData.components, transaction)
				.then(() => this.bulkLoadRecords_(mistData.genomeReferences, this.models_.GenomeReference, transaction))
				.then(() => this.loadGeneSeqs_(mistData.geneSeqs, transaction))
				.then(() => this.loadProteinSeqs_(mistData.proteinSeqs, transaction))
				.then(() => this.bulkLoadRecords_(mistData.genes, this.models_.Gene, transaction))
				.then(() => this.bulkLoadRecords_(mistData.xrefs, this.models_.Xref, transaction))
				.then(() => this.bulkLoadRecords_(mistData.componentFeatures, this.models_.ComponentFeature, transaction))
			})
		})
	}

	/**
	 * Uses a chain of streams to read all raw data in the gzipped GenBank flatfile into arrays
	 * of records with artificial (not database generated) identifiers.
	 *
	 * @returns {Promise.<Object>}
	 */
	readAllGenBankData_() {
		let result = {
			geneSeqs: [],
			proteinSeqs: [],
			genomeReferences: null, // special case: only save first batch of genome references
			components: [],
			genes: [],
			componentFeatures: [],
			xrefs: []
		}

		return Promise.try(() => {
			let genbankFlatFile = this.fileMapper_.pathFor('genomic-genbank'),
				readStream = fs.createReadStream(genbankFlatFile),
				gunzipStream = zlib.createGunzip(),
				genbankReader = genbankStream(),
				genbankMistReader = genbankMistStream(this.genome_.id, this.genome_.version),
				pipeline = pumpify.obj(readStream, gunzipStream, genbankReader, genbankMistReader)

			genbankReader.on('error', (error) => {
				this.logger_.fatal(error, 'Genbank reader error')
			})

			return streamEachPromise(pipeline, (parsedGenBankRecord, next) => {
				// Only load one set of references per genome. It appears that most GenBank encoded genomes
				// repeat the same genome references for each "component". To avoid duplicate references,
				// the first set of genome references are the only ones that are "inserted".
				if (result.genomeReferences === null)
					result.genomeReferences = parsedGenBankRecord.genomeReferences
				result.components.push(parsedGenBankRecord.component)
				for (let key in result) {
					if (key === 'genomeReferences')
						continue

					if (Reflect.has(parsedGenBankRecord, key))
						result[key] = result[key].concat(parsedGenBankRecord[key])
				}
				next()
			})
		})
		.then(() => result)
	}

	/**
	 * Allocates a range of identifiers and replaces the artificial identifiers for each block of
	 * records to be inserted into the database. Both primary and foreign key identifiers are
	 * properly mapped.
	 *
	 * @param {Object.<String,Array.<Object>>} mistData
	 * @returns {Promise}
	 */
	reserveAndAssignIds_(mistData) {
		return this.idService_.assignIds(mistData.genomeReferences, this.models_.GenomeReference)
		.then(() => this.idService_.assignIds(mistData.components, this.models_.Component))
		.then((componentIdMap) => {
			this.idService_.setForeignKeyIds(mistData.genes, 'component_id', componentIdMap)
			this.idService_.setForeignKeyIds(mistData.componentFeatures, 'component_id', componentIdMap)
			return this.idService_.assignIds(mistData.genes, this.models_.Gene)
		})
		.then((geneIdMap) => {
			this.idService_.setForeignKeyIds(mistData.xrefs, 'gene_id', geneIdMap)
			this.idService_.setForeignKeyIds(mistData.componentFeatures, 'gene_id', geneIdMap)
			return this.idService_.assignIds(mistData.componentFeatures, this.models_.ComponentFeature)
		})
		.then(() => this.idService_.assignIds(mistData.xrefs, this.models_.Xref))
		.then(() => mistData)
	}

	/**
	 * @param {Array.<Object>} components
	 * @param {Transaction} transaction
	 * @returns {Promise}
	 */
	loadComponents_(components, transaction) {
		let numComponents = components.length
		this.logger_.info(`Loading ${numComponents} components`)
		return Promise.each(components, (component, i) => {
			this.addAssemblyReportData_(component)
			let logger = this.logger_.child({
				version: component.version,
				dnaLength: component.length,
				componentName: component.name,
				index: i + 1,
				numComponents
			})
			logger.info(`about to insert component ${component.name}`)
			return this.models_.Component.create(component, {transaction})
			.then(() => {
				logger.info(`inserted component ${component.name}`)
			})
		})
	}

	/**
	 * Updates several fields in ${component} with the corresponding data values from the assembly
	 * report file.
	 *
	 * @param {Object} component
	 */
	addAssemblyReportData_(component) {
		let assemblyReport = this.assemblyReportMap_.get(component.version)
		if (!assemblyReport)
			throw new Error('Genbank record does not have corresponding assembly report entry')

		/**
		 * In some cases, there is no corresponding GenBank record. For example, take the plasmids
		 * from Escherichia coli UMN026.
		 * ftp://ftp.ncbi.nlm.nih.gov/genomes/all/GCF/000/026/325/GCF_000026325.1_ASM2632v1/GCF_000026325.1_ASM2632v1_assembly_report.txt
		 *
		 * Both plasmids have 'na' for their GenBank accession, but NC_011749.1, NC_011739.1 for
		 * their RefSeq accessions.
		 *
		 * Thus, parse the GenBank accession only if it is not 'na' (otherwise, the database will
		 * throw a validation error when attempting to save it).
		 */
		if (assemblyReport.genbankAccession !== 'na') {
			let parts = mutil.parseAccessionVersion(assemblyReport.genbankAccession)
			component.genbank_accession = parts[0]
			component.genbank_version = assemblyReport.genbankAccession
		}
		component.name = assemblyReport.name
		component.role = assemblyReport.role
		component.assigned_molecule = assemblyReport.assignedMolecule
		component.type = assemblyReport.type
		component.genbank_refseq_relationship = assemblyReport.genbankRefseqRelationship
	}

	/**
	 * Helper method to bulk load ${records} into the database.
	 *
	 * @param {Array.<Object>} records
	 * @param {Model} model - the model to use to bulk load these into the database
	 * @param {Transaction} transaction
	 * @returns {Promise}
	 */
	bulkLoadRecords_(records, model, transaction) {
		if (records.length === 0)
			return null

		this.logger_.info(`Loading ${records.length} ${model.name}s`)
		return model.bulkCreate(records, {
			validate: true,
			transaction
		})
	}

	/**
	 * @param {Array.<Object>} geneSeqs
	 * @param {Transaction} transaction
	 * @returns {null|Promise}
	 */
	loadGeneSeqs_(geneSeqs, transaction) {
		let numDseqs = geneSeqs.length
		if (!numDseqs)
			return null

		this.logger_.info(`Loading (ignoring duplicates) ${numDseqs} gene seqs (dseqs)`)
		return this.dseqsService_.insertIgnoreSeqs(geneSeqs, transaction)
	}

	/**
	 * @param {Array.<Object>} proteinSeqs
	 * @param {Transaction} transaction
	 * @returns {null|Promise}
	 */
	loadProteinSeqs_(proteinSeqs, transaction) {
		let numAseqs = proteinSeqs.length
		if (!numAseqs)
			return null

		this.logger_.info(`Loading (ignoring duplicates) ${numAseqs} protein seqs (aseqs)`)
		return this.aseqsService_.insertIgnoreSeqs(proteinSeqs, transaction)
	}
}
