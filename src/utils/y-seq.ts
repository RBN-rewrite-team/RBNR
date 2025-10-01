import Decimal from 'break_eternity.js';

export interface LeafMountain {
	dim: 0;
	forcedParent: boolean;
	leftLegCoord: null | number[];
	rightLegCoord: null | number[];
	value: number;
	parentIndex: number;
	position: number;
	coord: number[];
}

export interface NodeMountain {
	arr: [Mountain, ...Mountain[]];
	coord: number[];
	dim: Exclude<number, 0>;
}

export type Mountain = LeafMountain | NodeMountain;

function getYSequenceWithoutColon(Y: string): {
	type: string;
	Y: string;
} {
	let type = '???';
	if (Y.startsWith('Y(')) {
	  type = '1-Y';
	  Y = Y.slice(2, -1);
	}
	if (Y.startsWith('ω-Y(')) {
	  type = 'ω-Y';
	  Y = Y.slice(4, -1);
	}
	return {
		type,
		Y,
	};
}

// https://naruyoko.github.io/MEGAwhYmountain/

/*
MIT License

Copyright (c) 2021 Naruyoko

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function parseSequenceElement(str: string, i: number): Partial<LeafMountain> & { value: number; position: number; parentIndex: number } {
	if (str.indexOf('v') === -1 || !isFinite(Number(str.substring(str.indexOf('v') + 1)))) {
		const numval = Number(str);
		return {
			value: numval,
			position: i,
			parentIndex: -1,
		};
	} else {
		return {
			value: Number(str.substring(0, str.indexOf('v'))),
			position: i,
			parentIndex: Math.max(Math.min(i - 1, Number(str.substring(str.indexOf('v') + 1))), -1),
			forcedParent: true,
		};
	}
}

function parseSequenceString(s: string): Array<Partial<LeafMountain> & { value: number; position: number; parentIndex: number }> {
	return s.split(',').map(parseSequenceElement);
}

function equalVector(s: number[], t: number[], d: number = 0): boolean {
	for (let i = d, l = Math.max(s.length, t.length); i < l; i++) {
		if ((s[i] || 0) !== (t[i] || 0)) return false;
	}
	return true;
}

function addVector(s: number[], t: number[]): number[] {
	const r: number[] = [];
	for (let i = 0, l = Math.max(s.length, t.length); i < l; i++) {
		r.push((s[i] || 0) + (t[i] || 0));
	}
	return r;
}

function stBasis(d: number): number[] {
	const r: number[] = [];
	while (r.length < d) r.push(0);
	r.push(1);
	return r;
}

function basis(d: number, k: number): number[] {
	const r: number[] = [];
	while (r.length < d) r.push(0);
	r.push(k);
	return r;
}

function incrementCoord(s: number[], d: number): number[] {
	const r = s.slice(0);
	for (let i = 0; i < d; i++) r[i] = 0;
	return addVector(r, stBasis(d));
}

function addCoord(s: number[], d: number, k: number): number[] {
	const r = s.slice(0);
	for (let i = 0; i < d; i++) r[i] = 0;
	return addVector(r, basis(d, k));
}

function sumArray(s: number[]): number {
	let r = 0;
	for (let i = 0; i < s.length; i++) r += s[i];
	return r;
}

export function calcMountain(s: string | Array<Partial<LeafMountain> & { value: number; position: number; parentIndex: number }> | NodeMountain, maxDim: number = Infinity): Mountain {
	if (maxDim === undefined) maxDim = Infinity;
	const coordOffset: number[] = typeof s === 'object' && 'coord' in s ? s.coord : [];

	if (typeof s === 'string') s = parseSequenceString(s);

	if (Array.isArray(s) && s.length <= 1) {
		return {
			dim: 1,
			arr: [
				{
					dim: 0,
					value: s[0].value,
					position: s[0].position,
					coord: coordOffset.slice(0),
					parentIndex: s[0].parentIndex,
					forcedParent: s[0].forcedParent,
					leftLegCoord: null,
					rightLegCoord: null,
				},
			],
			coord: coordOffset.slice(0),
		} as NodeMountain;
	} else if (!Array.isArray(s) && s.arr.length <= 1) {
		return s.arr[0];
	} else {
		let m: NodeMountain;
		if (Array.isArray(s)) {
			m = {
				dim: 1,
				arr: [],
				coord: coordOffset.slice(0),
			};
			for (let i = 0; i < s.length; i++) {
				m.arr.push({
					dim: 0,
					value: s[i].value,
					position: s[i].position,
					coord: addCoord(coordOffset, 0, i),
					parentIndex: s[i].parentIndex,
					forcedParent: s[i].forcedParent,
					leftLegCoord: null,
					rightLegCoord: null,
				} as LeafMountain);
				if (!s[i].forcedParent) {
					for (let j = i; j >= 0; j--) {
						if (s[j].value < s[i].value) {
							(m.arr[i] as LeafMountain).parentIndex = j;
							break;
						}
					}
				}
			}
		} else {
			m = s;
		}

		const lastPosition = sumArray(m.arr[m.arr.length - 1].coord);
		let dimensions = 1;
		while (dimensions <= maxDim) {
			const uppers = calcDifference(m);
			if (uppers.arr.length < 1) break;
			const upperm = calcMountain(uppers, dimensions);
			const upperdim = upperm.dim;
			let raisedupperm: NodeMountain = upperm as NodeMountain;
			while (raisedupperm.dim <= dimensions) {
				raisedupperm = {
					dim: raisedupperm.dim + 1,
					arr: [raisedupperm],
					coord: raisedupperm.coord.slice(0),
				};
			}
			raisedupperm.coord = coordOffset.slice(0);
			raisedupperm.arr.unshift(m);
			m = raisedupperm;
			dimensions++;
		}
		return m;
	}
}

function calcDifference(m: NodeMountain): NodeMountain {
	const coordOffset = incrementCoord(m.coord, m.dim);
	const rightLegs: Mountain[] = [];
	const rightLegTree: number[] = [];
	const rightLegPositions: number[] = [];

	if (m.dim === 1) {
		for (let i = 0; i < m.arr.length; i++) {
			rightLegs.push(m.arr[i]);
			rightLegTree.push((m.arr[i] as LeafMountain).parentIndex);
			rightLegPositions.push(sumArray(m.arr[i].coord));
		}
	} else {
		for (let i = 0; i <= getLastPosition(m); i++) {
			const node = findHighestWithPosition(m, i);
			if (node) rightLegPositions.push(i);
		}
		for (let i = 0; i < rightLegPositions.length; i++) {
			const node = findHighestWithPosition(m, rightLegPositions[i]);
			if (node) {
				rightLegs.push(node);
				let parentNode: Mountain | null = node;
				while (parentNode) {
					let grandParentNode = parent(m, parentNode as LeafMountain);
					if (!grandParentNode) grandParentNode = leftLeg(m, parentNode as LeafMountain);
					if (!grandParentNode) {
						rightLegTree.push(-1);
						break;
					}
					parentNode = grandParentNode;
					if ((parentNode as LeafMountain).parentIndex === -1 && rightLegPositions.indexOf(sumArray(parentNode.coord)) !== -1) {
						rightLegTree.push(rightLegPositions.indexOf(sumArray(parentNode.coord)));
						break;
					}
				}
				if (!parentNode) rightLegTree.push(-1);
			}
		}
	}

	const rightLegInR: number[] = [];
	const rInRightLeg: number[] = [];
	const rightLegParents: number[] = [];
	const r: NodeMountain = {
		dim: 1,
		arr: [],
		coord: coordOffset,
	};

	for (let i = 0; i < rightLegs.length; i++) {
		let pi = i;
		while (pi > -1 && !((rightLegs[pi] as LeafMountain).value < (rightLegs[i] as LeafMountain).value && (rightLegs[pi].coord[m.dim - 1] || 0) < (rightLegs[i].coord[m.dim - 1] || 0))) {
			pi = rightLegTree[pi];
		}
		rightLegParents.push(pi);
		if (pi !== -1) {
			rightLegInR.push(r.arr.length);
			rInRightLeg.push(i);
			r.arr.push({
				dim: 0,
				value: (rightLegs[i] as LeafMountain).value - (rightLegs[pi] as LeafMountain).value,
				position: rightLegPositions[i],
				coord: addCoord(coordOffset, 0, rightLegPositions[i] - sumArray(coordOffset)),
				parentIndex: -1,
				forcedParent: true,
				leftLegCoord: rightLegs[pi].coord.slice(0),
				rightLegCoord: rightLegs[i].coord.slice(0),
			} as LeafMountain);
		} else {
			rightLegInR.push(-1);
		}
	}

	for (let i = 0; i < r.arr.length; i++) {
		let pi = rInRightLeg[i];
		while (true) {
			const ppi = rightLegParents[pi];
			if (ppi === -1 || rightLegInR[ppi] === -1) break;
			pi = ppi;
			if ((r.arr[rightLegInR[pi]] as LeafMountain).value < (r.arr[i] as LeafMountain).value) {
				(r.arr[i] as LeafMountain).parentIndex = rightLegInR[pi];
				break;
			}
		}
	}
	return r;
}

function indexFromCoord(m: Mountain, coord: number[], d: number = 0): number[] | null {
	const r: number[] = [];
	let currentMountain: Mountain = m;

	while (true) {
		if (currentMountain.dim <= d) {
			if (equalVector(currentMountain.coord, coord, d)) return r;
			else return null;
		}

		if (currentMountain.dim === 1) {
			for (let i = 0; i < (currentMountain as NodeMountain).arr.length + 1; i++) {
				if (i === (currentMountain as NodeMountain).arr.length) return null;
				if (((currentMountain as NodeMountain).arr[i].coord[0] || 0) === (coord[0] || 0)) {
					r.push(i);
					currentMountain = (currentMountain as NodeMountain).arr[i];
					break;
				}
			}
		} else {
			const nodeMountain = currentMountain as NodeMountain;
			const i = coord[nodeMountain.dim - 1] || 0;
			if (i >= nodeMountain.arr.length) return null;
			r.push(i);
			currentMountain = nodeMountain.arr[i];
		}
	}
}

export function findByIndex(m: Mountain, index: number[]): Mountain | null {
	if (!index) return null;
	let current: Mountain = m;
	for (let i = 0; i < index.length; i++) {
		const node = current as NodeMountain;
		const idx = index[i] < 0 ? node.arr.length + index[i] : index[i];
		if (idx >= node.arr.length) return null;
		current = node.arr[idx];
	}
	return current;
}

export function findByCoord(m: Mountain, coord: number[], d?: number): Mountain | null {
	return findByIndex(m, indexFromCoord(m, coord, d) || []);
}

function getLastPosition(m: Mountain): number {
	let current: Mountain = m;
	while (current.dim > 1) {
		current = (current as NodeMountain).arr[0];
	}
	return ((current as NodeMountain).arr[(current as NodeMountain).arr.length - 1] as LeafMountain).position;
}

function findHighestWithPosition(m: Mountain, position: number): LeafMountain | null {
	if (m.dim === 0) {
		if ((m as LeafMountain).position === position) return m as LeafMountain;
		else return null;
	} else {
		const node = m as NodeMountain;
		if (node.arr.length === 0) return null;

		if (node.dim === 1) {
			let min = 0;
			let max = node.arr.length - 1;
			if ((node.arr[min] as LeafMountain).position > position || (node.arr[max] as LeafMountain).position < position) return null;
			if ((node.arr[min] as LeafMountain).position === position) return node.arr[min] as LeafMountain;
			if ((node.arr[max] as LeafMountain).position === position) return node.arr[max] as LeafMountain;

			while (min !== max) {
				const mid = Math.floor((min + max) / 2);
				if ((node.arr[mid] as LeafMountain).position === position) return node.arr[mid] as LeafMountain;
				else if (min === mid) return null;
				else if ((node.arr[mid] as LeafMountain).position < position) min = mid;
				else if ((node.arr[mid] as LeafMountain).position > position) max = mid;
			}
			return null;
		} else {
			for (let i = node.arr.length - 1; i >= 0; i--) {
				let lowestRow: Mountain = node.arr[i];
				while (lowestRow && lowestRow.dim > 1) {
					lowestRow = (lowestRow as NodeMountain).arr[0];
				}
				if (!lowestRow) continue;
				const nodeInLowestRow = findHighestWithPosition(lowestRow, position);
				if (nodeInLowestRow) {
					if (node.dim === 2) return nodeInLowestRow;
					else return findHighestWithPosition(node.arr[i], position);
				}
			}
			return null;
		}
	}
}

function parent(m: NodeMountain, node: LeafMountain): Mountain | null {
	if (node.dim !== 0 || node.parentIndex === -1) return null;
	const index = indexFromCoord(m, node.coord);
	if (!index) return null;
	index[index.length - 1] = node.parentIndex;
	return findByIndex(m, index);
}

function leftLeg(m: NodeMountain, node: LeafMountain): Mountain | null {
	if (node.dim !== 0 || !node.leftLegCoord) return null;
	return findByCoord(m, node.leftLegCoord);
}

function rightLeg(m: NodeMountain, node: LeafMountain): Mountain | null {
	if (node.dim !== 0 || !node.rightLegCoord) return null;
	return findByCoord(m, node.rightLegCoord);
}

function flattenMountain(m: Mountain): Record<string, Mountain> {
	const r: Record<string, Mountain> = {};
	if (m.dim === 0) {
		r[m.coord.join(',')] = m;
	} else {
		const node = m as NodeMountain;
		for (let i = 0; i < node.arr.length; i++) {
			Object.assign(r, flattenMountain(node.arr[i]));
		}
	}
	return r;
}
/**
 * 无固定底数
 */
export const Y_Milestones = [
	[new Decimal(0), 'Y()', '0'],
	[new Decimal(1), 'Y(1)', '1'],
	[new Decimal(2), 'Y(1,1)', '2'],
	[new Decimal(3), 'Y(1,1,1)', '3'],
	[new Decimal(4), 'Y(1,2)', 'ω', 'FTO'],
	[new Decimal(5), 'Y(1,2,1)', 'ω+1'],
	[new Decimal(6), 'Y(1,2,1,1)', 'ω+2'],
	[new Decimal(7), 'Y(1,2,1,1,1)', 'ω+3'],
	[new Decimal(8), 'Y(1,2,1,2)', 'ω\\cdot2'],
	[new Decimal(9), 'Y(1,2,1,2,1)', 'ω\\cdot2+1'],
	[new Decimal(10), 'Y(1,2,1,2,1,1)', 'ω\\cdot2+2'],
	[new Decimal(11), 'Y(1,2,1,2,1,1,1)', 'ω\\cdot2+3'],
	[new Decimal(12), 'Y(1,2,1,2,1,2)', 'ω\\cdot3'],
	[new Decimal(13), 'Y(1,2,1,2,1,2,1)', 'ω\\cdot3+1'],
	[new Decimal(14), 'Y(1,2,1,2,1,2,1,1)', 'ω\\cdot3+2'],
	[new Decimal(15), 'Y(1,2,1,2,1,2,1,1,1)', 'ω\\cdot3+3'],
	[new Decimal(16), 'Y(1,2,2)', 'ω^2'],
	[new Decimal(17), 'Y(1,2,2,1,2)', 'ω^2+ω'],
	[new Decimal(18), 'Y(1,2,2,1,2,1,2)', 'ω^2+ω\\cdot2'],
	[new Decimal(19), 'Y(1,2,2,1,2,1,2,1,2)', 'ω^2+ω\\cdot3'],
	[new Decimal(20), 'Y(1,2,2,1,2,2)', 'ω^2\\cdot2'],
	[new Decimal(21), 'Y(1,2,2,1,2,2,1,2)', 'ω^2\\cdot2+ω'],
	[new Decimal(22), 'Y(1,2,2,1,2,2,1,2,1,2)', 'ω^2\\cdot2+ω\\cdot2'],
	[new Decimal(23), 'Y(1,2,2,1,2,2,1,2,1,2,1,2)', 'ω^2\\cdot2+ω\\cdot3'],
	[new Decimal(24), 'Y(1,2,2,1,2,2,1,2,2)', 'ω^2\\cdot3'],
	[new Decimal(25), 'Y(1,2,2,1,2,2,1,2,2,1,2)', 'ω^2\\cdot3+ω'],
	[new Decimal(26), 'Y(1,2,2,1,2,2,1,2,2,1,2,1,2)', 'ω^2\\cdot3+ω\\cdot2'],
	[new Decimal(27), 'Y(1,2,2,1,2,2,1,2,2,1,2,1,2,1,2)', 'ω^2\\cdot3+ω\\cdot3'],
	[new Decimal(28), 'Y(1,2,2,2)', 'ω^3'],
	[new Decimal(29), 'Y(1,2,2,2,1,2,2)', 'ω^3+ω^2'],
	[new Decimal(30), 'Y(1,2,2,2,1,2,2,2)', 'ω^3\\cdot2'],
	[new Decimal(31), 'Y(1,2,2,2,1,2,2,2,1,2,2,2)', 'ω^3\\cdot3'],
	[new Decimal(32), 'Y(1,2,3)', 'ω^ω', 'LAO'],
	[new Decimal(33), 'Y(1,2,3,2,3)', 'ω^{ω\\cdot2}'],
	[new Decimal(34), 'Y(1,2,3,2,3,2,3)', 'ω^{ω\\cdot3}'],
	[new Decimal(35), 'Y(1,2,3,3)', 'ω^{ω^2}'],
	[new Decimal(36), 'Y(1,2,3,3,2,3,3)', 'ω^{ω^2\\cdot2}'],
	[new Decimal(37), 'Y(1,2,3,3,2,3,3,2,3,3)', 'ω^{ω^2\\cdot3}'],
	[new Decimal(38), 'Y(1,2,3,3,3)', 'ω^{ω^3}'],
	[new Decimal(39), 'Y(1,2,3,3,3,2,3,3,3)', 'ω^{ω^3\\cdot2}'],
	[new Decimal(40), 'Y(1,2,3,3,3,2,3,3,3,2,3,3,3)', 'ω^{ω^3\\cdot3}'],
	[new Decimal(41), 'Y(1,2,4)', 'ε_0', 'SCO'],
	[new Decimal(42), 'Y(1,2,4,1)', 'ε_0+1'],
	[new Decimal(43), 'Y(1,2,4,2)', 'ε_0\\cdotω'],
	[new Decimal(44), 'Y(1,2,4,3)', 'ε_0^ω'],
	[new Decimal(45), 'Y(1,2,4,3,5)', 'ε_0^ε_0'],
	[new Decimal(46), 'Y(1,2,4,3,5,4,6)', 'ε_0^ε_0^ε_0'],
	[new Decimal(47), 'Y(1,2,4,4)', 'ε_1'],
	[new Decimal(48), 'Y(1,2,4,4,3,5,5)', 'ε_1^ε_1'],
	[new Decimal(49), 'Y(1,2,4,4,4)', 'ε_2'],
	[new Decimal(50), 'Y(1,2,4,5)', 'ε_ω'],
	[new Decimal(51), 'Y(1,2,4,5,4)', 'ε_{ω+1}'],
	[new Decimal(52), 'Y(1,2,4,5,4,5)', 'ε_{ω\\cdot2}'],
	[new Decimal(53), 'Y(1,2,4,5,4,5,4,5)', 'ε_{ω\\cdot3}'],
	[new Decimal(54), 'Y(1,2,4,5,5)', 'ε_{ω^2}'],
	[new Decimal(55), 'Y(1,2,4,5,5,4,5,5)', 'ε_{ω^2\\cdot2}'],
	[new Decimal(56), 'Y(1,2,4,5,5,4,5,5,4,5,5)', 'ε_{ω^2\\cdot3}'],
	[new Decimal(57), 'Y(1,2,4,5,5,5)', 'ε_{ω^3}'],
	[new Decimal(58), 'Y(1,2,4,5,6)', 'ε_{ω^ω}'],
	[new Decimal(59), 'Y(1,2,4,5,7)', 'ε_{ε_0}'],
	[new Decimal(60), 'Y(1,2,4,5,7,7)', 'ε_{ε_1}'],
	[new Decimal(61), 'Y(1,2,4,5,7,7,7)', 'ε_{ε_2}'],
	[new Decimal(62), 'Y(1,2,4,5,7,8)', 'ε_{ε_ω}'],
	[new Decimal(63), 'Y(1,2,4,5,7,8,10)', 'ε_{ε_{ε_0}}'],
	[new Decimal(64), 'Y(1,2,4,6)', 'ζ_0', 'CO'],
	[new Decimal(65), 'Y(1,2,4,6,2)', 'ζ_0\\cdotω'],
	[new Decimal(66), 'Y(1,2,4,6,3)', 'ζ_0^ω'],
	[new Decimal(67), 'Y(1,2,4,6,3,5,7)', 'ζ_0^{ζ_0}'],
	[new Decimal(68), 'Y(1,2,4,6,4)', 'ε_{ζ_0+1}'],
	[new Decimal(69), 'Y(1,2,4,6,4,5)', 'ε_{ζ_0+ω}'],
	[new Decimal(70), 'Y(1,2,4,6,4,5,7)', 'ε_{ζ_0+ε_0}'],
	[new Decimal(71), 'Y(1,2,4,6,4,5,7,9)', 'ε_{ζ_0\\cdot2}'],
	[new Decimal(72), 'Y(1,2,4,6,4,6)', 'ζ_1'],
	[new Decimal(73), 'Y(1,2,4,6,4,6,4,6)', 'ζ_2'],
	[new Decimal(74), 'Y(1,2,4,6,5)', 'ζ_ω'],
	[new Decimal(75), 'Y(1,2,4,6,5,6)', 'ζ_{ω^ω}'],
	[new Decimal(76), 'Y(1,2,4,6,5,7)', 'ζ_{ε_0}'],
	[new Decimal(77), 'Y(1,2,4,6,5,7,8)', 'ζ_{ε_ω}'],
	[new Decimal(78), 'Y(1,2,4,6,5,7,9)', 'ζ_{ζ_0}'],
	[new Decimal(79), 'Y(1,2,4,6,5,7,9,8,10,12)', 'ζ_{ζ_{ζ_0}}'],
	[new Decimal(80), 'Y(1,2,4,6,6)', 'η_0', 'LCO'],
	[new Decimal(81), 'Y(1,2,4,6,6,4)', 'ε_{η_0+1}'],
	[new Decimal(82), 'Y(1,2,4,6,6,4,5,7,9,9)', 'ε_{η_0\\cdot2}'],
	[new Decimal(83), 'Y(1,2,4,6,6,4,5,7,9,9,7)', 'ε_{ε_{η_0+1}}'],
	[new Decimal(84), 'Y(1,2,4,6,6,4,6)', 'ζ_{η_0+1}'],
	[new Decimal(85), 'Y(1,2,4,6,6,4,6,5,7,9,9)', 'ζ_{η_0\\cdot2}'],
	[new Decimal(86), 'Y(1,2,4,6,6,4,6,5,7,9,9,7)', 'ζ_{ζ_{η_0+1}}'],
	[new Decimal(87), 'Y(1,2,4,6,6,4,6,6)', 'η_1'],
	[new Decimal(88), 'Y(1,2,4,6,6,4,6,6,5)', 'η_ω'],
	[new Decimal(89), 'Y(1,2,4,6,6,4,6,6,5,7)', 'η_{ε_0}'],
	[new Decimal(90), 'Y(1,2,4,6,6,4,6,6,5,7,8)', 'η_{ε_ω}'],
	[new Decimal(91), 'Y(1,2,4,6,6,4,6,6,5,7,9)', 'η_{ζ_0}'],
	[new Decimal(92), 'Y(1,2,4,6,6,4,6,6,5,7,9,9)', 'η_{η_0}'],
	[new Decimal(93), 'Y(1,2,4,6,6,6)', 'φ(4,0)'],
	[new Decimal(94), 'Y(1,2,4,6,6,6,4,6,6,6)', 'φ(4,1)'],
	[new Decimal(95), 'Y(1,2,4,6,6,6,5)', 'φ(4,ω)'],
	[new Decimal(96), 'Y(1,2,4,6,7)', 'φ(ω,0) = ψ(Ω^ω)', 'HCO'],
	[new Decimal(100), 'Y(1,2,4,6,8)', 'φ(1,0,0) = ψ(Ω^Ω)', 'FSO'],
	[new Decimal(104), 'Y(1,2,4,6,8,8)', 'φ(1,0,0,0) = ψ(Ω^{Ω^2})', 'ACO'],
	[new Decimal(108), 'Y(1,2,4,6,8,9)', 'φ(1@ω) = ψ(Ω^{Ω^ω})', 'SVO'],
	[new Decimal(112), 'Y(1,2,4,6,8,10)', 'φ(1@(1,0)) = ψ(Ω^{Ω^Ω})', 'LVO'],
	[new Decimal(116), 'Y(1,2,4,6,8,11)', 'φ(1@(1@ω)) = ψ(Ω^{Ω^{Ω^ω}})', 'ESVO'],
	[new Decimal(120), 'Y(1,2,4,6,8,12)', 'φ(1@(1@(1,0))) = ψ(Ω^{Ω^{Ω^Ω}})', 'ELVO'],
	[new Decimal(124), 'Y(1,2,4,6,8,12,14)', 'φ(1@(1@(1@(1,0)))) = ψ(Ω^{Ω^{Ω^{Ω^Ω}}})'],
	[new Decimal(128), 'Y(1,2,4,7)', 'ψ(Ω_2)', 'BHO'],
	[new Decimal(144), 'Y(1,2,4,7,10,12)', 'ψ(Ω_2^Ω)'],
	[new Decimal(160), 'Y(1,2,4,7,10,13)', 'ψ(Ω_2^{Ω_2})'],
	[new Decimal(176), 'Y(1,2,4,7,10,13,16)', 'ψ(Ω_2^{Ω_2^{Ω_2}})'],
	[new Decimal(192), 'Y(1,2,4,7,11)', 'ψ(Ω_3)'],
	[new Decimal(208), 'Y(1,2,4,7,11,15,19)', 'ψ(Ω_3^{Ω_3})'],
	[new Decimal(224), 'Y(1,2,4,7,11,16)', 'ψ(Ω_4)'],
	[new Decimal(232), 'Y(1,2,4,7,11,16,21,26)', 'ψ(Ω_4^{Ω_4})'],
	[new Decimal(240), 'Y(1,2,4,7,11,16,22)', 'ψ(Ω_5)'],
	[new Decimal(248), 'Y(1,2,4,7,11,16,22,29)', 'ψ(Ω_6)'],
	[new Decimal(252), 'Y(1,2,4,7,11,16,22,29,37)', 'ψ(Ω_7)'],
	[new Decimal(254), 'Y(1,2,4,7,11,16,22,29,37,46)', 'ψ(Ω_8)'],
	[new Decimal(255), 'Y(1,2,4,7,11,16,22,29,37,46,56)', 'ψ(Ω_9)'],
	[new Decimal(256), 'Y(1,2,4,8)', 'ψ(Ω_ω)', '(0,0,0)(1,1,1)', 'BO'],
	[new Decimal(272), 'Y(1,2,4,8,11,15)', 'ψ(Ω_{ω+1})', '(0,0,0)(1,1,1)(2,1,0)(3,2,0)', 'TFBO'],
	[new Decimal(384), 'Y(1,2,4,8,12,14)', 'ψ(Ω_Ω)', '(0,0,0)(1,1,1)(2,1,1)(3,1,0)', 'BIO'],
	[new Decimal(448), 'Y(1,2,4,8,12,14,9)', 'ψ(I)', '(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,0,0)', 'EBO'],
	[new Decimal(480), 'Y(1,2,4,8,12,15,19)', 'ψ(Ω_{I+1})', '(0,0,0)(1,1,1)(2,1,1)(3,1,0)(4,2,0)', 'JO'],
	[new Decimal(512), 'Y(1,2,4,8,12,16)', 'ψ(I_ω)', '(0,0,0)(1,1,1)(2,1,1)(3,1,1)', 'SIO'],
	[new Decimal(544), 'Y(1,2,4,8,12,16,13)', 'ψ(I(ω,0))', '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(3,0,0)', 'MBO'],
	[new Decimal(576), 'Y(1,2,4,8,12,16,15,19)', 'ψ(Ω_{M+1})', '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(3,1,0)(4,2,0)', 'SRO'],
	[new Decimal(592), 'Y(1,2,4,8,12,16,16)', 'ψ(M_ω)', '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(3,1,1)', 'SMO'],
	[new Decimal(600), 'Y(1,2,4,8,12,16,16,16)', 'ψ(N_ω)', '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(3,1,1)(3,1,1)', 'SNO'],
	[new Decimal(640), 'Y(1,2,4,8,12,16,19,23)', 'ψ(2\\textrm{ aft }3)', '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(4,1,0)(5,2,0)', 'RO'],
	[new Decimal(672), 'Y(1,2,4,8,12,16,20)', 'ψ(1-3)', '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(4,1,1)', 'SKO'],
	[new Decimal(736), 'Y(1,2,4,8,13)', 'ψ(Π_ω)', '(0,0,0)(1,1,1)(2,0,0)', 'SSO'],
	[new Decimal(768), 'Y(1,2,4,8,14,19,22,9)', '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(4,1,0)(5,2,0)', 'LSO'],
	[new Decimal(896), 'Y(1,2,4,8,14,21)', '(0,0,0)(1,1,1)(2,1,1)(3,3,0)', 'DSO'],
	[new Decimal(960), 'Y(1,2,4,8,14,22,31)', '(0,0,0)(1,1,1)(2,1,1)(3,3,1)(4,4,0)', 'TSO'],
	[new Decimal(1024), 'Y(1,2,4,8,15)', 'ψ(ω-π-Π_0)', '(0,0,0)(1,1,1)(2,2,2)', 'pLRO'],
	[new Decimal(1536), 'Y(1,2,4,8,15,22,29,28)', '(0,0,0)(1,1,1)(2,2,2)(3,2,2)(4,2,2)(4,2,1)', 'M2O'],
	[new Decimal(2048), 'Y(1,2,4,8,15,26)', '(0,0,0)(1,1,1)(2,2,2)(3,3,3)'],
	[new Decimal(3072), 'Y(1,2,4,8,15,26,42)', '(0,0,0)(1,1,1)(2,2,2)(3,3,3)(4,4,4)'],
	[new Decimal(3584), 'Y(1,2,4,8,15,26,42,64)', '(0,0,0)(1,1,1)(2,2,2)(3,3,3)(4,4,4)(5,5,5)'],
	[new Decimal(4096), 'Y(1,2,4,8,16)', '(0)(1,1,1,1)', 'TSSO'],
	[new Decimal(6144), 'Y(1,2,4,8,16,29)', '(0)(1,1,1,1)(2,2,2)'],
	[new Decimal(8192), 'Y(1,2,4,8,16,31)', '(0)(1,1,1,1)(2,2,2,2)'],
	[new Decimal(12288), 'Y(1,2,4,8,16,31,57)', '(0)(1,1,1,1)(2,2,2,2)(3,3,3,3)'],
	[new Decimal(16384), 'Y(1,2,4,8,16,32)', '(0)(1,1,1,1,1)', 'QSSO'],
	[new Decimal(32768), 'Y(1,2,4,8,16,32,64)', '(0)(1^6)'],
	[new Decimal(49152), 'Y(1,2,4,8,16,32,64,128)', '(0)(1^7)'],
	[new Decimal(57344), 'Y(1,2,4,8,16,32,64,128,256)', '(0)(1^8)'],
	[new Decimal(61440), 'Y(1,2,4,8,16,32,64,128,256,512)', '(0)(1^9)'],
	[new Decimal(63488), 'Y(1,2,4,8,16,32,64,128,256,512,1024)', '(0)(1^{10})'],
	[new Decimal(65536), 'Y(1,3)', '(0)(1^ω)', 'SHO'],
	[new Decimal(66560), 'Y(1,3,1,3)', '(0)(1^ω)(0)(1^ω)'],
	[new Decimal(67584), 'Y(1,3,1,3,1,3)', '(0)(1^ω)(0)(1^ω)(0)(1^ω)'],
	[new Decimal(68608), 'Y(1,3,1,3,1,3,1,3)', '(0)(1^ω)(0)(1^ω)(0)(1^ω)(0)(1^ω)'],
	[new Decimal(69632), 'Y(1,3,2)', '(0)(1^ω)(1)'],
	[new Decimal(70656), 'Y(1,3,2,2)', '(0)(1^ω)(1)(1)'],
	[new Decimal(71680), 'Y(1,3,2,3)', '(0)(1^ω)(1)(2)'],
	[new Decimal(72704), 'Y(1,3,2,3,4)', '(0)(1^ω)(1)(2)(3)'],
	[new Decimal(73728), 'Y(1,3,2,4)', '(0)(1^ω)(1)(2,1)'],
	[new Decimal(74752), 'Y(1,3,2,4,8)', '(0)(1^ω)(1)(2,1,1)'],
	[new Decimal(75776), 'Y(1,3,2,5)', '(0)(1^ω)(1)(2,1^ω)'],
	[new Decimal(76800), 'Y(1,3,2,5,4)', '(0)(1^ω)(1,1)'],
	[new Decimal(77824), 'Y(1,3,2,5,4,4)', '(0)(1^ω)(1,1)(1,1)'],
	[new Decimal(78848), 'Y(1,3,2,5,4,5)', '(0)(1^ω)(1,1)(2)'],
	[new Decimal(79872), 'Y(1,3,2,5,4,7)', '(0)(1^ω)(1,1)(2,2)'],
	[new Decimal(80896), 'Y(1,3,2,5,4,8)', '(0)(1^ω)(1,1)(2,2,1)'],
	[new Decimal(81920), 'Y(1,3,2,5,4,9)', '(0)(1^ω)(1,1)(2,2,1^ω)'],
	[new Decimal(98304), 'Y(1,3,3)', '(0)(1^ω)(1^ω)'],
	[new Decimal(131072), 'Y(1,3,4)', '(0)(1^ω)(2)'],
	// 1,3,4,3提升
	[new Decimal(262144), 'Y(1,3,4,2,5)', '(0)(1^ω)(2)(1)(2,1^ω)'],
	[new Decimal(524288), 'Y(1,3,4,2,5,6,5)', '(0)(1^ω)(2)(1^ω)'],
	[new Decimal(1048576), 'Y(1,3,4,2,5,6,5,6)', '(0)(1^ω)(2)(1^ω)(2)'],
	[new Decimal(2 ** 21), 'Y(1,3,4,2,5,6,6)', '(0)(1^ω)(2)(2)'],
	[new Decimal(2 ** 22), 'Y(1,3,4,2,5,6,6,6)', '(0)(1^ω)(2)(2)(2)'],
	[new Decimal(2 ** 23), 'Y(1,3,4,2,5,6,7)', '(0)(1^ω)(2)(3)'],
	[new Decimal(2 ** 24), 'Y(1,3,4,2,5,6,8)', '(0)(1^ω)(2)(3,1)'],
	[new Decimal(2 ** 25), 'Y(1,3,4,2,5,6,8,11)', '(0)(1^ω)(2)(3,1)(4,2)'],
	[new Decimal(2 ** 26), 'Y(1,3,4,2,5,6,8,12)', '(0)(1^ω)(2)(3,1,1)'],
	[new Decimal(2 ** 27), 'Y(1,3,4,2,5,6,9)', '(0)(1^ω)(2)(3,1^ω)'],
	[new Decimal(2 ** 28), 'Y(1,3,4,2,5,6,9,10,13)', '(0)(1^ω)(2)(3,1^ω)(3)(4,1^ω)'],
	[new Decimal(2 ** 29), 'Y(1,3,4,2,5,7)', '(0)(1^ω)(2,1)'],
	[new Decimal(2 ** 30), 'Y(1,3,4,2,5,7,4,9,12)', '(0)(1^ω)(2,1)(1,1)(2,2,1^ω)(3,2)'],
	[new Decimal(2 ** 31), 'Y(1,3,4,2,5,7,4,9,13)', '(0)(1^ω)(2,1,1)'],
	[new Decimal(2 ** 32), 'Y(1,3,4,2,5,7,5)', '(0)(1^ω)(2,1^ω)'],
	[new Decimal(2 ** 33), 'Y(1,3,4,2,5,7,9)', '(0)(1^ω)(2,1^ω)(3,1)'],
	[new Decimal(2 ** 34), 'Y(1,3,4,2,5,7,10)', '(0)(1^ω)(2,2)'],
	[new Decimal(2 ** 35), 'Y(1,3,4,2,5,7,10,4,9,13,19)', '(0)(1^ω)(2,2,1^ω)'],
	[new Decimal(2 ** 36), 'Y(1,3,4,2,5,7,10,5)', '(0)(1^ω)(2^ω)'],
	[new Decimal(2 ** 37), 'Y(1,3,4,2,5,7,11)', '(0)(1^{ω+1})'],
	[new Decimal(2 ** 38), 'Y(1,3,4,2,5,7,11,7)', '(0)(1^{ω+1})(1^ω)(2^ω,1)(2,1)'],
	[new Decimal(2 ** 39), 'Y(1,3,4,2,5,7,11,7,11)', '(0)(1^{ω+1})(1^ω)(2^ω,1)(2,1^ω)(3,2^ω,1)'],
	[new Decimal(2 ** 40), 'Y(1,3,4,2,5,7,11,8)', '(0)(1^{ω+1})(1^ω)(2^ω,1)(2,1^ω)(3,2^ω,1)(3)'],
	[new Decimal(2 ** 41), 'Y(1,3,4,2,5,7,11,9)', '(0)(1^{ω+1})(1^ω)(2^ω,1)(2,1^ω)(3,2^ω,1)(3,1)'],
	[new Decimal(2 ** 42), 'Y(1,3,4,2,5,7,11,10)', '(0)(1^{ω+1})(1^ω)(2^ω,1)(2,2)'],
	[new Decimal(2 ** 43), 'Y(1,3,4,2,5,7,11,11)', '(0)(1^{ω+1})(1^{ω+1})'],
	[new Decimal(2 ** 44), 'Y(1,3,4,2,5,7,11,12)', '(0)(1^{ω+1})(2)'],
	[new Decimal(2 ** 45), 'Y(1,3,4,2,5,7,11,13)', '(0)(1^{ω+1})(2,1)'],
	[new Decimal(2 ** 46), 'Y(1,3,4,2,5,7,11,13,5)', '(0)(1^{ω+1})(2,1^ω)'],
	[new Decimal(2 ** 47), 'Y(1,3,4,2,5,7,11,13,16,5)', '(0)(1^{ω+1})(2,1^ω)(3,2^ω)'],
	[new Decimal(2 ** 48), 'Y(1,3,4,2,5,7,11,13,17)', '(0)(1^{ω+1})(2,1^ω)(3,2^ω,1)'],
	[new Decimal(2 ** 49), 'Y(1,3,4,2,5,7,11,13,17,11)', '(0)(1^{ω+1})(2,1^ω)(3,2^ω,1)(1^{ω+1})'],
	[new Decimal(2 ** 50), 'Y(1,3,4,2,5,7,11,13,17,13,5)', '(0)(1^{ω+1})(2,1^ω)(3,2^ω,1)(2,1^ω)'],
	[new Decimal(2 ** 51), 'Y(1,3,4,2,5,7,11,13,17,17)', '(0)(1^{ω+1})(2,1^ω)(3,2^ω,1)(3,2^ω,1)'],
	[new Decimal(2 ** 52), 'Y(1,3,4,2,5,7,11,13,17,19,5)', '(0)(1^{ω+1})(2,1^ω)(3,2^ω,1)(4,1^ω)'],
	[new Decimal(2 ** 53), 'Y(1,3,4,2,5,7,11,13,17,19,22,5)', '(0)(1^{ω+1})(2,1^ω)(3,2^ω,1)(4,1^ω)(5,2^ω)'],
	[new Decimal(2 ** 54), 'Y(1,3,4,2,5,7,11,14)', '(0)(1^{ω+1})(2,1^ω)(3,2^ω,1)(4,2)'],
	[new Decimal(2 ** 55), 'Y(1,3,4,2,5,7,11,14,5)', '(0)(1^{ω+1})(2,1^ω)(3,2^ω,1)(4,2^ω)'],
	[new Decimal(2 ** 56), 'Y(1,3,4,2,5,7,11,14,16,5)', '(0)(1^{ω+1})(2,1^ω)(3,2^ω,1)(4,2^ω)(5,1^ω)'],
	[new Decimal(2 ** 57), 'Y(1,3,4,2,5,7,11,14,17,5)', '(0)(1^{ω+1})(2,1^ω)(3,2^ω,1)(4,2^ω)(5,2^ω)'],
	[new Decimal(2 ** 58), 'Y(1,3,4,2,5,7,11,14,18,5)', '(0)(1^{ω+1})(2,1^ω)(3,2^ω,1)(4,2^ω)(5,3^ω)'],
	[new Decimal(2 ** 59), 'Y(1,3,4,2,5,7,11,14,19)', '(0)(1^{ω+1})(2,1^ω)(3,2^ω,1)(4,2^ω)(5,3^ω,1)'],
	[new Decimal(2 ** 60), 'Y(1,3,4,2,5,7,11,15)', '(0)(1^{ω+1})(2,1^{ω+1})'],
	[new Decimal(2 ** 61), 'Y(1,3,4,2,5,7,11,15,17,5)', '(0)(1^{ω+1})(2,1^{ω+1})(3,1^ω)'],
	[new Decimal(2 ** 62), 'Y(1,3,4,2,5,7,11,15,18)', '(0)(1^{ω+1})(2,1^{ω+1})(3,1^ω)(4,2^{ω+1})(5,2^{ω+1})(6,2)'],
	[new Decimal(2 ** 63), 'Y(1,3,4,2,5,7,11,15,19)', '(0)(1^{ω+1})(2,1^{ω+1})(3,1^{ω+1})'],
	[new Decimal(2 ** 64), 'Y(1,3,4,2,5,7,11,16)', '(0)(1^{ω+1})(2,2)'],
	[new Decimal(2 ** 72), 'Y(1,3,4,2,5,7,11,17)', '(0)(1^{ω+1})(2^ω,1)'],
	[new Decimal(2 ** 80), 'Y(1,3,4,2,5,7,11,18)', '(0)(1^{ω+1})(2^{ω+1})'],
	[new Decimal(2 ** 88), 'Y(1,3,4,2,5,7,11,19)', '(0)(1^{ω+2})'],
	[new Decimal(2 ** 96), 'Y(1,3,4,2,5,7,11,19,23)', '(0)(1^{ω+2})(2,1^{ω+1})'],
	[new Decimal(2 ** 104), 'Y(1,3,4,2,5,7,11,19,35)', '(0)(1^{ω+3})'],
	[new Decimal(2 ** 112), 'Y(1,3,4,2,5,7,11,19,35,67)', '(0)(1^{ω+4})'],
	[new Decimal(2 ** 116), 'Y(1,3,4,2,5,7,11,19,35,67,131)', '(0)(1^{ω+5})'],
	[new Decimal(2 ** 120), 'Y(1,3,4,2,5,7,12)', '(0)(1^{ω\\cdot2})'],
	[new Decimal(2 ** 128), 'Y(1,3,4,2,5,7,12,16,24)', '(0)(1^{ω\\cdot2+1})'],
	[new Decimal(2 ** 136), 'Y(1,3,4,2,5,7,12,16,25)', '(0)(1^{ω\\cdot3})'],
	[new Decimal(2 ** 144), 'Y(1,3,4,2,5,7,12,16,25,33,50)', '(0)(1^{ω\\cdot4})'],
	[new Decimal(2 ** 152), 'Y(1,3,4,2,5,8)', '(0)(1^{ω^2})'],
	[new Decimal(2 ** 156), 'Y(1,3,4,2,5,8,5)', '(0)(1^{ω^2})(1^ω)'],
	[new Decimal(2 ** 160), 'Y(1,3,4,2,5,8,6)', '(0)(1^{ω^2})(2)'],
	[new Decimal(2 ** 168), 'Y(1,3,4,2,5,8,7)', '(0)(1^{ω^2})(2,1)'],
	[new Decimal(2 ** 170), 'Y(1,3,4,2,5,8,7,5)', '(0)(1^{ω^2})(2,1^ω)'],
	[new Decimal(2 ** 172), 'Y(1,3,4,2,5,8,7,5,7,12,16)', '(0)(1^{ω^2})(2,1^{ω+1})'],
	[new Decimal(2 ** 174), 'Y(1,3,4,2,5,8,7,5,8)', '(0)(1^{ω^2})(2,1^{ω^2})'],
	[new Decimal(2 ** 176), 'Y(1,3,4,2,5,8,7,10)', '(0)(1^{ω^2})(2,2)'],
	[new Decimal(2 ** 177), 'Y(1,3,4,2,5,8,7,10,5)', '(0)(1^{ω^2})(2^ω)'],
	[new Decimal(2 ** 178), 'Y(1,3,4,2,5,8,7,10,5,8)', '(0)(1^{ω^2})(2^{ω^2})'],
	[new Decimal(2 ** 180), 'Y(1,3,4,2,5,8,7,11)', '(0)(1^{ω^2+1})'],
	[new Decimal(2 ** 181), 'Y(1,3,4,2,5,8,7,12)', '(0)(1^{ω^2+ω})'],
	[new Decimal(2 ** 182), 'Y(1,3,4,2,5,8,7,12,17)', '(0)(1^{ω^2\\cdot2})'],
	[new Decimal(2 ** 183), 'Y(1,3,4,2,5,8,8)', '(0)(1^{ω^3})'],
	[new Decimal(2 ** 184), 'Y(1,3,4,2,5,8,8,8)', '(0)(1^{ω^4})'],
	[new Decimal(2 ** 185), 'Y(1,3,4,2,5,8,9)', '(0)(1^{ω^ω})'],
	[new Decimal(2 ** 186), 'Y(1,3,4,2,5,8,9,9)', '(0)(1^{ω^{ω^2}})'],
	[new Decimal(2 ** 187), 'Y(1,3,4,2,5,8,9,10)', '(0)(1^{ω^{ω^ω}})'],
	[new Decimal(2 ** 188), 'Y(1,3,4,2,5,8,9,11)', '(0)(1^{ε_0})'],
	[new Decimal(2 ** 189), 'Y(1,3,4,2,5,8,9,11,15)', '(0)(1^{ψ(Ω_ω)})'],
	[new Decimal(2 ** 190), 'Y(1,3,4,2,5,8,9,11,15,23)', '(0)(1^{(0)(1^4)})'],
	[new Decimal(2 ** 192), 'Y(1,3,4,2,5,8,9,12)', '(0)(1^{(0)(1^ω)})'],
	[new Decimal(2 ** 193), 'Y(1,3,4,2,5,8,9,12,15)', '(0)(1^{(0)(1^{ω^2})})'],
	[new Decimal(2 ** 194), 'Y(1,3,4,2,5,8,9,12,15,15)', '(0)(1^{(0)(1^{ω^3})})'],
	[new Decimal(2 ** 195), 'Y(1,3,4,2,5,8,9,12,15,16)', '(0)(1^{(0)(1^{ω^ω})})'],
	[new Decimal(2 ** 195 * 1.5), 'Y(1,3,4,2,5,8,9,12,15,16,19)', '(0)(1^{(0)(1^{(0)(1^ω)})})'],
	[new Decimal(2 ** 196), 'Y(1,3,4,2,5,8,10)', 'BTBMS(0)(1^{(2,1)})', '(0)(1^{Ω})', 'ΩSSO'],
	//Bubby3’s TBMS
	[new Decimal(2 ** 197), 'Y(1,3,4,2,5,8,10,4)', 'BTBMS(0)(1^{(2,1)})(1,1)'],
	[new Decimal(2 ** 198), 'Y(1,3,4,2,5,8,10,4,9)', 'BTBMS(0)(1^{(2,1)})(1,1)(2,2,1^{(3)})'],
	[new Decimal(2 ** 199), 'Y(1,3,4,2,5,8,10,4,9,14,15,18,21,23)', 'BTBMS(0)(1^{(2,1)})(1,1)(2,2,1^{(3)}))(4,1^{(5,1)})'],
	[new Decimal(2 ** 199 * 1.5), 'Y(1,3,4,2,5,8,10,4,9,14,15,18,21,23,13,21)', 'BTBMS(0)(1^{(2,1)})(1,1)(2,2,1^{(3)}))(4,1^{(5,1)},1)'],
	[new Decimal(2 ** 200), 'Y(1,3,4,2,5,8,10,4,9,14,15,18,21,23,14)', 'BTBMS(0)(1^{(2,1)})(1,1)(2,2,1^{(3)}))(4,1^{(5,1)}(3))'],
	[new Decimal(2 ** 201), 'Y(1,3,4,2,5,8,10,4,9,14,16)', 'BTBMS(0)(1^{(2,1)})(1,1)(2,2,1^{(3,1)})'],
	[new Decimal(2 ** 208), 'Y(1,3,4,2,5,8,10,4,9,14,17)', 'BTBMS(0)(1^{(2,1)})(1,1)(2,2,1^{(3,2)})', '(0)(1^{Ω_2})'],
	[new Decimal(2 ** 209), 'Y(1,3,4,2,5,8,10,4,9,14,17,8)', 'BTBMS(0)(1^{(2,1)})(1,1,1)', '(0)(1^{Ω_ω})'],
	[new Decimal(2 ** 210), 'Y(1,3,4,2,5,8,10,4,9,14,17,10)', 'BTBMS(0)(1^{(2,1)})(2)', '(0)(1^{1^{1^{...}}})'],
	[new Decimal(2 ** 211), 'Y(1,3,4,2,5,8,10,4,9,14,17,11)', 'BTBMS(0)(1^{(2,1)})(2,1)'],
	[new Decimal(2 ** 213), 'Y(1,3,4,2,5,8,10,4,9,14,17,13)', 'BTBMS(0)(1^{(2,1)})(2,1,1)'],
	[new Decimal(2 ** 214), 'Y(1,3,4,2,5,8,10,4,9,14,17,14)', 'BTBMS(0)(1^{(2,1)})(2^{(3,1)}(3))'],
	[new Decimal(2 ** 215), 'Y(1,3,4,2,5,8,10,4,9,14,17,14,18)', 'BTBMS(0)(1^{(2,1)})(2^{(3,1,1)})'],
	[new Decimal(2 ** 216), 'Y(1,3,4,2,5,8,10,5)', 'BTBMS(0)(1^{(2,1)})(2^{(3,1^{(4)})})'],
	[new Decimal(2 ** 217), 'Y(1,3,4,2,5,8,10,5,8,10)', 'BTBMS(0)(1^{(2,1)})(2^{(3,1^{(4,1)})})'],
	[new Decimal(2 ** 218), 'Y(1,3,4,2,5,8,10,6)', 'BTBMS(0)(1^{(2,1)})(2^{(3,2)})'],
	[new Decimal(2 ** 219), 'Y(1,3,4,2,5,8,10,7)', 'BTBMS(0)(1^{(2,1)})(2^{(3,2)})(2^{(3,1^{(4,2)})})(3,1)'],
	[new Decimal(2 ** 220), 'Y(1,3,4,2,5,8,10,8)', 'BTBMS(0)(1^{(2,1)})(2^{(3,2)})(3)'],
	[new Decimal(2 ** 224), 'Y(1,3,4,2,5,8,10,15)', 'BTBMS(0)(1^{(2,1)},1^{(2)})'],
	[new Decimal(2 ** 225), 'Y(1,3,4,2,5,8,10,15,20)', 'BTBMS(0)(1^{(2,1)},1^{(2)(2)})'],
	[new Decimal(2 ** 226), 'Y(1,3,4,2,5,8,10,15,20,24)', 'BTBMS(0)(1^{(2,1)},1^{(2,1)})'],
	[new Decimal(2 ** 227), 'Y(1,3,4,2,5,8,11)', 'BTBMS(0)(1^{(2,1)(2)})'],
	[new Decimal(2 ** 230), 'Y(1,3,4,2,5,8,11,11)', 'BTBMS(0)(1^{(2,1)(3,1)(2)})'],
	[new Decimal(2 ** 231), 'Y(1,3,4,2,5,8,11,12)', 'BTBMS(0)(1^{(2,1)(3,1)(4)})'],
	[new Decimal(2 ** 232), 'Y(1,3,4,2,5,8,11,13)', 'BTBMS(0)(1^{(2,1)(3,1)(4,1)})'],
	[new Decimal(2 ** 236), 'Y(1,3,4,2,5,9)', 'BTBMS(0)(1^{(2,1)(3,2)})'],
	[new Decimal(2 ** 256), 'Y(1,3,4,3)', 'BTBMS(0)(1^{(2,1^{(3)})})', 'GHO'],
	[new Decimal(2 ** 260), 'Y(1,3,4,4)', 'BTBMS(0)(1^{(2,2)})'],
	[new Decimal(2 ** 264), 'Y(1,3,4,5)', 'BTBMS(0)(1^{(2^{(3,3)})})'],
	[new Decimal(2 ** 268), 'Y(1,3,4,6)', 'BTBMS(0)(1^{(2^{(3^{(4^{...})})})})'],
	[new Decimal(2 ** 270), 'Y(1,3,4,6,10)'],
	[new Decimal(2 ** 271), 'Y(1,3,4,6,10,18)'],
	[new Decimal(2 ** 272), 'Y(1,3,4,7)'],
	[new Decimal(2 ** 276), 'Y(1,3,4,7,7)'],
	[new Decimal(2 ** 280), 'Y(1,3,4,7,11)'],
	[new Decimal(2 ** 282), 'Y(1,3,4,7,11,11)'],
	[new Decimal(2 ** 284), 'Y(1,3,4,7,11,18)'],
	[new Decimal(2 ** 285), 'Y(1,3,4,7,11,18,18)'],
	[new Decimal(2 ** 286), 'Y(1,3,4,7,11,18,29)'],
	[new Decimal(2 ** 286 * 1.5), 'Y(1,3,4,7,11,18,29,29)'],
	[new Decimal(2 ** 287), 'Y(1,3,4,7,11,18,29,47)'],
	[new Decimal(2 ** 288), 'Y(1,3,5)'],
	[new Decimal(2 ** 296), 'Y(1,3,5,5)'],
	[new Decimal(2 ** 304), 'Y(1,3,5,7)'],
	[new Decimal(2 ** 312), 'Y(1,3,5,7,9)'],
	[new Decimal(2 ** 316), 'Y(1,3,5,7,9,11)'],
	[new Decimal(2 ** 320), 'Y(1,3,6)'],
	[new Decimal(2 ** 328), 'Y(1,3,6,6)'],
	[new Decimal(2 ** 336), 'Y(1,3,6,12)'],
	[new Decimal(2 ** 352), 'Y(1,3,7)'],
	[new Decimal(2 ** 384), 'Y(1,3,8)'],
	[new Decimal(2 ** 448), 'Y(1,3,9)'],
	[new Decimal(2 ** 480), 'Y(1,3,9,27)'],
	[new Decimal(2 ** 496), 'Y(1,3,9,27,81)'],
	[new Decimal(2 ** 504), 'Y(1,3,9,27,81,243)'],
	[new Decimal(2 ** 508), 'Y(1,3,9,27,81,243,729)'],
	[new Decimal(2 ** 510), 'Y(1,3,9,27,81,243,729,2187)'],
	[new Decimal(2 ** 511), 'Y(1,3,9,27,81,243,729,2187,6561)'],
	[new Decimal(2 ** 512), 'Y(1,4)'],
	[new Decimal('9.630466979614933e2585827972'), 'Y(1,5)'],
	[new Decimal('ee153.90699754796802'), 'Y(1,ω)', 'SYO'],
	[new Decimal('(e^3.402823669209385e+38)153.90699754796802'), 'ω-Y(1,ω)', 'MHO'],
	// [new Decimal('(e^1.3407807929942597e+154)153.90699754796802'), 'Ω-Y(1,ω)'],
] as const;

export function getCurrentYMilestoneIndex(target: Decimal): number {
	if (target.lt(0) || target.isNan()) throw new Error('Unexpected Y Sequence Number.');
	if (target.lte(96)) return Math.floor(target.toNumber());

	let left = 96;
	let right = Y_Milestones.length;
	let resultIndex = -1;

	while (left <= right) {
		const mid = Math.floor((left + right) / 2);
		const comparison = Y_Milestones[mid][0].cmp(target);

		if (comparison === 0) {
			return mid;
		} else if (comparison < 0) {
			resultIndex = mid;
			left = mid + 1;
		} else {
			right = mid - 1;
		}
	}

	return resultIndex;
}

export const getCurrentYMilestone = (target: Decimal) => Y_Milestones[getCurrentYMilestoneIndex(target)];
