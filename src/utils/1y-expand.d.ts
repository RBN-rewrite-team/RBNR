interface Mountain2DNode {
  value: number;
  position: number;
  parentIndex: number;
  forcedParent?: boolean;
}

type Mountain2D = Mountain2DNode[][];

declare const lineBreakRegex: RegExp;
declare const itemSeparatorRegex: RegExp;

declare function parseSequenceElement(s: string, i: number): Mountain2DNode;
declare function calcMountain(s: string | Mountain2DNode[]): Mountain2D;
declare function calcDiagonal(mountain: Mountain2D): string;
declare function cloneMountain(mountain: Mountain2D | number[]): Mountain2D;
declare function getBadRoot(s: string | Mountain2D): number;
export declare function expand(s: string | Mountain2D, n: number, stringify?: boolean | number): string | Mountain2D;