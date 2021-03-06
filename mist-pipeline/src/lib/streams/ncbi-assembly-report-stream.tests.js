'use strict'

// Core
const fs = require('fs'),
	path = require('path')

// Local
const ncbiAssemblyReportStream = require('./ncbi-assembly-report-stream')

// Constants
const kTestDataPath = path.resolve(__dirname, 'test-data')

function parseAndExpect(filename, expectedResults, done) {
	let inputFile = path.resolve(kTestDataPath, filename),
		inStream = fs.createReadStream(inputFile),
		ncbiAssemblyReportReader = ncbiAssemblyReportStream(),
		results = []

	inStream.on('error', done)
	ncbiAssemblyReportReader.on('error', done)

	inStream.pipe(ncbiAssemblyReportReader)
	.on('data', (info) => {
		results.push(info)
	})
	.on('finish', () => {
		expect(results).eql(expectedResults)
		done()
	})
}

describe('streams', function() {
	describe('ncbi assembly report stream', function() {
		it('throws error on missing info in file', function(done) {
			let inputFile = path.resolve(kTestDataPath, 'assembly-report.broken.txt'),
				inStream = fs.createReadStream(inputFile),
				ncbiAssemblyReportReader = ncbiAssemblyReportStream(),
				error = null

			inStream.pipe(ncbiAssemblyReportReader)
			.on('error', (err) => {
				error = err
			})
			.on('finish', () => {
				done(error ? null : new Error('expected error, but none was thrown'))
			})
		})

		it('parses complete NCBI assembly reports', function(done) {
			parseAndExpect('assembly-report.single.txt', [
				{
					name: 'ANONYMOUS',
					role: 'assembled-molecule',
					assignedMolecule: 'na',
					type: 'Chromosome',
					genbankAccession: 'AE004091.2',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NC_002516.2',
					unit: 'Primary Assembly'
				}
			], done)
		})

		it('parses contig NCBI assembly reports', function(done) {
			let expectedResults = [
				{
					name: '5104_1',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000001.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000001.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_2',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000002.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000002.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_3',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000003.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000003.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_4',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000004.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000004.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_5',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000005.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000005.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_6',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000006.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000006.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_7',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000007.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000007.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_8',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000008.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000008.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_9',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000009.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000009.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_10',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000010.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000010.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_11',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000011.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000011.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_12',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000012.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000012.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_13',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000013.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000013.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_14',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000014.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000014.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_15',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000015.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000015.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_16',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000016.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000016.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_17',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000017.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000017.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_18',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000018.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000018.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_19',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000019.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000019.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_20',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000020.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000020.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_21',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000021.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000021.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_22',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000022.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000022.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_23',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000023.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000023.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_24',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000024.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000024.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_25',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000025.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000025.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_26',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000026.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000026.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_27',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000027.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000027.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_28',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000028.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000028.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_29',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000029.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000029.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_30',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000030.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000030.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_31',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000031.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000031.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_32',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000032.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000032.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_33',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000033.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000033.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_34',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000034.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000034.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_35',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000035.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000035.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_36',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000036.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000036.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_37',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000037.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000037.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_38',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000038.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000038.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_39',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000039.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000039.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_40',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000040.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000040.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_41',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000041.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000041.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_42',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000042.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000042.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_43',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000043.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000043.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_44',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000044.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000044.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_45',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000045.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000045.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_46',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000046.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000046.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_47',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000047.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000047.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_48',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000048.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000048.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_49',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000049.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000049.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_50',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000050.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000050.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_51',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000051.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000051.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_52',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000052.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000052.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_53',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000053.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000053.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_54',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000054.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000054.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_55',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000055.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000055.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_56',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000056.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000056.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_57',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000057.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000057.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_58',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000058.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000058.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_59',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000059.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000059.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_60',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000060.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000060.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_61',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000061.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000061.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_62',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000062.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000062.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_63',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000063.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000063.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_64',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000064.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000064.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_65',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000065.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000065.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_66',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000066.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000066.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_67',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000067.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000067.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_68',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000068.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000068.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_69',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000069.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000069.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_70',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000070.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000070.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_71',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000071.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000071.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_72',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000072.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000072.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_73',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000073.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000073.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_74',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000074.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000074.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_75',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000075.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000075.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_76',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000076.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000076.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_77',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000077.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000077.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_78',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000078.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000078.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_79',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000079.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000079.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_80',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000080.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000080.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_81',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000081.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000081.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_82',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000082.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000082.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_83',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000083.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000083.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_84',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000084.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000084.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_85',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000085.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000085.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_86',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000086.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000086.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_87',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000087.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000087.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_88',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000088.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000088.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_89',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000089.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000089.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_90',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000090.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000090.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_91',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000091.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000091.1',
					unit: 'Primary Assembly'
				},
				{
					name: '5104_92',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'ANHX01000092.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_ANHX01000092.1',
					unit: 'Primary Assembly'
				}
			]

			parseAndExpect('assembly-report.contig.txt', expectedResults, done)
		})

		it('streaming parser of Chromosome NCBI Assembly Reports', function(done) {
			parseAndExpect('assembly-report.complete.txt', [
				{
					name: 'I',
					role: 'assembled-molecule',
					assignedMolecule: 'I',
					type: 'Chromosome',
					genbankAccession: 'CP001139.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NC_011184.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'II',
					role: 'assembled-molecule',
					assignedMolecule: 'II',
					type: 'Chromosome',
					genbankAccession: 'CP001133.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NC_011186.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'pMJ100',
					role: 'assembled-molecule',
					assignedMolecule: 'pMJ100',
					type: 'Plasmid',
					genbankAccession: 'CP001134.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NC_011185.1',
					unit: 'Primary Assembly'
				}
			], done)
		})

		it('streaming parser of Scaffold NCBI Assembly Reports', function(done) {
			let expectedResults = [
				{
					name: 'acHWB-supercont1.1',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944513.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944513.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.10',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944514.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944514.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.11',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944515.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944515.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.12',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944516.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944516.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.13',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944517.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944517.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.14',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944518.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944518.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.15',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944519.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944519.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.16',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944520.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944520.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.17',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944521.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944521.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.18',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944522.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944522.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.19',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944523.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944523.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.2',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944524.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944524.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.20',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944525.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944525.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.21',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944526.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944526.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.22',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944527.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944527.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.23',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944528.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944528.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.24',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944529.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944529.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.25',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944530.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944530.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.26',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944531.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944531.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.27',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944532.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944532.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.28',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944533.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944533.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.3',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944534.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944534.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.4',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944535.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944535.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.5',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944536.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944536.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.6',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944537.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944537.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.7',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944538.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944538.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.8',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944539.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944539.1',
					unit: 'Primary Assembly'
				},
				{
					name: 'acHWB-supercont1.9',
					role: 'unplaced-scaffold',
					assignedMolecule: 'na',
					type: 'na',
					genbankAccession: 'KB944540.1',
					genbankRefseqRelationship: '=',
					refseqAccession: 'NZ_KB944540.1',
					unit: 'Primary Assembly'
				}
			]

			parseAndExpect('assembly-report.scaffold.txt', expectedResults, done)
		})
	})
})
