var itemSeparatorRegex = /[,\s*]/g;
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
function parseSequenceElement(s, i) {
	var strremoved = s;
	if (
		strremoved.indexOf('v') == -1 ||
		!isFinite(Number(strremoved.substring(strremoved.indexOf('v') + 1)))
	) {
		var numval = Number(strremoved);
		return {
			value: numval,
			position: i,
			parentIndex: -1,
		};
	} else {
		return {
			value: Number(strremoved.substring(0, strremoved.indexOf('v'))),
			position: i,
			parentIndex: Math.max(
				Math.min(i - 1, Number(strremoved.substring(strremoved.indexOf('v') + 1))),
				-1,
			),
			forcedParent: true,
		};
	}
}
function equalVector(s, t, d) {
	if (d === undefined) d = 0;
	for (var i = d, l = Math.max(s.length, t.length); i < l; i++) {
		if ((s[i] || 0) != (t[i] || 0)) return false;
	}
	return true;
}
function addVector(s, t) {
	var r = [];
	for (var i = 0, l = Math.max(s.length, t.length); i < l; i++) {
		r.push((s[i] || 0) + (t[i] || 0));
	}
	return r;
}
function stBasis(d) {
	var r = [];
	while (r.length < d) r.push(0);
	r.push(1);
	return r;
}
function basis(d, k) {
	var r = [];
	while (r.length < d) r.push(0);
	r.push(k);
	return r;
}
function incrementCoord(s, d) {
	var r = s.slice(0);
	for (var i = 0; i < d; i++) r[i] = 0;
	return addVector(r, stBasis(d));
}
function addCoord(s, d, k) {
	var r = s.slice(0);
	for (var i = 0; i < d; i++) r[i] = 0;
	return addVector(r, basis(d, k));
}
function sumArray(s) {
	var r = 0;
	for (var i = 0; i < s.length; i++) r += s[i];
	return r;
}
export function calcMountain(s, maxDim = Infinity) {
	if (maxDim === undefined) maxDim = Infinity;
	var coordOffset = typeof s == 'object' ? s.coord : [];
	if (typeof s == 'string') {
		s = s.split(itemSeparatorRegex).map(parseSequenceElement);
	}
	if (s instanceof Array && s.length <= 1) {
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
		};
	} else if (!(s instanceof Array) && s.arr.length <= 1) {
		return s.arr[0];
	} else {
		var m;
		if (s instanceof Array) {
			m = {
				dim: 1,
				arr: [],
				coord: coordOffset.slice(0),
			};
			for (var i = 0; i < s.length; i++) {
				m.arr.push({
					dim: 0,
					value: s[i].value,
					position: s[i].position,
					coord: addCoord(coordOffset, 0, i),
					parentIndex: s[i].parentIndex,
					forcedParent: s[i].forcedParent,
					leftLegCoord: null,
					rightLegCoord: null,
				});
				if (!s[i].forcedParent) {
					for (var j = i; j >= 0; j--) {
						if (s[j].value < s[i].value) {
							m.arr[i].parentIndex = j;
							break;
						}
					}
				}
			}
		} else {
			m = s;
		}
		var lastPosition = sumArray(m.arr[m.arr.length - 1].coord);
		var dimensions = 1;
		while (dimensions <= maxDim) {
			var uppers = calcDifference(m);
			if (uppers.arr.length < 1) break;
			var upperm = calcMountain(uppers, dimensions);
			var upperdim = upperm.dim;
			var raisedupperm = upperm;
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
function calcDifference(m) {
	var coordOffset = incrementCoord(m.coord, m.dim);
	var rightLegs = [];
	var rightLegTree = [];
	var rightLegPositions = [];
	if (m.dim == 1) {
		for (var i = 0; i < m.arr.length; i++) {
			rightLegs.push(m.arr[i]);
			rightLegTree.push(m.arr[i].parentIndex);
			rightLegPositions.push(sumArray(m.arr[i].coord));
		}
	} else {
		for (var i = 0; i <= getLastPosition(m); i++) {
			var node = findHighestWithPosition(m, i);
			if (node) rightLegPositions.push(i);
		}
		for (var i = 0; i < rightLegPositions.length; i++) {
			var node = findHighestWithPosition(m, rightLegPositions[i]);
			rightLegs.push(node);
			var pn = node;
			while (pn) {
				var ppn = parent(m, pn);
				if (!ppn) ppn = leftLeg(m, pn);
				if (!ppn) {
					rightLegTree.push(-1);
					break;
				}
				pn = ppn;
				if (pn.parentIndex == -1 && rightLegPositions.indexOf(sumArray(pn.coord)) != -1) {
					rightLegTree.push(rightLegPositions.indexOf(sumArray(pn.coord)));
					break;
				}
			}
			if (!pn) rightLegTree.push(-1);
		}
	}
	var rightLegInR = [];
	var rInRightLeg = [];
	var rightLegParents = [];
	var r = {
		dim: 1,
		arr: [],
		coord: coordOffset,
	};
	for (var i = 0; i < rightLegs.length; i++) {
		var pi = i;
		while (
			pi > -1 &&
			!(
				rightLegs[pi].value < rightLegs[i].value &&
				(rightLegs[pi].coord[m.dim - 1] || 0) < (rightLegs[i].coord[m.dim - 1] || 0)
			)
		)
			pi = rightLegTree[pi];
		rightLegParents.push(pi);
		if (pi != -1) {
			rightLegInR.push(r.arr.length);
			rInRightLeg.push(i);
			r.arr.push({
				dim: 0,
				value: rightLegs[i].value - rightLegs[pi].value,
				position: rightLegPositions[i],
				coord: addCoord(coordOffset, 0, rightLegPositions[i] - sumArray(coordOffset)),
				parentIndex: -1,
				forcedParent: true,
				leftLegCoord: rightLegs[pi].coord.slice(0),
				rightLegCoord: rightLegs[i].coord.slice(0),
			});
		} else {
			rightLegInR.push(-1);
		}
	}
	for (var i = 0; i < r.arr.length; i++) {
		var pi = rInRightLeg[i];
		while (true) {
			var ppi = rightLegParents[pi];
			if (ppi == -1 || rightLegInR[ppi] == -1) break;
			pi = ppi;
			if (r.arr[rightLegInR[pi]].value < r.arr[i].value) {
				r.arr[i].parentIndex = rightLegInR[pi];
				break;
			}
		}
	}
	return r;
}
function indexFromCoord(m, coord, d) {
	if (d === undefined) d = 0;
	var r = [];
	while (true) {
		if (m.dim <= d) {
			if (equalVector(m.coord, coord, d)) return r;
			else return null;
		}
		/*for (var i=0;i<m.arr.length+1;i++){
      if (i==m.arr.length) return null;
      if (equalVector(m.arr[i].coord,coord,m.arr[i].dim)){
        r.push(i);
        m=m.arr[i];
        break;
      }
    }*/
		//Performance: should be equivalent for a well-formed mountain
		if (m.dim == 1) {
			for (var i = 0; i < m.arr.length + 1; i++) {
				if (i == m.arr.length) return null;
				//if (equalVector(m.arr[i].coord,coord)){
				if (m.arr[i].coord[0] == coord[0]) {
					r.push(i);
					m = m.arr[i];
					break;
				}
			}
		} else {
			var i = coord[m.dim - 1] || 0;
			if (i >= m.arr.length) return null;
			r.push(i);
			m = m.arr[i];
		}
	}
}
export function findByIndex(m, index) {
	if (!index) return null;
	for (var i = 0; i < index.length; i++)
		m = m.arr[index[i] < 0 ? m.arr.length + index[i] : index[i]];
	return m;
}
export function findByCoord(m, coord, d) {
	return findByIndex(m, indexFromCoord(m, coord, d));
}
function getLastPosition(m) {
	while (m.dim > 1) m = m.arr[0];
	return m.arr[m.arr.length - 1].position;
}
function findHighestWithPosition(m, position) {
	if (m.dim == 0) {
		if (m.position == position) return m;
		else return null;
	} else {
		/*for (var i=m.arr.length-1;i>=0;i--){
      var r=findHighestWithPosition(m.arr[i],position);
      if (r) return r;
    }
    return null;*/
		//Performance: should be equivalent for a well-formed mountain
		if (m.arr.length === 0) return null;
		if (m.dim == 1) {
			var min = 0;
			var max = m.arr.length - 1;
			if (m.arr[min].position > position || m.arr[max].position < position) return null;
			if (m.arr[min].position == position) return m.arr[min];
			if (m.arr[max].position == position) return m.arr[max];
			while (min != max) {
				var mid = Math.floor((min + max) / 2);
				if (m.arr[mid].position == position) return m.arr[mid];
				else if (min == mid) return null;
				else if (m.arr[mid].position < position) min = mid;
				else if (m.arr[mid].position > position) max = mid;
			}
			return null;
		} else {
			for (var i = m.arr.length - 1; i >= 0; i--) {
				var lowestRow = m.arr[i];
				while (lowestRow && lowestRow.dim > 1) lowestRow = lowestRow.arr[0];
				if (!lowestRow) continue;
				var nodeInLowestRow = findHighestWithPosition(lowestRow, position);
				if (nodeInLowestRow) {
					if (m.dim == 2)
						return nodeInLowestRow; //Since m.arr[i].dim==1, it is guaranteed to be the highest
					else return findHighestWithPosition(m.arr[i], position);
				}
			}
			return null;
		}
	}
}
function parent(m, node) {
	if (node.dim != 0 || node.parentIndex == -1) return null;
	var index = indexFromCoord(m, node.coord);
	if (!index) return null;
	index[index.length - 1] = node.parentIndex;
	return findByIndex(m, index);
}
function leftLeg(m, node) {
	if (node.dim != 0 || !node.leftLegCoord) return null;
	return findByCoord(m, node.leftLegCoord);
}
function rightLeg(m, node) {
	if (node.dim != 0 || !node.rightLegCoord) return null;
	return findByCoord(m, node.rightLegCoord);
}
function findAbove(m, node) {
	if (node.dim != 0) return null;
	var index = indexFromCoord(m, node.coord);
	if (!index) return null;
	for (var i = index.length - 1; i > 0; i--) {
		index[i] = 0;
		index[i - 1]++;
		index[index.length - 1] = node.position - sumArray(index.slice(0, -1));
		if (!findByIndex(m, index.slice(0, i))) continue;
		var candidate = findByIndex(m, index);
		if (candidate) return candidate;
	}
	return null;
}
function flattenMountain(m) {
	var r = {};
	if (m.dim == 0) {
		r[m.coord.join(',')] = m;
	} else {
		for (var i = 0; i < m.arr.length; i++) {
			Object.assign(r, flattenMountain(m.arr[i]));
		}
	}
	return r;
}
function cloneMountain(mountain) {
	var newMountain = Object.assign({}, mountain);
	if (mountain.dim === 0) {
		newMountain.coord = newMountain.coord.slice(0);
		newMountain.leftLegCoord = newMountain.leftLegCoord && newMountain.leftLegCoord.slice(0);
		newMountain.rightLegCoord = newMountain.rightLegCoord && newMountain.rightLegCoord.slice(0);
	} else {
		newMountain.arr = newMountain.arr.map(cloneMountain);
		newMountain.coord = newMountain.coord.slice(0);
	}
	return newMountain;
}
function getBadRoot(s) {
	var mountain;
	if (typeof s == 'string') mountain = calcMountain(s);
	else mountain = s;
	return leftLeg(mountain, findHighestWithPosition(mountain, getLastPosition(mountain)));
}
function filterEmpty(mountain) {
	if (mountain.dim > 0) {
		for (var i = mountain.arr.length - 1; i >= 0; i--) {
			filterEmpty(mountain.arr[i]);
			if (mountain.arr[i].dim > 0 && mountain.arr[i].arr.length === 0)
				mountain.arr.slice(i, 1);
		}
	}
	return mountain;
}
function findHighestWithPositionBelow(m, sub, position) {
	var crawlIndex = indexFromCoord(m, sub.coord, sub.dim);
	while (true) {
		crawlIndex[crawlIndex.length - 1]--;
		while (crawlIndex.length > 0 && crawlIndex[crawlIndex.length - 1] < 0) {
			crawlIndex.pop();
			crawlIndex[crawlIndex.length - 1]--;
		}
		if (crawlIndex.length === 0) break;
		var r = findHighestWithPosition(findByIndex(m, crawlIndex), position);
		if (r) return r;
	}
	return null;
}
export function wYexpand(s, n, legBasedAscension = false, stringify = true) {
	var mountain;
	if (typeof s == 'string') mountain = calcMountain(s);
	else mountain = s;
	if (stringify === undefined) stringify = true;
	var result = cloneMountain(mountain);
	var badRoot = getBadRoot(mountain);
	var cutPosition = getLastPosition(mountain);
	var topCut = findHighestWithPosition(mountain, cutPosition);
	var cutLookup = topCut;
	while (cutLookup) {
		var parentRow = findByCoord(result, cutLookup.coord, 1);
		parentRow.arr.pop();
		cutLookup = rightLeg(result, cutLookup);
	}
	filterEmpty(result);
	if (badRoot) {
		var badRootPosition = badRoot.position;
		var badRootRow = findByCoord(mountain, badRoot.coord, 1);
		var bottomCut = mountain;
		while (bottomCut.dim > 1) bottomCut = bottomCut.arr[0];
		bottomCut = bottomCut.arr[bottomCut.arr.length - 1];
		var belowCopyStackBase = [];
		var aboveCopyStackBase = [];
		var topCutIndex = indexFromCoord(mountain, topCut.coord);
		var crawlIndex = topCutIndex.slice(0, -1);
		while (true) {
			crawlIndex[crawlIndex.length - 1]--;
			while (crawlIndex.length > 0 && crawlIndex[crawlIndex.length - 1] < 0) {
				crawlIndex.pop();
				crawlIndex[crawlIndex.length - 1]--;
			}
			if (crawlIndex.length === 0) break;
			var sourceSubMountain = findByIndex(mountain, crawlIndex);
			var destSubMountain = findByIndex(result, crawlIndex);
			belowCopyStackBase.push([sourceSubMountain, destSubMountain, null, 0, false]);
		}
		crawlIndex = topCutIndex.slice(0, -1);
		if (indexFromCoord(result, findByIndex(mountain, crawlIndex).coord, 1)) {
			while (true) {
				var sourceSubMountain = findByIndex(mountain, crawlIndex);
				var destSubMountain = findByIndex(result, crawlIndex);
				aboveCopyStackBase.unshift([sourceSubMountain, destSubMountain]);
				crawlIndex[crawlIndex.length - 1]++;
				while (
					crawlIndex.length > 0 &&
					crawlIndex[crawlIndex.length - 1] >=
						findByIndex(mountain, crawlIndex.slice(0, -1)).arr.length
				) {
					crawlIndex.pop();
					crawlIndex[crawlIndex.length - 1]++;
				}
				if (crawlIndex.length === 0) break;
			}
		}
	}
	var debugout = '';
	var subCutCache = {};
	var subBadRootCache = {};
	var subBadRootRowCache = {};
	var topNodeCache = {};
	var isAscendingCache = {};
	//Create Mt.Fuji shell
	for (var i = 0; i <= n && badRoot; i++) {
		//iteration
		for (var x = i === 0 ? cutPosition : badRootPosition + 1; x < cutPosition + (i < n); x++) {
			//position
			var nodeBelow = null;
			var belowCopyStack = belowCopyStackBase.slice(0);
			while (belowCopyStack.length) {
				var popItem = belowCopyStack.pop();
				var sourceSubMountain = popItem[0];
				var destSubMountain = popItem[1];
				var cleanCopySource = popItem[2];
				var cleanCopyOffset = popItem[3];
				var ignoreBelow = popItem[4];
				/*var subCut=findHighestWithPosition(sourceSubMountain,cutPosition);
        var subBadRoot=findHighestWithPosition(sourceSubMountain,badRootPosition);
        var subBadRootRow=subBadRoot&&findByCoord(sourceSubMountain,subBadRoot.coord,1);
        var topNode=findHighestWithPosition(sourceSubMountain,x);
        topNodeCache[sourceSubMountainAndPositionID]=topNode;
        if (!topNode) continue;
        var referenceRow=subBadRootRow&&subBadRootRow.coord[1]&&findByCoord(sourceSubMountain,addCoord(subBadRootRow.coord,1,-1),1)||subBadRootRow;
        var nodeInReferenceRow=referenceRow&&findHighestWithPosition(referenceRow,x);
        while (nodeInReferenceRow&&nodeInReferenceRow.position>badRootPosition) nodeInReferenceRow=parent(referenceRow,nodeInReferenceRow);
        var isAscending=nodeInReferenceRow&&nodeInReferenceRow.position==badRootPosition;*/
				var sourceSubMountainID =
					sourceSubMountain.coord.join(',') + ',' + sourceSubMountain.dim;
				if (subCutCache[sourceSubMountainID] === undefined) {
					var subCut = findHighestWithPosition(sourceSubMountain, cutPosition);
					var subBadRoot = findHighestWithPosition(sourceSubMountain, badRootPosition);
					var subBadRootRow =
						subBadRoot && findByCoord(sourceSubMountain, subBadRoot.coord, 1);
					subCutCache[sourceSubMountainID] = subCut;
					subBadRootCache[sourceSubMountainID] = subBadRoot;
					subBadRootRowCache[sourceSubMountainID] = subBadRootRow;
				} else {
					var subCut = subCutCache[sourceSubMountainID];
					var subBadRoot = subBadRootCache[sourceSubMountainID];
					var subBadRootRow = subBadRootRowCache[sourceSubMountainID];
				}
				var sourceSubMountainAndPositionID = sourceSubMountainID + ',' + x;
				if (topNodeCache[sourceSubMountainAndPositionID] === undefined) {
					var topNode = findHighestWithPosition(sourceSubMountain, x);
					topNodeCache[sourceSubMountainAndPositionID] = topNode;
					if (!topNode) continue;
					if (legBasedAscension) {
						var nodeInSubBadRootRow =
							subBadRootRow && findHighestWithPosition(subBadRootRow, x);
						while (
							nodeInSubBadRootRow &&
							nodeInSubBadRootRow.position > badRootPosition
						) {
							var leftLegPosition = nodeInSubBadRootRow.leftLegCoord
								? sumArray(nodeInSubBadRootRow.leftLegCoord)
								: nodeInSubBadRootRow.position - 1;
							nodeInSubBadRootRow = findHighestWithPosition(
								subBadRootRow,
								leftLegPosition,
							);
						}
						var isAscending =
							nodeInSubBadRootRow && nodeInSubBadRootRow.position == badRootPosition;
						isAscendingCache[sourceSubMountainAndPositionID] = isAscending;
					} else {
						var referenceRow =
							(subBadRootRow &&
								subBadRootRow.coord[1] &&
								findByCoord(
									sourceSubMountain,
									addCoord(subBadRootRow.coord, 1, -1),
									1,
								)) ||
							subBadRootRow;
						var nodeInReferenceRow =
							referenceRow && findHighestWithPosition(referenceRow, x);
						while (nodeInReferenceRow && nodeInReferenceRow.position > badRootPosition)
							nodeInReferenceRow = parent(referenceRow, nodeInReferenceRow);
						var isAscending =
							nodeInReferenceRow && nodeInReferenceRow.position == badRootPosition;
						isAscendingCache[sourceSubMountainAndPositionID] = isAscending;
					}
				} else {
					var topNode = topNodeCache[sourceSubMountainAndPositionID];
					if (!topNode) continue;
					var isAscending = isAscendingCache[sourceSubMountainAndPositionID];
				}
				//debugout+="-".repeat(mountain.dim-sourceSubMountain.dim)+[i,x,sourceSubMountain&&[sourceSubMountain.coord,sourceSubMountain.dim],destSubMountain&&[destSubMountain.coord,destSubMountain.dim],cleanCopySource&&[cleanCopySource.coord,cleanCopySource.dim],cleanCopyOffset,ignoreBelow,isAscending].map(JSON.stringify).join(",")+"<br>";
				if (sourceSubMountain.dim == 1) {
					if (cleanCopySource) {
						var position = x + (cutPosition - badRootPosition) * i;
						var sourceNode = findHighestWithPosition(cleanCopySource, x);
						var sourceLeftLegPosition = sourceNode.leftLegCoord
							? sumArray(sourceNode.leftLegCoord)
							: x - 1;
						var leftLegPosition =
							sourceLeftLegPosition >= badRootPosition
								? sourceLeftLegPosition + (cutPosition - badRootPosition) * i
								: sourceLeftLegPosition;
						var nodeLeftDown = findHighestWithPositionBelow(
							result,
							destSubMountain,
							leftLegPosition,
						);
						var leftLegCoord = nodeLeftDown ? nodeLeftDown.coord : null;
						//var nodeBelow=findHighestWithPosition(result,position);
						var rightLegCoord = nodeBelow ? nodeBelow.coord : null;
						if (nodeBelow) {
							if (equalVector(leftLegCoord, rightLegCoord, 1)) {
								var leftLegIndex = indexFromCoord(result, leftLegCoord);
								nodeBelow.parentIndex = leftLegIndex[leftLegIndex.length - 1];
							} else {
								nodeBelow.parentIndex = -1;
							}
						}
						destSubMountain.arr.push(
							(nodeBelow = {
								dim: 0,
								value: NaN,
								position: position,
								coord: addCoord(
									destSubMountain.coord,
									0,
									position - sumArray(destSubMountain.coord),
								),
								parentIndex: -1,
								forcedParent: sourceNode.forcedParent,
								leftLegCoord: leftLegCoord,
								rightLegCoord: rightLegCoord,
							}),
						);
					} else {
						var position = x + (cutPosition - badRootPosition) * i;
						var sourceNode = findHighestWithPosition(sourceSubMountain, x);
						var sourceLeftLegPosition = sourceNode.leftLegCoord
							? sumArray(sourceNode.leftLegCoord)
							: -1;
						var leftLegPosition =
							sourceLeftLegPosition >= badRootPosition
								? sourceLeftLegPosition + (cutPosition - badRootPosition) * i
								: sourceLeftLegPosition;
						var nodeLeftDown = findHighestWithPositionBelow(
							result,
							destSubMountain,
							leftLegPosition,
						);
						var leftLegCoord = nodeLeftDown ? nodeLeftDown.coord : null;
						//var nodeBelow=findHighestWithPosition(result,position);
						var rightLegCoord = nodeBelow ? nodeBelow.coord : null;
						if (nodeBelow) {
							if (equalVector(leftLegCoord, rightLegCoord, 1)) {
								var leftLegIndex = indexFromCoord(result, leftLegCoord);
								nodeBelow.parentIndex = leftLegIndex[leftLegIndex.length - 1];
							} else {
								nodeBelow.parentIndex = -1;
							}
						}
						destSubMountain.arr.push(
							(nodeBelow = {
								dim: 0,
								value: NaN,
								position: position,
								coord: addCoord(
									destSubMountain.coord,
									0,
									position - sumArray(destSubMountain.coord),
								),
								parentIndex: -1,
								forcedParent: sourceNode.forcedParent,
								leftLegCoord: leftLegCoord,
								rightLegCoord: rightLegCoord,
							}),
						);
					}
				} else {
					var subCutHeight = (subCut && subCut.coord[sourceSubMountain.dim - 1]) || 0;
					var subBadRootHeight =
						(subBadRoot && subBadRoot.coord[sourceSubMountain.dim - 1]) || 0;
					var topNodeHeight = topNode.coord[sourceSubMountain.dim - 1] || 0;
					if (isAscending) {
						if (cleanCopySource) {
							var generationsFromSubBadRoot = 0;
							var nodeInCleanCopySource = findHighestWithPosition(cleanCopySource, x);
							if (nodeInCleanCopySource.leftLegCoord) {
								var lowAncestorNode = nodeInCleanCopySource;
								while (lowAncestorNode.position > badRootPosition) {
									lowAncestorNode = findHighestWithPosition(
										cleanCopySource,
										sumArray(lowAncestorNode.leftLegCoord),
									);
									generationsFromSubBadRoot++;
								}
							} else {
								generationsFromSubBadRoot = x - badRootPosition;
							}
							var lastReplacedCut = findHighestWithPosition(
								destSubMountain,
								badRootPosition + (cutPosition - badRootPosition) * i,
							);
							var lastReplacedCutHeight =
								(lastReplacedCut &&
									lastReplacedCut.coord[sourceSubMountain.dim - 1]) ||
								0;
							var targetHeight =
								i === 0
									? topNodeHeight
									: lastReplacedCutHeight +
										generationsFromSubBadRoot -
										cleanCopyOffset;
							if (ignoreBelow) {
								while (destSubMountain.arr.length < targetHeight + 1) {
									destSubMountain.arr.push({
										dim: destSubMountain.dim - 1,
										arr: [],
										coord: addCoord(
											destSubMountain.coord,
											destSubMountain.dim - 1,
											destSubMountain.arr.length,
										),
									});
								}
								for (var j = targetHeight; j >= 0; j--) {
									belowCopyStack.push([
										sourceSubMountain.arr[subBadRootHeight],
										destSubMountain.arr[j],
										cleanCopySource,
										Math.max(j - lastReplacedCutHeight + cleanCopyOffset, 0),
										true,
									]);
								}
							} else {
								if (!lastReplacedCut || cleanCopyOffset)
									throw Error('Something went wrong');
								while (destSubMountain.arr.length < targetHeight + 1) {
									destSubMountain.arr.push({
										dim: destSubMountain.dim - 1,
										arr: [],
										coord: addCoord(
											destSubMountain.coord,
											destSubMountain.dim - 1,
											destSubMountain.arr.length,
										),
									});
								}
								for (var j = targetHeight; j >= 0; j--) {
									if (j < subBadRootHeight) {
										belowCopyStack.push([
											sourceSubMountain.arr[j],
											destSubMountain.arr[j],
											null,
											0,
											false,
										]);
									} else {
										belowCopyStack.push([
											sourceSubMountain.arr[subBadRootHeight],
											destSubMountain.arr[j],
											cleanCopySource,
											Math.max(
												j - lastReplacedCutHeight + cleanCopyOffset,
												0,
											),
											j > subBadRootHeight,
										]);
									}
								}
							}
						} else {
							if (cleanCopyOffset) throw Error('Something went wrong');
							if (ignoreBelow) {
								var lastReplacedCut = findHighestWithPosition(
									destSubMountain,
									badRootPosition + (cutPosition - badRootPosition) * i,
								);
								var lastReplacedCutHeight =
									(lastReplacedCut &&
										lastReplacedCut.coord[sourceSubMountain.dim - 1]) ||
									0;
								if (!lastReplacedCut && cleanCopyOffset)
									throw Error('Something went wrong');
								var targetHeight =
									i === 0 ? topNodeHeight : lastReplacedCutHeight + topNodeHeight;
								while (
									destSubMountain.arr.length <
									targetHeight - subBadRootHeight + 1
								) {
									destSubMountain.arr.push({
										dim: destSubMountain.dim - 1,
										arr: [],
										coord: addCoord(
											destSubMountain.coord,
											destSubMountain.dim - 1,
											destSubMountain.arr.length,
										),
									});
								}
								for (var j = targetHeight; j >= subBadRootHeight; j--) {
									if (
										j <
										lastReplacedCutHeight +
											subBadRootHeight +
											(sourceSubMountain.dim == 2)
									) {
										belowCopyStack.push([
											sourceSubMountain.arr[subBadRootHeight],
											destSubMountain.arr[j - subBadRootHeight],
											subBadRootRow,
											0,
											true,
										]);
									} else {
										belowCopyStack.push([
											sourceSubMountain.arr[j - lastReplacedCutHeight],
											destSubMountain.arr[j - subBadRootHeight],
											null,
											0,
											j == lastReplacedCutHeight + subBadRootHeight,
										]);
									}
								}
							} else {
								while (
									destSubMountain.arr.length <
									topNodeHeight + (subCutHeight - subBadRootHeight) * i + 1
								) {
									destSubMountain.arr.push({
										dim: destSubMountain.dim - 1,
										arr: [],
										coord: addCoord(
											destSubMountain.coord,
											destSubMountain.dim - 1,
											destSubMountain.arr.length,
										),
									});
								}
								for (
									var j = topNodeHeight + (subCutHeight - subBadRootHeight) * i;
									j >= 0;
									j--
								) {
									if (j < subBadRootHeight) {
										belowCopyStack.push([
											sourceSubMountain.arr[j],
											destSubMountain.arr[j],
											null,
											0,
											false,
										]);
									} else if (
										j <
										subBadRootHeight +
											(subCutHeight - subBadRootHeight) * i +
											(sourceSubMountain.dim == 2)
									) {
										belowCopyStack.push([
											sourceSubMountain.arr[subBadRootHeight],
											destSubMountain.arr[j],
											subBadRootRow,
											0,
											j > subBadRootHeight,
										]);
									} else {
										belowCopyStack.push([
											sourceSubMountain.arr[
												j - (subCutHeight - subBadRootHeight) * i
											],
											destSubMountain.arr[j],
											null,
											0,
											i !== 0 &&
												j ==
													subBadRootHeight +
														(subCutHeight - subBadRootHeight) * i,
										]);
									}
								}
							}
						}
					} else {
						if (cleanCopySource || cleanCopyOffset || ignoreBelow)
							throw Error('Something went wrong');
						while (destSubMountain.arr.length < topNodeHeight + 1) {
							destSubMountain.arr.push({
								dim: destSubMountain.dim - 1,
								arr: [],
								coord: addCoord(
									destSubMountain.coord,
									destSubMountain.dim - 1,
									destSubMountain.arr.length,
								),
							});
						}
						for (var j = topNodeHeight; j >= 0; j--) {
							belowCopyStack.push([
								sourceSubMountain.arr[j],
								destSubMountain.arr[j],
								null,
								0,
								false,
							]);
						}
					}
				}
			}
			var aboveCopySourceX = x == cutPosition ? badRootPosition : x;
			var aboveCopyStack = aboveCopyStackBase.slice(0);
			while (aboveCopyStack.length) {
				var popItem = aboveCopyStack.pop();
				var sourceSubMountain = popItem[0];
				var destSubMountain = popItem[1];
				var topNode = findHighestWithPosition(sourceSubMountain, aboveCopySourceX);
				if (!topNode) continue;
				//debugout+="-".repeat(mountain.dim-sourceSubMountain.dim)+[i,x,sourceSubMountain&&[sourceSubMountain.coord,sourceSubMountain.dim],destSubMountain&&[destSubMountain.coord,destSubMountain.dim]].map(JSON.stringify).join(",")+"<br>";
				if (sourceSubMountain.dim == 1) {
					var position = x + (cutPosition - badRootPosition) * i;
					var nodeInSourceSubMountain = topNode;
					var sourceLeftLegPosition = nodeInSourceSubMountain.leftLegCoord
						? sumArray(nodeInSourceSubMountain.leftLegCoord)
						: -1;
					var leftLegPosition =
						sourceLeftLegPosition >= badRootPosition
							? sourceLeftLegPosition + (cutPosition - badRootPosition) * i
							: sourceLeftLegPosition;
					var nodeLeftDown = findHighestWithPositionBelow(
						result,
						destSubMountain,
						leftLegPosition,
					);
					var leftLegCoord = nodeLeftDown ? nodeLeftDown.coord : null;
					//var nodeBelow=findHighestWithPosition(result,position);
					var rightLegCoord = nodeBelow ? nodeBelow.coord : null;
					if (nodeBelow) {
						if (equalVector(leftLegCoord, rightLegCoord, 1)) {
							var leftLegIndex = indexFromCoord(result, leftLegCoord);
							nodeBelow.parentIndex = leftLegIndex[leftLegIndex.length - 1];
						} else {
							nodeBelow.parentIndex = -1;
						}
					}
					destSubMountain.arr.push(
						(nodeBelow = {
							dim: 0,
							value: NaN,
							position: position,
							coord: addCoord(
								destSubMountain.coord,
								0,
								position - sumArray(destSubMountain.coord),
							),
							parentIndex: -1,
							forcedParent: nodeInSourceSubMountain.forcedParent,
							leftLegCoord: leftLegCoord,
							rightLegCoord: rightLegCoord,
						}),
					);
				} else {
					var topNodeHeight = (topNode && topNode.coord[sourceSubMountain.dim - 1]) || 0;
					for (var j = topNodeHeight; j >= 0; j--) {
						aboveCopyStack.push([sourceSubMountain.arr[j], destSubMountain.arr[j]]);
					}
				}
			}
		}
	}
	//Build number from ltr, ttb
	var lastBottomNode = result;
	while (lastBottomNode && lastBottomNode.dim > 0) {
		if (lastBottomNode.dim == 1) {
			lastBottomNode = lastBottomNode.arr[lastBottomNode.arr.length - 1];
		} else {
			lastBottomNode = lastBottomNode.arr[0];
		}
	}
	var resultLength = (lastBottomNode && lastBottomNode.position) || 0;
	for (var x = 0; x <= resultLength; x++) {
		var node = findHighestWithPosition(result, x);
		var aboveNode = null;
		while (node) {
			if (isNaN(node.value)) {
				//debugout+=JSON.stringify(node.coord)+","+JSON.stringify(aboveNode&&aboveNode.coord)+"<br>";
				if (aboveNode) {
					var pseudoParentNode = leftLeg(result, aboveNode);
					if (!pseudoParentNode) {
						throw Error('Mountain not complete');
					}
					if (node.coord.length < pseudoParentNode.coord.length) {
						console.warn(
							'The left leg is in an awkward position from the right leg:',
							pseudoParentNode,
							node,
							aboveNode,
						);
						debugout +=
							'Warning: The left leg is in an awkward position from the right leg ' +
							[pseudoParentNode.coord, node.coord, aboveNode.coord]
								.map(JSON.stringify)
								.join(',') +
							'<br>';
					} else if (node.coord.length == pseudoParentNode.coord.length) {
						for (var i = node.coord.length - 1; i >= 0; i--) {
							if (
								(i === 0 && !equalVector(node.coord, aboveNode.coord, 2)) ||
								node.coord[i] < pseudoParentNode.coord[i] ||
								(equalVector(node.coord, aboveNode.coord, i + 1) &&
									node.coord[i] > pseudoParentNode.coord[i] + 1)
							) {
								console.warn(
									'The left leg is in an awkward position from the right leg:',
									pseudoParentNode,
									node,
									aboveNode,
								);
								debugout +=
									'Warning: The left leg is in an awkward position from the right leg ' +
									[pseudoParentNode.coord, node.coord, aboveNode.coord]
										.map(JSON.stringify)
										.join(',') +
									'<br>';
							} else if (node.coord[i] > pseudoParentNode.coord[i]) break;
						}
					}
					node.value = pseudoParentNode.value + aboveNode.value;
				} else {
					node.value = 1;
				}
			}
			aboveNode = node;
			node = rightLeg(result, node);
		}
	}
	//debugout+=JSON.stringify(result);
	var rr;
	if (stringify) {
		rr = [];
		if (result.arr.length) {
			var bottomrow = result;
			while (bottomrow.dim > 1) bottomrow = bottomrow.arr[0];
			for (var i = 0; i < bottomrow.arr.length; i++) {
				rr.push(
					bottomrow.arr[i].value +
						(bottomrow.arr[i].forcedParent ? 'v' + bottomrow.arr[i].parentIndex : ''),
				);
			}
		}
		rr = rr.join(',');
	} else {
		rr = result;
	}
	return rr;
}
