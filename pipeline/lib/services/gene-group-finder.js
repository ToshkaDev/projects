'use strict'

const distanceCutoff = 200 // See documentation
const MinGroupSize = 2

module.exports =
class GeneGroupFinder {
	constructor() {
		this.groups = []
	}
	parse(object) {
		let groups = []
		object.sort(function(a, b) {
			return a.start - b.start
		})
		let tempGroup = {items: [], strand: ''}
		object.forEach(function(element, i) {
			// console.log(tempGroup)
			// console.log(element)
			if (tempGroup.items.length === 0) {
				tempGroup = {items: [element], strand: element.strand}
			}
			else if (tempGroup.strand === element.strand && element.start - tempGroup.items[tempGroup.items.length - 1].stop < distanceCutoff) {
				// console.log("pushing element")
				tempGroup.items.push(element)
			}
			else {
				if (tempGroup.items.length >= MinGroupSize) groups.push(tempGroup.items)
				tempGroup = {items: [element], strand: element.strand}
			}
			// console.log("")
		})
		this.groups = groups
	}
}
