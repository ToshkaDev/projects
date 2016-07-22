/**
 * A collection of pipeline utility methods.
 */
'use strict'

// Core
const fs = require('fs'),
	path = require('path')

// Local
const OncePipelineModule = require('./OncePipelineModule'),
	PerGenomePipelineModule = require('./PerGenomePipelineModule'),
	ModuleId = require('./ModuleId')

// Constants
const kHelpIndent1 = '     ',
	kHelpIndent2 = '       '

/**
 * -------------------------------------------------------------------------------------------------
 * @param {Array.<Function>} ModuleClasses - array of module class definitions
 * @returns {String} - help text for all ${ModuleClasses}
 */
exports.modulesHelp = function(ModuleClasses) {
	if (!ModuleClasses.length)
		return kHelpIndent1 + '[none]'

	return ModuleClasses.map(exports.moduleHelp).join('\n')
}

/**
 * @param {Function} ModuleClass - module class definitions
 * @returns {String} - help text for using this module
 */
exports.moduleHelp = function(ModuleClass) {
	let description = ModuleClass.description(),
		subModuleMap = ModuleClass.subModuleMap(),
		moreInfo = ModuleClass.moreInfo(),
		help = kHelpIndent1 + ModuleClass.name

	if (subModuleMap.size) {
		help += ':<sub module>[+...]\n'
		if (description)
			help += kHelpIndent2 + description + '\n'
		help += kHelpIndent2 + 'sub-modules:\n\n'
		for (let subModuleName of subModuleMap.keys()) {
			let subDescription = subModuleMap.get(subModuleName)
			help += kHelpIndent2 + `* ${subModuleName}` + (subDescription ? ` - ${subDescription}` : '') + '\n'
		}
	}
	else if (description) {
		help += ' - ' + description
	}

	if (moreInfo) {
		help += '\n'
		help += kHelpIndent2 + moreInfo.split('\n').join('\n' + kHelpIndent2) + '\n'
	}

	return help
}

/**
 * -------------------------------------------------------------------------------------------------
 * @param {Array.<String>} inputModuleNames
 * @returns {Array.<Object>} - array of module names and any submodules
 */
// exports.decodeInputModuleNames = function(inputModuleNames) {
// 	return inputModuleNames.map(exports.decodeInputModuleName)
// }

/**
 * Module and submodule names must begin with a character and consist entirely of alphanumeric
 * characters. Submodule names must follow a colon symbol immediately after the module name.
 * Multiple submodules should be separated by plus signs. Any violation of these formatting rules
 * will throw an exception. A colon without any named submodules also throws an error.
 *
 * Examples:
 * 'SeedNewGenomes' -> {name: 'SeedNewGenomes', subNames: []}
 * 'AseqCompute(pfam30+segs)' -> {name: 'AseqCompute', subNames: ['pfam30', 'segs']}
 *
 * @param {String} inputModuleName - compact string representation of a module and any optional submodules which must be enclosed in parentheses and separated by plus signs.
 * @returns {Object} - contains the module name and any submodules
 */

/**
 * -------------------------------------------------------------------------------------------------
 * @param {...String} srcPaths - an array of paths to search for compatible pipeline modules
 * @returns {Object.<String,Array.<AbstractPipelineModule>>} - object with three keys: 'once', 'perGenome', and 'all'; which contain 'once', 'per-genome', and all pipeline modules, respectively.
 */
exports.enumerateModules = function(...srcPaths) {
	let result = {
		once: [],
		perGenome: [],
		all: null
	}

	srcPaths.forEach((srcPath) => {
		getModuleRootFiles(srcPath)
		.forEach((moduleRootFile) => {
			try {
				// eslint-disable-next-line global-require
				let ModuleClass = require(`${srcPath}/${moduleRootFile}`)
				if (ModuleClass.prototype instanceof OncePipelineModule)
					result.once.push(ModuleClass)
				else if (ModuleClass.prototype instanceof PerGenomePipelineModule)
					result.perGenome.push(ModuleClass)
			}
			catch (error) {
				if (!error.code)
					throw error
				else if (error.code === 'MODULE_NOT_FOUND')
					// eslint-disable-next-line no-console
					console.warn(`WARNING: File could not be loaded: ${srcPath}/${moduleRootFile}\n\n`, error)
			}
		})
	})

	result.all = [...result.once, ...result.perGenome]

	return result
}

/**
 * @param {String} srcPath
 * @returns {Array.<String>} - all directories or files ending in .js beneath ${srcPath}
 */
function getModuleRootFiles(srcPath) {
	return fs.readdirSync(srcPath)
	.filter((file) => {
		let stat = fs.statSync(path.join(srcPath, file))
		return stat.isDirectory() || (stat.isFile && file.endsWith('.js'))
	})
}

/**
 * -------------------------------------------------------------------------------------------------
 * @param {Array.<ModuleId>} moduleIds - array of parsed module names and any submodules
 * @param {Array.<Function>} ModuleClasses - array of module class definitions
 * @returns {Array.<String>} - array of qualified module names that do not have a cognate ModuleClass or submodule
 */
exports.findInvalidModuleIds = function(moduleIds, ModuleClasses) {
	let map = exports.mapModuleClassesByName(ModuleClasses),
		result = []

	ModuleId.unnest(moduleIds).forEach((moduleId) => {
		let ModuleClass = map.get(moduleId.name())
		if (!ModuleClass) {
			result.push(moduleId)
			return
		}

		let subName = moduleId.subNames()[0]
		if (subName && !ModuleClass.subModuleMap().has(subName))
			result.push(moduleId)
	})
	// moduleIds.forEach((moduleId) => {
	// 	if (!map.has(moduleId.name())) {
	// 		result.push(moduleId.name)
	// 		return
	// 	}

	// 	for (let subName of parsedModuleName.subNames) {
	// 		if (!ModuleClasses.subModuleMap().has(subName))
	// 			result.push(parsedModuleName.name + ':' + subName)
	// 	}
	// })

	return result
}

/**
 * -------------------------------------------------------------------------------------------------
 * Each module may optionally define one or more of the following static methods:
 *
 * description()
 * moreInfo(): returns any other helpful information
 * dependencies(): returns an array of flat module dependency names
 * subModuleNames(): returns an array of sub module names derived from the subModuleMap
 * subModuleMap(): returns a map of sub module names and their corresponding descriptions
 *
 * Since static methods are not inherited, this method injects default implementations of these
 * methods onto each ${ModuleClass} for uniformity.
 *
 * @param {Array.<Function>} ModuleClasses - array of module class definitions
 */
exports.addDefaultStaticMethods = function(ModuleClasses) {
	ModuleClasses.forEach((ModuleClass) => {
		if (!ModuleClass.description)
			ModuleClass.description = () => ''
		if (!ModuleClass.moreInfo)
			ModuleClass.moreInfo = () => ''
		if (!ModuleClass.dependencies) {
			let emptyArray = []
			ModuleClass.dependencies = () => emptyArray
		}
		if (!ModuleClass.subModuleMap) {
			let emptyMap = new Map()
			ModuleClass.subModuleMap = () => emptyMap
		}
		if (!ModuleClass.subModuleNames) {
			let names = Array.from(ModuleClass.subModuleMap().keys())
			ModuleClass.subModuleNames = () => names
		}
	})
}

/**
 * -------------------------------------------------------------------------------------------------
 * Returns an array of objects containing the name of this module and its dependencies as specified
 * by the ModuleClass's static dependencies() method. If a ModuleClass has one or more submodules,
 * then an entry is created for each submodule. For example,
 *
 * Core.dependencies() -> []
 * Core.subModuleNames() -> []
 * AseqCompute.dependencies() -> ['Core']
 * AseqCompute.subModuleNames() -> ['pfam30', 'segs', 'coils']
 *
 * flatDependencyArray([Core, AseqCompute]) returns:
 * [
 *   {
 *     name: 'Core',
 *     dependencies: []
 *   },
 *   {
 *     name: 'AseqCompute:pfam30',
 *     dependencies: ['Core']
 *   },
 *   {
 *     name: 'AseqCompute:segs',
 *     dependencies: ['Core']
 *   },
 *   {
 *     name: 'AseqCompute:coils',
 *     dependencies: ['Core']
 *   }
 * ]
 *
 * This facilitates producing a dependency tree via ModuleDepNode.createFromDepList().
 *
 * @param {Array.<Function>} ModuleClasses - array of module class definitions
 * @returns {Array.<Object>} - array of "flattened" dependencies
 */
exports.unnestedDependencyArray = function(ModuleClasses) {
	let result = []

	ModuleClasses.forEach((ModuleClass) => {
		let subModuleNames = ModuleClass.subModuleNames()
		if (subModuleNames.length) {
			subModuleNames.forEach((subModuleName) => {
				result.push({
					name: `${ModuleClass.name}:${subModuleName}`,
					dependencies: ModuleClass.dependencies()
				})
			})
		}
		else {
			result.push({
				name: ModuleClass.name,
				dependencies: ModuleClass.dependencies()
			})
		}
	})

	return result
}

/**
 * -------------------------------------------------------------------------------------------------
 * Produces an array of expanded module names from ${ModuleClasses}. If a ModuleClass does not have
 * any submodules, then it simply returns the ModuleClass's name; otherwise, it returns a qualified
 * module name for each of its submodules.
 *
 * For example:
 *
 * Core.subModuleNames() -> []
 * AseqCompute.subModuleNames() -> ['pfam30', 'segs', 'coils']
 *
 * flatModuleNames([Core, AseqCompute]) returns:
 *
 * [
 *   'Core',
 *   'AseqCompute:pfam30',
 *   'AseqCompute:segs',
 *   'AseqCompute:coils'
 * ]
 *
 * This assumes that each ModuleClass has had static stubs added (@see addDefaultStaticMethods)
 *
 * @param {Array.<ModuleId>} ModuleClasses - array of module class definitions
 * @returns {Array.<String>}
 */
// exports.flatModuleNames = function(decodedModuleNames) {
// 	let result = []

// 	decodedModuleNames.forEach((decodedModuleName) => {
// 		let subModuleNames = decodedModuleName.subNames
// 		if (subModuleNames.length) {
// 			subModuleNames.forEach((subModuleName) => {
// 				result.push(`${decodedModuleName.name}:${subModuleName}`)
// 			})
// 		}
// 		else {
// 			result.push(decodedModuleName.name)
// 		}
// 	})

// 	return result
// }
// exports.flatModuleNames = function(ModuleClasses) {
// 	let result = []

// 	ModuleClasses.forEach((ModuleClass) => {
// 		let subModuleNames = ModuleClass.subModuleNames()
// 		if (subModuleNames.length) {
// 			subModuleNames.forEach((subModuleName) => {
// 				result.push(`${ModuleClass.name}:${subModuleName}`)
// 			})
// 		}
// 		else {
// 			result.push(ModuleClass.name)
// 		}
// 	})

// 	return result
// }

/**
 * -------------------------------------------------------------------------------------------------
 * @param {Array.<Function>} ModuleClasses - array of module class definitions
 * @returns {Map.<String,Function>}
 */
exports.mapModuleClassesByName = function(ModuleClasses) {
	return new Map(ModuleClasses.map((x) => [x.name, x]))
}

/**
 * -------------------------------------------------------------------------------------------------
 * @param {Array.<String>} flatModuleNames - array of qualified module names
 * @returns {Array.<Object>}
 */
exports.unflatModuleNames = function(flatModuleNames) {
	let result = [],
		map = new Map()

	flatModuleNames.forEach((flatModuleName) => {
		let hasSubNames = flatModuleName.includes(':')
		if (hasSubNames) {
			let [name, subName] = flatModuleName.split(':', 2), // eslint-disable-line no-magic-numbers
				entry = map.get(name)

			if (entry) {
				entry.subNames.push(subName)
			}
			else {
				entry = {name, subNames: [subName]}
				map.set(name, entry)
				result.push(entry)
			}
		}
		else {
			result.push({name: flatModuleName, subNames: []})
		}
	})

	return result
}
