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
	arr: Mountain[];
	coord: number[];
	dim: Exclude<number, 0>;
}

export type Mountain = LeafMountain | NodeMountain;

export function getYSequenceWithoutColon(Y: string): {
	type: string;
	Y: string;
} {
	if (Y.startsWith('Y(')) {
		return { type: '1-Y', Y: Y.slice(2, -1) };
	}
	if (Y.startsWith('ω-Y(')) {
		return { type: 'ω-Y', Y: Y.slice(4, -1) };
	}
	return {
		type: '???',
		Y,
	};
}

// https://naruyoko.github.io/MEGAwhYmountain/
// https://naruyoko.github.io/StudyAndExpandSequence/

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
	return s.split(/,\s*/).map(parseSequenceElement);
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

function findParents(sequence: Array<{value: number, position: number}>): number[] {
  const parentIndices: number[] = new Array(sequence.length).fill(-1);
  const stack: number[] = [];
  
  for (let i = 0; i < sequence.length; i++) {
    while (stack.length > 0 && sequence[stack[stack.length - 1]].value >= sequence[i].value) {
      stack.pop();
    }
    
    if (stack.length > 0) {
      parentIndices[i] = stack[stack.length - 1];
    } else {
      parentIndices[i] = -1;
    }
    
    stack.push(i);
  }
  
  return parentIndices;
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
		  const parentIndices = findParents(s)
			for (let i = 0; i < s.length; i++) {
				m.arr.push({
					dim: 0,
					value: s[i].value,
					position: s[i].position,
					coord: addCoord(coordOffset, 0, i),
					parentIndex: s[i].forcedParent ? s[i].parentIndex : parentIndices[i],
					forcedParent: s[i].forcedParent,
					leftLegCoord: null,
					rightLegCoord: null,
				} as LeafMountain);
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

//展开

function cloneMountain(mountain: Mountain): Mountain {
  const newMountain = Object.assign({}, mountain);
  if (mountain.dim === 0) {
    const leafMountain = newMountain as LeafMountain;
    leafMountain.coord = leafMountain.coord.slice(0);
    leafMountain.leftLegCoord = leafMountain.leftLegCoord && leafMountain.leftLegCoord.slice(0);
    leafMountain.rightLegCoord = leafMountain.rightLegCoord && leafMountain.rightLegCoord.slice(0);
    return leafMountain;
  } else {
    const nodeMountain = newMountain as NodeMountain;
    nodeMountain.arr = nodeMountain.arr.map(cloneMountain);
    nodeMountain.coord = nodeMountain.coord.slice(0);
    return nodeMountain;
  }
}

function getBadRoot(s: string | Mountain): Mountain | null {
  let mountain: Mountain;
  if (typeof s === "string") mountain = calcMountain(s);
  else mountain = s;
  
  const lastPosition = getLastPosition(mountain);
  const highestNode = findHighestWithPosition(mountain, lastPosition);
  
  if (!highestNode) return null;
  
  return leftLeg(mountain as NodeMountain, highestNode);
}

function filterEmpty(mountain: Mountain): Mountain {
  if (mountain.dim > 0) {
    for (let i = (mountain as NodeMountain).arr.length - 1; i >= 0; i--) {
      filterEmpty((mountain as NodeMountain).arr[i]);
      if ((mountain as NodeMountain).arr[i].dim > 0 && ((mountain as NodeMountain).arr[i] as NodeMountain).arr.length === 0) {
        (mountain as NodeMountain).arr.slice(i, 1);
      }
    }
  }
  return mountain;
}

function findHighestWithPositionBelow(m: Mountain, sub: Mountain, position: number): Mountain | null {
  let crawlIndex = indexFromCoord(m, sub.coord, sub.dim);
  if (!crawlIndex) return null;
  
  while (true) {
    crawlIndex[crawlIndex.length - 1]--;
    while (crawlIndex.length > 0 && crawlIndex[crawlIndex.length - 1] < 0) {
      crawlIndex.pop();
      if (crawlIndex.length === 0) break;
      crawlIndex[crawlIndex.length - 1]--;
    }
    if (crawlIndex.length === 0) break;
    
    const node = findByIndex(m, crawlIndex);
    if (node) {
      const result = findHighestWithPosition(node, position);
      if (result) return result;
    }
  }
  return null;
}

function expand(
  s: string | Mountain, 
  n: number, 
  legBasedAscension: boolean = false, 
  stringify: boolean = true
): string | Mountain {
  let mountain: Mountain;
  if (typeof s === "string") mountain = calcMountain(s);
  else mountain = s;
  
  const result = cloneMountain(mountain);
  const badRoot = getBadRoot(mountain);
  const cutPosition = getLastPosition(mountain);
  const topCut = findHighestWithPosition(mountain, cutPosition);
  
  if (!topCut) {
    throw new Error("Cannot find top cut");
  }
  
  let cutLookup: Mountain | null = topCut;
  while (cutLookup) {
    const parentRow = findByCoord(result, cutLookup.coord, 1) as NodeMountain;
    parentRow.arr.pop();
    cutLookup = rightLeg(result as NodeMountain, cutLookup as LeafMountain);
  }
  
  filterEmpty(result);
  
    const belowCopyStackBase: Array<[Mountain, Mountain, Mountain | null, number, boolean]> = [];
    const aboveCopyStackBase: Array<[Mountain, Mountain]> = [];
    
  if (badRoot) {
    const badRootPosition = (badRoot as LeafMountain).position;
    const badRootRow = findByCoord(mountain, badRoot.coord, 1) as NodeMountain;
    
    let bottomCut: Mountain = mountain;
    while ((bottomCut as NodeMountain).dim > 1) {
      bottomCut = (bottomCut as NodeMountain).arr[0];
    }
    bottomCut = (bottomCut as NodeMountain).arr[(bottomCut as NodeMountain).arr.length - 1];
    
    const topCutIndex = indexFromCoord(mountain, topCut.coord);
    if (!topCutIndex) {
      throw new Error("Cannot find top cut index");
    }
    
    let crawlIndex = topCutIndex.slice(0, -1);
    while (true) {
      crawlIndex[crawlIndex.length - 1]--;
      while (crawlIndex.length > 0 && crawlIndex[crawlIndex.length - 1] < 0) {
        crawlIndex.pop();
        crawlIndex[crawlIndex.length - 1]--;
      }
      if (crawlIndex.length === 0) break;
      
      const sourceSubMountain = findByIndex(mountain, crawlIndex);
      const destSubMountain = findByIndex(result, crawlIndex);
      if (sourceSubMountain && destSubMountain) {
        belowCopyStackBase.push([sourceSubMountain, destSubMountain, null, 0, false]);
      }
    }
    
    crawlIndex = topCutIndex.slice(0, -1);
    if (indexFromCoord(result, findByIndex(mountain, crawlIndex).coord, 1)) {
      while (true) {
        const sourceSubMountain = findByIndex(mountain, crawlIndex);
        const destSubMountain = findByIndex(result, crawlIndex);
        if (sourceSubMountain && destSubMountain) {
          aboveCopyStackBase.unshift([sourceSubMountain, destSubMountain]);
        }
        
        crawlIndex[crawlIndex.length - 1]++;
        const parentMountain = findByIndex(mountain, crawlIndex.slice(0, -1));
        while (crawlIndex.length > 0 && parentMountain && 
               crawlIndex[crawlIndex.length - 1] >= (parentMountain as NodeMountain).arr.length) {
          crawlIndex.pop();
          if (crawlIndex.length === 0) break;
          crawlIndex[crawlIndex.length - 1]++;
        }
        if (crawlIndex.length === 0) break;
      }
    }
  }
  
  let debugout = "";
  const subCutCache: Record<string, Mountain | null> = {};
  const subBadRootCache: Record<string, Mountain | null> = {};
  const subBadRootRowCache: Record<string, NodeMountain | null> = {};
  const topNodeCache: Record<string, Mountain | null> = {};
  const isAscendingCache: Record<string, boolean> = {};
  
  
  const badRootPosition = (badRoot as LeafMountain).position
  for (let i = 0; i <= n && badRoot; i++) { // iteration
    for (let x = i === 0 ? cutPosition : badRootPosition + 1; x < cutPosition + (i < n ? 1 : 0); x++) {
      let nodeBelow: LeafMountain | null = null;
      const belowCopyStack = belowCopyStackBase.slice(0);
      
      while (belowCopyStack.length) {
        const popItem = belowCopyStack.pop()!;
        const sourceSubMountain = popItem[0];
        const destSubMountain = popItem[1];
        const cleanCopySource = popItem[2];
        const cleanCopyOffset = popItem[3];
        const ignoreBelow = popItem[4];
        
        const sourceSubMountainID = sourceSubMountain.coord.join(",") + "," + sourceSubMountain.dim;
        
        if (subCutCache[sourceSubMountainID] === undefined) {
          const subCut = findHighestWithPosition(sourceSubMountain, cutPosition);
          const subBadRoot = findHighestWithPosition(sourceSubMountain, badRootPosition);
          const subBadRootRow = subBadRoot ? findByCoord(sourceSubMountain, subBadRoot.coord, 1) as NodeMountain : null;
          
          subCutCache[sourceSubMountainID] = subCut;
          subBadRootCache[sourceSubMountainID] = subBadRoot;
          subBadRootRowCache[sourceSubMountainID] = subBadRootRow;
        }
        
        const subCut = subCutCache[sourceSubMountainID];
        const subBadRoot = subBadRootCache[sourceSubMountainID];
        const subBadRootRow = subBadRootRowCache[sourceSubMountainID];
        
        const sourceSubMountainAndPositionID = sourceSubMountainID + "," + x;
        
        if (topNodeCache[sourceSubMountainAndPositionID] === undefined) {
          const topNode = findHighestWithPosition(sourceSubMountain, x);
          topNodeCache[sourceSubMountainAndPositionID] = topNode;
          
          if (!topNode) continue;
          
          if (legBasedAscension) {
            let nodeInSubBadRootRow = subBadRootRow ? findHighestWithPosition(subBadRootRow, x) : null;
            while (nodeInSubBadRootRow && nodeInSubBadRootRow.position > badRootPosition) {
              const leftLegPosition = nodeInSubBadRootRow.leftLegCoord ? sumArray(nodeInSubBadRootRow.leftLegCoord) : nodeInSubBadRootRow.position - 1;
              nodeInSubBadRootRow = findHighestWithPosition(subBadRootRow!, leftLegPosition);
            }
            const isAscending = nodeInSubBadRootRow && nodeInSubBadRootRow.position === badRootPosition;
            isAscendingCache[sourceSubMountainAndPositionID] = isAscending;
          } else {
            const referenceRow = (subBadRootRow?.coord[1] ?
              findByCoord(sourceSubMountain, addCoord(subBadRootRow.coord, 1, -1), 1) as NodeMountain : null) ?? subBadRootRow;
            let nodeInReferenceRow = referenceRow ? findHighestWithPosition(referenceRow, x) : null;
            while (nodeInReferenceRow && nodeInReferenceRow.position > badRootPosition) {
              nodeInReferenceRow = parent(referenceRow!, nodeInReferenceRow);
            }
            const isAscending = !!nodeInReferenceRow && nodeInReferenceRow.position === badRootPosition;
            isAscendingCache[sourceSubMountainAndPositionID] = isAscending;
          }
        } else {
          const topNode = topNodeCache[sourceSubMountainAndPositionID];
          if (!topNode) continue;
          const isAscending = isAscendingCache[sourceSubMountainAndPositionID];
        }
        
        const topNode = topNodeCache[sourceSubMountainAndPositionID]!;
        const isAscending = isAscendingCache[sourceSubMountainAndPositionID];
        
        if (sourceSubMountain.dim === 1) {
          const position = x + (cutPosition - badRootPosition) * i;
          const sourceNode = findHighestWithPosition(cleanCopySource ?? sourceSubMountain, x) as LeafMountain;
          
          let sourceLeftLegPosition = sourceNode.leftLegCoord ? sumArray(sourceNode.leftLegCoord) : -1;
          const leftLegPosition = sourceLeftLegPosition >= badRootPosition ? 
            sourceLeftLegPosition + (cutPosition - badRootPosition) * i : sourceLeftLegPosition;
          
          const nodeLeftDown = findHighestWithPositionBelow(result, destSubMountain, leftLegPosition);
          const leftLegCoord = nodeLeftDown ? nodeLeftDown.coord : null;
          const rightLegCoord = nodeBelow ? nodeBelow.coord : null;
          
          if (nodeBelow) {
            if (leftLegCoord && equalVector(leftLegCoord, rightLegCoord!, 1)) {
              const leftLegIndex = indexFromCoord(result, leftLegCoord);
              if (leftLegIndex) {
                nodeBelow.parentIndex = leftLegIndex[leftLegIndex.length - 1];
              }
            } else {
              nodeBelow.parentIndex = -1;
            }
          }
          
          nodeBelow = {
            dim: 0,
            value: NaN,
            position: position,
            coord: addCoord(destSubMountain.coord, 0, position - sumArray(destSubMountain.coord)),
            parentIndex: -1,
            forcedParent: sourceNode.forcedParent,
            leftLegCoord: leftLegCoord,
            rightLegCoord: rightLegCoord
          } as LeafMountain;
          
          (destSubMountain as NodeMountain).arr.push(nodeBelow);
        } else {
          const subCutHeight = (subCut ? subCut.coord[sourceSubMountain.dim - 1] : 0) || 0;
          const subBadRootHeight = (subBadRoot ? subBadRoot.coord[sourceSubMountain.dim - 1] : 0) || 0;
          const topNodeHeight = topNode.coord[sourceSubMountain.dim - 1] || 0;
          
          if (isAscending) {
            if (cleanCopySource) {
              let generationsFromSubBadRoot = 0;
              const nodeInCleanCopySource = findHighestWithPosition(cleanCopySource, x) as LeafMountain;
              
              if (nodeInCleanCopySource.leftLegCoord) {
                let lowAncestorNode: Mountain | null = nodeInCleanCopySource;
                while (lowAncestorNode && (lowAncestorNode as LeafMountain).position > badRootPosition) {
                  lowAncestorNode = findHighestWithPosition(cleanCopySource, sumArray((lowAncestorNode as LeafMountain).leftLegCoord!));
                  generationsFromSubBadRoot++;
                }
              } else {
                generationsFromSubBadRoot = x - badRootPosition;
              }
              
              const lastReplacedCut = findHighestWithPosition(destSubMountain, badRootPosition + (cutPosition - badRootPosition) * i);
              const lastReplacedCutHeight = (lastReplacedCut ? lastReplacedCut.coord[sourceSubMountain.dim - 1] : 0) || 0;
              const targetHeight = i === 0 ? topNodeHeight : lastReplacedCutHeight + generationsFromSubBadRoot - cleanCopyOffset;
              
              if (ignoreBelow) {
                while ((destSubMountain as NodeMountain).arr.length < targetHeight + 1) {
                  (destSubMountain as NodeMountain).arr.push({
                    dim: (destSubMountain as NodeMountain).dim - 1,
                    arr: [],
                    coord: addCoord(destSubMountain.coord, (destSubMountain as NodeMountain).dim - 1, (destSubMountain as NodeMountain).arr.length)
                  } as NodeMountain);
                }
                
                for (let j = targetHeight; j >= 0; j--) {
                  belowCopyStack.push([
                    (sourceSubMountain as NodeMountain).arr[subBadRootHeight],
                    (destSubMountain as NodeMountain).arr[j],
                    cleanCopySource,
                    Math.max(j - lastReplacedCutHeight + cleanCopyOffset, 0),
                    true
                  ]);
                }
              } else {
                if (!lastReplacedCut || cleanCopyOffset) throw new Error("Something went wrong");
                
                while ((destSubMountain as NodeMountain).arr.length < targetHeight + 1) {
                  (destSubMountain as NodeMountain).arr.push({
                    dim: (destSubMountain as NodeMountain).dim - 1,
                    arr: [],
                    coord: addCoord(destSubMountain.coord, (destSubMountain as NodeMountain).dim - 1, (destSubMountain as NodeMountain).arr.length)
                  } as NodeMountain);
                }
                
                for (let j = targetHeight; j >= 0; j--) {
                  if (j < subBadRootHeight) {
                    belowCopyStack.push([
                      (sourceSubMountain as NodeMountain).arr[j],
                      (destSubMountain as NodeMountain).arr[j],
                      null, 0, false
                    ]);
                  } else {
                    belowCopyStack.push([
                      (sourceSubMountain as NodeMountain).arr[subBadRootHeight],
                      (destSubMountain as NodeMountain).arr[j],
                      cleanCopySource,
                      Math.max(j - lastReplacedCutHeight + cleanCopyOffset, 0),
                      j > subBadRootHeight
                    ]);
                  }
                }
              }
            } else {
              if (cleanCopyOffset) throw new Error("Something went wrong");
              
              if (ignoreBelow) {
                const lastReplacedCut = findHighestWithPosition(destSubMountain, badRootPosition + (cutPosition - badRootPosition) * i);
                const lastReplacedCutHeight = (lastReplacedCut ? lastReplacedCut.coord[sourceSubMountain.dim - 1] : 0) || 0 ;
                
                if (!lastReplacedCut && cleanCopyOffset) throw new Error("Something went wrong");
                
                const targetHeight = i === 0 ? topNodeHeight : lastReplacedCutHeight + topNodeHeight;
                
                while ((destSubMountain as NodeMountain).arr.length < targetHeight - subBadRootHeight + 1) {
                  (destSubMountain as NodeMountain).arr.push({
                    dim: (destSubMountain as NodeMountain).dim - 1,
                    arr: [],
                    coord: addCoord(destSubMountain.coord, (destSubMountain as NodeMountain).dim - 1, (destSubMountain as NodeMountain).arr.length)
                  } as NodeMountain);
                }
                
                for (let j = targetHeight; j >= subBadRootHeight; j--) {
                  if (j < lastReplacedCutHeight + subBadRootHeight + (sourceSubMountain.dim === 2 ? 1 : 0)) {
                    belowCopyStack.push([
                      (sourceSubMountain as NodeMountain).arr[subBadRootHeight],
                      (destSubMountain as NodeMountain).arr[j - subBadRootHeight],
                      subBadRootRow!,
                      0,
                      true
                    ]);
                  } else {
                    belowCopyStack.push([
                      (sourceSubMountain as NodeMountain).arr[j - lastReplacedCutHeight],
                      (destSubMountain as NodeMountain).arr[j - subBadRootHeight],
                      null,
                      0,
                      !!((j === lastReplacedCutHeight ? 1 : 0) + subBadRootHeight)
                    ]);
                  }
                }
              } else {
                while ((destSubMountain as NodeMountain).arr.length < topNodeHeight + (subCutHeight - subBadRootHeight) * i + 1) {
                  (destSubMountain as NodeMountain).arr.push({
                    dim: (destSubMountain as NodeMountain).dim - 1,
                    arr: [],
                    coord: addCoord(destSubMountain.coord, (destSubMountain as NodeMountain).dim - 1, (destSubMountain as NodeMountain).arr.length)
                  } as NodeMountain);
                }
                
                for (let j = topNodeHeight + (subCutHeight - subBadRootHeight) * i; j >= 0; j--) {
                  if (j < subBadRootHeight) {
                    belowCopyStack.push([
                      (sourceSubMountain as NodeMountain).arr[j],
                      (destSubMountain as NodeMountain).arr[j],
                      null, 0, false
                    ]);
                  } else if (j < subBadRootHeight + (subCutHeight - subBadRootHeight) * i + (sourceSubMountain.dim === 2 ? 1 : 0)) {
                    belowCopyStack.push([
                      (sourceSubMountain as NodeMountain).arr[subBadRootHeight],
                      (destSubMountain as NodeMountain).arr[j],
                      subBadRootRow!,
                      0,
                      j > subBadRootHeight
                    ]);
                  } else {
                    belowCopyStack.push([
                      (sourceSubMountain as NodeMountain).arr[j - (subCutHeight - subBadRootHeight) * i],
                      (destSubMountain as NodeMountain).arr[j],
                      null,
                      0,
                      i !== 0 && j === subBadRootHeight + (subCutHeight - subBadRootHeight) * i
                    ]);
                  }
                }
              }
            }
          } else {
            if (cleanCopySource || cleanCopyOffset || ignoreBelow) throw new Error("Something went wrong");
            
            while ((destSubMountain as NodeMountain).arr.length < topNodeHeight + 1) {
              (destSubMountain as NodeMountain).arr.push({
                dim: (destSubMountain as NodeMountain).dim - 1,
                arr: [],
                coord: addCoord(destSubMountain.coord, (destSubMountain as NodeMountain).dim - 1, (destSubMountain as NodeMountain).arr.length)
              } as NodeMountain);
            }
            
            for (let j = topNodeHeight; j >= 0; j--) {
              belowCopyStack.push([
                (sourceSubMountain as NodeMountain).arr[j],
                (destSubMountain as NodeMountain).arr[j],
                null, 0, false
              ]);
            }
          }
        }
      }
      
      const aboveCopySourceX = x === cutPosition ? badRootPosition : x;
      const aboveCopyStack = aboveCopyStackBase.slice(0);
      
      while (aboveCopyStack.length) {
        const popItem = aboveCopyStack.pop()!;
        const sourceSubMountain = popItem[0];
        const destSubMountain = popItem[1];
        const topNode = findHighestWithPosition(sourceSubMountain, aboveCopySourceX);
        
        if (!topNode) continue;
        
        if (sourceSubMountain.dim === 1) {
          const position = x + (cutPosition - badRootPosition) * i;
          const nodeInSourceSubMountain = topNode as LeafMountain;
          
          let sourceLeftLegPosition = nodeInSourceSubMountain.leftLegCoord ? sumArray(nodeInSourceSubMountain.leftLegCoord) : -1;
          const leftLegPosition = sourceLeftLegPosition >= badRootPosition ? 
            sourceLeftLegPosition + (cutPosition - badRootPosition) * i : sourceLeftLegPosition;
          
          const nodeLeftDown = findHighestWithPositionBelow(result, destSubMountain, leftLegPosition);
          const leftLegCoord = nodeLeftDown ? nodeLeftDown.coord : null;
          const rightLegCoord = nodeBelow ? nodeBelow.coord : null;
          
          if (nodeBelow) {
            if (leftLegCoord && equalVector(leftLegCoord, rightLegCoord!, 1)) {
              const leftLegIndex = indexFromCoord(result, leftLegCoord);
              if (leftLegIndex) {
                nodeBelow.parentIndex = leftLegIndex[leftLegIndex.length - 1];
              }
            } else {
              nodeBelow.parentIndex = -1;
            }
          }
          
          nodeBelow = {
            dim: 0,
            value: NaN,
            position: position,
            coord: addCoord(destSubMountain.coord, 0, position - sumArray(destSubMountain.coord)),
            parentIndex: -1,
            forcedParent: nodeInSourceSubMountain.forcedParent,
            leftLegCoord,
            rightLegCoord
          } as LeafMountain;
          
          (destSubMountain as NodeMountain).arr.push(nodeBelow);
        } else {
          const topNodeHeight = topNode?.coord[sourceSubMountain.dim - 1] ?? 0;
          for (let j = topNodeHeight; j >= 0; j--) {
            aboveCopyStack.push([(sourceSubMountain as NodeMountain).arr[j], (destSubMountain as NodeMountain).arr[j]]);
          }
        }
      }
    }
  }
  
  let lastBottomNode: Mountain | null = result;
  while (lastBottomNode && (lastBottomNode as NodeMountain).dim > 0) {
    if ((lastBottomNode as NodeMountain).dim === 1) {
      lastBottomNode = (lastBottomNode as NodeMountain).arr[(lastBottomNode as NodeMountain).arr.length - 1];
    } else {
      lastBottomNode = (lastBottomNode as NodeMountain).arr[0];
    }
  }
  
  const resultLength = lastBottomNode ? (lastBottomNode as LeafMountain).position : 0;
  
  let node: LeafMountain;
  let aboveNode: Mountain | null = null;
  node = findHighestWithPosition(result, 2) as LeafMountain;
  for (let x = 0; x <= resultLength; x++) {
    while (node) {
      if (isNaN((node as LeafMountain).value)) {
        if (aboveNode) {
          const pseudoParentNode = leftLeg(result as NodeMountain, aboveNode as LeafMountain);
          if (pseudoParentNode === null) {
            console.log(debugout);
            throw new Error("Mountain not complete");
          }
          
          if (node.coord.length < pseudoParentNode.coord.length) {
            console.warn("The left leg is in an awkward position from the right leg:", pseudoParentNode, node, aboveNode);
            debugout += "Warning: The left leg is in an awkward position from the right leg " + 
              [pseudoParentNode.coord, node.coord, aboveNode.coord].map(JSON.stringify).join(",") + "<br>";
          } else if (node.coord.length === pseudoParentNode.coord.length) {
            for (let i = node.coord.length - 1; i >= 0; i--) {
              if ((i === 0 && !equalVector(node.coord, aboveNode.coord, 2)) || 
                  node.coord[i] < pseudoParentNode.coord[i] || 
                  (equalVector(node.coord, aboveNode.coord, i + 1) && node.coord[i] > pseudoParentNode.coord[i] + 1)) {
                console.warn("The left leg is in an awkward position from the right leg:", pseudoParentNode, node, aboveNode);
                debugout += "Warning: The left leg is in an awkward position from the right leg " + 
                  [pseudoParentNode.coord, node.coord, aboveNode.coord].map(JSON.stringify).join(",") + "<br>";
              } else if (node.coord[i] > pseudoParentNode.coord[i]) break;
            }
          }
          
          (node as LeafMountain).value = (pseudoParentNode as LeafMountain).value + (aboveNode as LeafMountain).value;
        } else {
          (node as LeafMountain).value = 1;
        }
      }
      
      aboveNode = node;
      node = rightLeg(result as NodeMountain, node as LeafMountain);
    }
  }
  
  let rr: string | Mountain;
  if (stringify) {
    const rrArray: string[] = [];
    if ((result as NodeMountain).arr.length) {
      let bottomrow: Mountain = result;
      while ((bottomrow as NodeMountain).dim > 1) {
        bottomrow = (bottomrow as NodeMountain).arr[0];
      }
      
      for (let i = 0; i < (bottomrow as NodeMountain).arr.length; i++) {
        const leaf = (bottomrow as NodeMountain).arr[i] as LeafMountain;
        rrArray.push(leaf.value + (leaf.forcedParent ? "v" + leaf.parentIndex : ""));
      }
    }
    rr = rrArray.join(",");
  } else {
    rr = result;
  }
  
  if (debugout) {
    console.log(debugout);
  }
  
  return rr;
}

function expandmulti(
  s: string | Mountain, 
  nstring: string, 
  legBasedAscension: boolean = false,
  maxDimensions: number = Infinity
): string | Mountain {
  let result = calcMountain(s, maxDimensions);
  
  if (result.dim > maxDimensions) {
    const lastPosition = getLastPosition(result);
    for (let x = 0; x <= lastPosition; x++) {
      const node = findHighestWithPosition(result, x);
      if (node && (node as LeafMountain).value !== 1) {
        return "Aborted: Maximum dimensions reached.";
      }
    }
  }
  
  const nValues = nstring.split(",");
  for (let i of nValues) {
    result = expand(result, +i, legBasedAscension) as Mountain;
  }
  
  return result;
}

const maxLength = 20;
window.expandmulti = expandmulti
/**
 * 无固定底数
 */
export const Y_Milestones = [
	[new Decimal(0), 'Y()', '0'],
	[new Decimal(1), 'Y(1)', '1'],
	[new Decimal(2), 'Y(1,1)', '2'],
	[new Decimal(3), 'Y(1,1,1)', '3'],
	[new Decimal(4), 'Y(1,2)', 'ω', '\\text{FTO}'],
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
	[new Decimal(32), 'Y(1,2,3)', 'ω^ω', '\\text{LAO}'],
	[new Decimal(33), 'Y(1,2,3,2,3)', 'ω^{ω\\cdot2}'],
	[new Decimal(34), 'Y(1,2,3,2,3,2,3)', 'ω^{ω\\cdot3}'],
	[new Decimal(35), 'Y(1,2,3,3)', 'ω^{ω^2}'],
	[new Decimal(36), 'Y(1,2,3,3,2,3,3)', 'ω^{ω^2\\cdot2}'],
	[new Decimal(37), 'Y(1,2,3,3,2,3,3,2,3,3)', 'ω^{ω^2\\cdot3}'],
	[new Decimal(38), 'Y(1,2,3,3,3)', 'ω^{ω^3}'],
	[new Decimal(39), 'Y(1,2,3,3,3,2,3,3,3)', 'ω^{ω^3\\cdot2}'],
	[new Decimal(40), 'Y(1,2,3,3,3,2,3,3,3,2,3,3,3)', 'ω^{ω^3\\cdot3}'],
	[new Decimal(41), 'Y(1,2,4)', 'ε_0', '\\text{SCO}'],
	[new Decimal(42), 'Y(1,2,4,1)', 'ε_0+1'],
	[new Decimal(43), 'Y(1,2,4,2)', 'ε_0\\cdotω'],
	[new Decimal(44), 'Y(1,2,4,3)', 'ε_0^ω'],
	[new Decimal(45), 'Y(1,2,4,3,5)', 'ε_0^{ε_0}'],
	[new Decimal(46), 'Y(1,2,4,3,5,4,6)', 'ε_0^{ε_0^{ε_0}}'],
	[new Decimal(47), 'Y(1,2,4,4)', 'ε_1'],
	[new Decimal(48), 'Y(1,2,4,4,3,5,5)', 'ε_1^{ε_1}'],
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
	[new Decimal(64), 'Y(1,2,4,6)', 'ζ_0', '\\text{CO}'],
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
	[new Decimal(80), 'Y(1,2,4,6,6)', 'η_0', '\\text{LCO}'],
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
	[new Decimal(96), 'Y(1,2,4,6,7)', 'φ(ω,0) = ψ(Ω^ω)', '\\text{HCO}'],
	[new Decimal(100), 'Y(1,2,4,6,8)', 'φ(1,0,0) = ψ(Ω^Ω)', '\\text{FSO}'],
	[new Decimal(104), 'Y(1,2,4,6,8,8)', 'φ(1,0,0,0) = ψ(Ω^{Ω^2})', '\\text{ACO}'],
	[new Decimal(108), 'Y(1,2,4,6,8,9)', 'φ(1@ω) = ψ(Ω^{Ω^ω})', '\\text{SVO}'],
	[new Decimal(112), 'Y(1,2,4,6,8,10)', 'φ(1@(1,0)) = ψ(Ω^{Ω^Ω})', '\\text{LVO}'],
	[new Decimal(116), 'Y(1,2,4,6,8,10,11)', 'φ(1@(1@ω)) = ψ(Ω^{Ω^{Ω^ω}})', '\\text{ESVO}'],
	[new Decimal(120), 'Y(1,2,4,6,8,10,12)', 'φ(1@(1@(1,0))) = ψ(Ω^{Ω^{Ω^Ω}})', '\\text{ELVO}'],
	[new Decimal(124), 'Y(1,2,4,6,8,10,12,14)', 'φ(1@(1@(1@(1,0)))) = ψ(Ω^{Ω^{Ω^{Ω^Ω}}})'],
	[new Decimal(128), 'Y(1,2,4,7)', 'ψ(Ω_2)', '\\text{BHO}'],
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
	[new Decimal(256), 'Y(1,2,4,8)', 'ψ(Ω_ω)', '(0,0,0)(1,1,1)', '\\text{BO}'],
	[new Decimal(272), 'Y(1,2,4,8,11,15)', 'ψ(Ω_{ω+1})', '(0,0,0)(1,1,1)(2,1,0)(3,2,0)', '\\text{TFBO}'],
	[new Decimal(384), 'Y(1,2,4,8,12,14)', 'ψ(Ω_Ω)', '(0,0,0)(1,1,1)(2,1,1)(3,1,0)', '\\text{BIO}'],
	[new Decimal(448), 'Y(1,2,4,8,12,14,9)', 'ψ(I)', '(0,0,0)(1,1,1)(2,1,1)(3,1,0)(2,0,0)', '\\text{EBO}'],
	[new Decimal(480), 'Y(1,2,4,8,12,15,19)', 'ψ(Ω_{I+1})', '(0,0,0)(1,1,1)(2,1,1)(3,1,0)(4,2,0)', '\\text{JO}'],
	[new Decimal(512), 'Y(1,2,4,8,12,16)', 'ψ(I_ω)', '(0,0,0)(1,1,1)(2,1,1)(3,1,1)', '\\text{SIO}'],
	[new Decimal(544), 'Y(1,2,4,8,12,16,13)', 'ψ(I(ω,0))', '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(3,0,0)', '\\text{MBO}'],
	[new Decimal(576), 'Y(1,2,4,8,12,16,15,19)', 'ψ(Ω_{M+1})', '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(3,1,0)(4,2,0)', '\\text{SRO}'],
	[new Decimal(592), 'Y(1,2,4,8,12,16,16)', 'ψ(M_ω)', '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(3,1,1)', '\\text{SMO}'],
	[new Decimal(600), 'Y(1,2,4,8,12,16,16,16)', 'ψ(N_ω)', '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(3,1,1)(3,1,1)', '\\text{SNO}'],
	[new Decimal(640), 'Y(1,2,4,8,12,16,19,23)', 'ψ(Ω_{K+1})', '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(4,1,0)(5,2,0)', '\\text{RO}'],
	[new Decimal(672), 'Y(1,2,4,8,12,16,20)', 'ψ(K_ω)', '(0,0,0)(1,1,1)(2,1,1)(3,1,1)(4,1,1)', '\\text{SKO}'],
	[new Decimal(736), 'Y(1,2,4,8,13)', 'ψ(Π_ω)', '(0,0,0)(1,1,1)(2,2,0)', '\\text{SSO}'],
	[new Decimal(768), 'Y(1,2,4,8,14,19,22,9)', '(0,0,0)(1,1,1)(2,2,0)(3,2,0)(4,1,0)(2,0,0)', '\\text{LSO}'],
	[new Decimal(896), 'Y(1,2,4,8,14,21)', '(0,0,0)(1,1,1)(2,1,1)(3,3,0)', '\\text{DSO}'],
	[new Decimal(960), 'Y(1,2,4,8,14,22,31)', '(0,0,0)(1,1,1)(2,1,1)(3,3,1)(4,4,0)', '\\text{TSO}'],
	[new Decimal(1024), 'Y(1,2,4,8,15)', 'ψ(ω-π-Π_0)', '(0,0,0)(1,1,1)(2,2,2)', '\\text{pLRO}'],
	[new Decimal(1536), 'Y(1,2,4,8,15,22,29,28)', '(0,0,0)(1,1,1)(2,2,2)(3,2,2)(4,2,2)(4,2,1)', '\\text{M2O}'],
	[new Decimal(2048), 'Y(1,2,4,8,15,26)', '(0,0,0)(1,1,1)(2,2,2)(3,3,3)'],
	[new Decimal(3072), 'Y(1,2,4,8,15,26,42)', '(0,0,0)(1,1,1)(2,2,2)(3,3,3)(4,4,4)'],
	[new Decimal(3584), 'Y(1,2,4,8,15,26,42,64)', '(0,0,0)(1,1,1)(2,2,2)(3,3,3)(4,4,4)(5,5,5)'],
	[new Decimal(4096), 'Y(1,2,4,8,16)', '(0)(1,1,1,1)', '\\text{TSSO}'],
	[new Decimal(6144), 'Y(1,2,4,8,16,29)', '(0)(1,1,1,1)(2,2,2)'],
	[new Decimal(8192), 'Y(1,2,4,8,16,31)', '(0)(1,1,1,1)(2,2,2,2)'],
	[new Decimal(12288), 'Y(1,2,4,8,16,31,57)', '(0)(1,1,1,1)(2,2,2,2)(3,3,3,3)'],
	[new Decimal(16384), 'Y(1,2,4,8,16,32)', '(0)(1,1,1,1,1)', '\\text{QSSO}'],
	[new Decimal(32768), 'Y(1,2,4,8,16,32,64)', '(0)(1^6)'],
	[new Decimal(49152), 'Y(1,2,4,8,16,32,64,128)', '(0)(1^7)'],
	[new Decimal(57344), 'Y(1,2,4,8,16,32,64,128,256)', '(0)(1^8)'],
	[new Decimal(61440), 'Y(1,2,4,8,16,32,64,128,256,512)', '(0)(1^9)'],
	[new Decimal(63488), 'Y(1,2,4,8,16,32,64,128,256,512,1024)', '(0)(1^{10})'],
	[new Decimal(64512), 'Y(1,2,4,8,16,32,64,128,256,512,1024,2048)', '(0)(1^{11})'],
	[new Decimal(65024), 'Y(1,2,4,8,16,32,64,128,256,512,1024,2048,4096)', '(0)(1^{12})'],
	[new Decimal(65280), 'Y(1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192)', '(0)(1^{13})'],
	[new Decimal(65408), 'Y(1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384)', '(0)(1^{14})'],
	[new Decimal(65472), 'Y(1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768)', '(0)(1^{15})'],
	[new Decimal(65504), 'Y(1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,65536)', '(0)(1^{16})'],
	[new Decimal(65536), 'Y(1,3)', '(0)(1^ω)', '\\text{SHO}'],
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
	[new Decimal(2 ** 196), 'Y(1,3,4,2,5,8,10)', '\\text{BTBMS}(0)(1^{(2,1)})', '(0)(1^{Ω})', '\\text{ΩSSO}'],
	//Bubby3’s TBMS
	[new Decimal(2 ** 197), 'Y(1,3,4,2,5,8,10,4)', '\\text{BTBMS}(0)(1^{(2,1)})(1,1)'],
	[new Decimal(2 ** 198), 'Y(1,3,4,2,5,8,10,4,9)', '\\text{BTBMS}(0)(1^{(2,1)})(1,1)(2,2,1^{(3)})'],
	[new Decimal(2 ** 199), 'Y(1,3,4,2,5,8,10,4,9,14,15,18,21,23)', '\\text{BTBMS}(0)(1^{(2,1)})(1,1)(2,2,1^{(3)}))(4,1^{(5,1)})'],
	[new Decimal(2 ** 199 * 1.5), 'Y(1,3,4,2,5,8,10,4,9,14,15,18,21,23,13,21)', '\\text{BTBMS}(0)(1^{(2,1)})(1,1)(2,2,1^{(3)}))(4,1^{(5,1)},1)'],
	[new Decimal(2 ** 200), 'Y(1,3,4,2,5,8,10,4,9,14,15,18,21,23,14)', '\\text{BTBMS}(0)(1^{(2,1)})(1,1)(2,2,1^{(3)}))(4,1^{(5,1)}(3))'],
	[new Decimal(2 ** 201), 'Y(1,3,4,2,5,8,10,4,9,14,16)', '\\text{BTBMS}(0)(1^{(2,1)})(1,1)(2,2,1^{(3,1)})'],
	[new Decimal(2 ** 208), 'Y(1,3,4,2,5,8,10,4,9,14,17)', '\\text{BTBMS}(0)(1^{(2,1)})(1,1)(2,2,1^{(3,2)})', '(0)(1^{Ω_2})'],
	[new Decimal(2 ** 209), 'Y(1,3,4,2,5,8,10,4,9,14,17,8)', '\\text{BTBMS}(0)(1^{(2,1)})(1,1,1)', '(0)(1^{Ω_ω})'],
	[new Decimal(2 ** 210), 'Y(1,3,4,2,5,8,10,4,9,14,17,10)', '\\text{BTBMS}(0)(1^{(2,1)})(2)', '(0)(1^{(1^{(1^{...})})})'],
	[new Decimal(2 ** 211), 'Y(1,3,4,2,5,8,10,4,9,14,17,11)', '\\text{BTBMS}(0)(1^{(2,1)})(2,1)'],
	[new Decimal(2 ** 213), 'Y(1,3,4,2,5,8,10,4,9,14,17,13)', '\\text{BTBMS}(0)(1^{(2,1)})(2,1,1)'],
	[new Decimal(2 ** 214), 'Y(1,3,4,2,5,8,10,4,9,14,17,14)', '\\text{BTBMS}(0)(1^{(2,1)})(2^{(3,1)}(3))'],
	[new Decimal(2 ** 215), 'Y(1,3,4,2,5,8,10,4,9,14,18)', '\\text{BTBMS}(0)(1^{(2,1)})(2^{(3,1,1)})'],
	[new Decimal(2 ** 216), 'Y(1,3,4,2,5,8,10,5)', '\\text{BTBMS}(0)(1^{(2,1)})(2^{(3,1^{(4)})})'],
	[new Decimal(2 ** 217), 'Y(1,3,4,2,5,8,10,5,8,10)', '\\text{BTBMS}(0)(1^{(2,1)})(2^{(3,1^{(4,1)})})'],
	[new Decimal(2 ** 218), 'Y(1,3,4,2,5,8,10,6)', '\\text{BTBMS}(0)(1^{(2,1)})(2^{(3,2)})'],
	[new Decimal(2 ** 219), 'Y(1,3,4,2,5,8,10,7)', '\\text{BTBMS}(0)(1^{(2,1)})(2^{(3,2)})(2^{(3,1^{(4,2)})})(3,1)'],
	[new Decimal(2 ** 220), 'Y(1,3,4,2,5,8,10,8)', '\\text{BTBMS}(0)(1^{(2,1)})(2^{(3,2)})(3)'],
	[new Decimal(2 ** 224), 'Y(1,3,4,2,5,8,10,15)', '\\text{BTBMS}(0)(1^{(2,1)},1^{(2)})'],
	[new Decimal(2 ** 225), 'Y(1,3,4,2,5,8,10,15,20)', '\\text{BTBMS}(0)(1^{(2,1)},1^{(2)(2)})'],
	[new Decimal(2 ** 226), 'Y(1,3,4,2,5,8,10,15,20,24)', '\\text{BTBMS}(0)(1^{(2,1)},1^{(2,1)})'],
	[new Decimal(2 ** 227), 'Y(1,3,4,2,5,8,11)', '\\text{BTBMS}(0)(1^{(2,1)(2)})'],
	[new Decimal(2 ** 230), 'Y(1,3,4,2,5,8,11,11)', '\\text{BTBMS}(0)(1^{(2,1)(3,1)(2)})'],
	[new Decimal(2 ** 231), 'Y(1,3,4,2,5,8,11,12)', '\\text{BTBMS}(0)(1^{(2,1)(3,1)(4)})'],
	[new Decimal(2 ** 232), 'Y(1,3,4,2,5,8,11,13)', '\\text{BTBMS}(0)(1^{(2,1)(3,1)(4,1)})'],
	[new Decimal(2 ** 236), 'Y(1,3,4,2,5,9)', '\\text{BTBMS}(0)(1^{(2,1)(3,2)})'],
	[new Decimal(2 ** 256), 'Y(1,3,4,3)', '\\text{BTBMS}(0)(1^{(2,1^{(3)})})', '\\text{GHO}'],
	[new Decimal(2 ** 260), 'Y(1,3,4,4)', '\\text{BTBMS}(0)(1^{(2,2)})'],
	[new Decimal(2 ** 264), 'Y(1,3,4,5)', '\\text{BTBMS}(0)(1^{(2^{(3,3)})})'],
	[new Decimal(2 ** 268), 'Y(1,3,4,6)', '\\text{BTBMS}(0)(1^{(2^{(3^{(4^{...})})})})'],
	[new Decimal(2 ** 269), 'Y(1,3,4,6,6)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2)(4,3,1)(4,3,1)'],
	[new Decimal(2 ** 270), 'Y(1,3,4,6,10)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2)(4,3,1)(5,4,2,1)'],
	[new Decimal(2 ** 272), 'Y(1,3,4,7)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2)(4,3,1,,1)'],
	[new Decimal(2 ** 276), 'Y(1,3,4,7,9)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2)(4,3,1,,1)(5,4,1)'],
	[new Decimal(2 ** 280), 'Y(1,3,4,7,11)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2)(4,3,1,,1)(5,4,2)'],
	[new Decimal(2 ** 288), 'Y(1,3,5)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,,1)', '\\text{DCO}'],
	[new Decimal(2 ** 292), 'Y(1,3,5,5)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,,1)'],
	[new Decimal(2 ** 300), 'Y(1,3,5,6)', '\\text{DBMS}(0)(1)(2,1,,1)(4)'],
	[new Decimal(2 ** 310), 'Y(1,3,5,7)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,,1)(4,3,,1)'],
	[new Decimal(2 ** 320), 'Y(1,3,6)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1)'],
	[new Decimal(2 ** 328), 'Y(1,3,6,8)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1)(4,3,,1)'],
	[new Decimal(2 ** 336), 'Y(1,3,6,12)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1)(4,3,2,1,,1)'],
	[new Decimal(2 ** 352), 'Y(1,3,7)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,1)'],
	[new Decimal(2 ** 368), 'Y(1,3,7,15)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,1)(4,3,2,1,,1)'],
	[new Decimal(2 ** 384), 'Y(1,3,8)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,2)'],
	[new Decimal(2 ** 400), 'Y(1,3,8,8)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,2)(3,2,1,,2)'],
	[new Decimal(2 ** 402), 'Y(1,3,8,8,8)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,2)(3,2,1,,2)(3,2,1,,2)'],
	[new Decimal(2 ** 404), 'Y(1,3,8,9)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,2)(3,2,1,,2)(4)'],
	[new Decimal(2 ** 408), 'Y(1,3,8,10)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,2)(3,2,1,,2)(4,3,,1)'],
	[new Decimal(2 ** 412), 'Y(1,3,8,11)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,2)(3,2,1,,2)(4,3,1)'],
	[new Decimal(2 ** 416), 'Y(1,3,8,12)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,2)(4,3,1,,1)'],
	[new Decimal(2 ** 432), 'Y(1,3,8,20)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,2)(4,3,2,1,,3)'],
	[new Decimal(2 ** 448), 'Y(1,3,9)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,2,1)'],
	[new Decimal(2 ** 464), 'Y(1,3,9,25)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,2,1)(4,3,2,1,,3,1)'],
	[new Decimal(2 ** 472), 'Y(1,3,9,26)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,2,1)(4,3,2,1,,3,2)'],
	[new Decimal(2 ** 480), 'Y(1,3,9,27)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,2,1)(4,3,2,1,,3,2,1)'],
	[new Decimal(2 ** 496), 'Y(1,3,9,27,81)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,2,1)(4,3,2,1,,3,2,1)(5,4,3,2,1,,4,3,2,1)'],
	[new Decimal(2 ** 504), 'Y(1,3,9,27,81,243)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,2,1)...(6,5,4,3,2,1,,5,4,3,2,1)'],
	[new Decimal(2 ** 508), 'Y(1,3,9,27,81,243,729)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,2,1)...(7,6,5,4,3,2,1,,6,5,4,3,2,1)'],
	[new Decimal(2 ** 510), 'Y(1,3,9,27,81,243,729,2187)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,2,1)...(8,7,6,5,4,3,2,1,,7,6,5,4,3,2,1)'],
	[new Decimal(2 ** 511), 'Y(1,3,9,27,81,243,729,2187,6561)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,2,1)...(9,8,7,6,5,4,3,2,1,,8,7,6,5,4,3,2,1)'],
	[new Decimal(2 ** 512), 'Y(1,4)', '\\text{DBMS}(0)(1)(2,1,,1)(3,2,1,,2,1,,1)'],
	[new Decimal('9.630466979614933e2585827972'), 'Y(1,5)'],
	[new Decimal('ee153.90699754796802'), 'Y(1,ω)', '\\text{SYO}'],
	[new Decimal('(e^3.402823669209385e+38)153.90699754796802'), 'ω-Y(1,ω)', '\\text{MHO}'],
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

export function getCurrentOrdinal(ord: Decimal): string {
	let milestone = getCurrentYMilestone(ord);
	if (milestone?.[2] === undefined) return milestone[1];
	return milestone.slice(2).join('=');
}
