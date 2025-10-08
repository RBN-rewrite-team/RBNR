// mountain.d.ts

interface LeafMountain {
  dim: 0;
  forcedParent?: boolean;
  leftLegCoord: null | number[];
  rightLegCoord: null | number[];
  value: number;
  parentIndex: number;
  position: number;
  coord: number[];
}

interface NodeMountain {
  arr: Mountain[];
  coord: number[];
  dim: Exclude<number, 0>;
}

type Mountain = LeafMountain | NodeMountain;

declare function parseSequenceElement(s: string, i: number): Partial<LeafMountain> & { value: number; position: number; parentIndex: number };
declare function parseSequenceString(s: string): Array<Partial<LeafMountain> & { value: number; position: number; parentIndex: number }>;
declare function equalVector(s: number[], t: number[], d?: number): boolean;
declare function addVector(s: number[], t: number[]): number[];
declare function stBasis(d: number): number[];
declare function basis(d: number, k: number): number[];
declare function incrementCoord(s: number[], d: number): number[];
declare function addCoord(s: number[], d: number, k: number): number[];
declare function sumArray(s: number[]): number;
export declare function calcMountain(s: string | Array<Partial<LeafMountain> & { value: number; position: number; parentIndex: number }> | NodeMountain, maxDim?: number): Mountain;
declare function calcDifference(m: NodeMountain): NodeMountain;
declare function indexFromCoord(m: Mountain, coord: number[], d?: number): number[] | null;
export declare function findByIndex(m: Mountain, index: number[]): Mountain | null;
export declare function findByCoord(m: Mountain, coord: number[], d?: number): Mountain | null;
declare function getLastPosition(m: Mountain): number;
declare function findHighestWithPosition(m: Mountain, position: number): LeafMountain | null;
declare function parent(m: NodeMountain, node: LeafMountain): Mountain | null;
declare function leftLeg(m: NodeMountain, node: LeafMountain): Mountain | null;
declare function rightLeg(m: NodeMountain, node: LeafMountain): Mountain | null;
declare function flattenMountain(m: Mountain): Record<string, Mountain>;
declare function cloneMountain(mountain: Mountain): Mountain;
declare function getBadRoot(s: string | Mountain): Mountain | null;
declare function filterEmpty(mountain: Mountain): Mountain;
declare function findHighestWithPositionBelow(m: Mountain, sub: Mountain, position: number): Mountain | null;
declare function expand(s: string | Mountain, n: number, legBasedAscension?: boolean, stringify?: boolean): string | Mountain;
export declare function expandmulti(s: string | Mountain, nstring: string, legBasedAscension?: boolean, maxDimensions?: number): string | Mountain;

declare const itemSeparatorRegex: RegExp;