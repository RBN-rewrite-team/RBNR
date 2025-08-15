type Term = [] | [Term, Term, Term];
type MatrixRow = [number, number, number];
type Matrix = MatrixRow[];

const ZERO: Term = [];
const ONE: Term = [[], [], []];

function iz(a: Term | number): a is [] {
	return Array.isArray(a) && a.length === 0;
}

function eq(a: Term | number, b: Term | number): boolean {
	if (typeof a === 'number' && typeof b === 'number') {
		return a === b;
	}
	if (iz(a) || iz(b)) {
		return iz(a) === iz(b);
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		return eq(a[0], b[0]) && eq(a[1], b[1]) && eq(a[2], b[2]);
	}
	return false;
}

function lt(a: Term | number, b: Term | number): boolean {
	if (iz(b)) return false;
	if (iz(a)) return true;
	if (Array.isArray(a) && Array.isArray(b) && !eq(a[0], b[0])) {
		return lt(a[0], b[0]);
	}
	if (Array.isArray(a) && Array.isArray(b) && !eq(a[1], b[1])) {
		return lt(a[1], b[1]);
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		return lt(a[2], b[2]);
	}
	return false;
}

function gt(a: Term | number, b: Term | number): boolean {
	return !(lt(a, b) || eq(a, b));
}

function add(a: Term, b: Term): Term {
	if (iz(a)) return b;
	if (iz(b)) return a;
	const termA = a as [Term, Term, Term];
	const termB = b as [Term, Term, Term];
	if (lt([termA[0], termA[1], []], [termB[0], termB[1], []])) {
		return b;
	}
	return [termA[0], termA[1], add(termA[2], b)];
}

function suc(a: Term): Term {
	return add(a, ONE);
}

function sub(a: Term, b: Term): Term {
	if (iz(a)) return [];
	if (iz(b)) return a;
	const termA = a as [Term, Term, Term];
	const termB = b as [Term, Term, Term];
	if (gt([termA[0], termA[1], []], [termB[0], termB[1], []])) {
		return a;
	}
	return sub(termA[2], termB[2]);
}

function s(a: Term, b: Term): [Term, Term] {
	if (iz(a)) return [[], []];
	const termA = a as [Term, Term, Term];
	if (lt([termA[0], termA[1], []], b)) {
		return [[], a];
	}
	const sResult = s(termA[2], b);
	return [[termA[0], termA[1], sResult[0]], sResult[1]];
}

function l(a: Term): Term {
	if (iz(a)) return [];
	const termA = a as [Term, Term, Term];
	if (iz(termA[2])) return a;
	return l(termA[2]);
}

function ttc(a: Term, b: Term): Term {
	if (iz(a)) return [];
	const termA = a as [Term, Term, Term];
	const ttcResult = ttc(termA[2], b);
	if (iz(ttcResult) && lt([termA[0], termA[1], []], [b, [], []])) {
		return [];
	}
	return [termA[0], termA[1], ttcResult];
}

function exp(a: Term): Term {
	if (lt(a, [[], [ONE, [], []], []])) {
		return [[], a, []];
	}
	const termA = a as [Term, Term, Term];
	const p = s(termA[1], [suc(termA[0]), [], []])[0];
	return [termA[0], add(p, sub(a, [termA[0], p, []])), []];
}

function log(a: Term): Term {
	if (iz(a)) return [];
	const termA = a as [Term, Term, Term];
	const [p, q] = s(termA[1], [suc(termA[0]), [], []]);
	
	if (iz(termA[0]) && iz(p)) {
		if (!lt(termA[1], [[], [ONE, [], []], []])) {
			const logQ = log(q);
			if (eq(logQ, q) && iz(q[2]) && lt(termA[1], [ONE, [], []])) {
				return [termA[0], termA[1], []];
			}
		}
		return q;
	}
	
	const m = add([termA[0], p, []], q);
	if (!lt(termA[1], [termA[0], [suc(termA[0]), [], []], []])) {
		const logA1 = log(termA[1]);
		if (eq(logA1, termA[1]) && iz(termA[2]) && lt(termA[1], [suc(termA[0]), [], []])) {
			return [termA[0], termA[1], []];
		}
	}
	return m;
}

function P(M: Matrix, r: number, n: number): number {
	if (r === -1) return n - 1;
	let q = P(M, r - 1, n);
	while (q > -1 && M[q][r] >= M[n][r]) {
		q = P(M, r - 1, q);
	}
	return q;
}

function C(M: Matrix, n: number): number[] {
	const X: number[] = [];
	for (let i = 0; i < M.length; i++) {
		if (P(M, 0, i) === n) {
			X.push(i);
		}
	}
	return X;
}

function D(M: Matrix, n: number): number {
	let X = 0;
	for (let i = 0; i < M.length; i++) {
		if (P(M, 0, i) === n && M[i][1] > 0) {
			X++;
		}
	}
	return X;
}

function U(M: Matrix, n: number): number {
	if (M[n][1] === 0 || M[n][2] === 1 || n + 1 === M.length) {
		return -1;
	}
	const m = P(M, 1, n);
	const L: MatrixRow = [M[m][0] + 1, M[n][1], M[m][2] + 1];
	if (P(M, 1, n) === P(M, 1, n + 1) && 
		M[n + 1][0] === L[0] && 
		M[n + 1][1] === L[1] && 
		M[n + 1][2] === L[2]) {
		return n + 1;
	}
	let q = n;
	while (q !== -1) {
		q = P(M, 0, q);
		if (q >= 0 && 
			P(M, 1, n) === P(M, 1, q) && 
			M[q][0] === L[0] && 
			M[q][1] === L[1] && 
			M[q][2] === L[2] && 
			M[n + 1][0] > M[q][0]) {
			return q;
		}
	}
	return -1;
}

function v(M: Matrix, n: number): Term {
	if (M[n][1] === 0) {
		return [];
	}
	if (M[n][2] === 0) {
		const u = U(M, n) >= 0 ? l(v(M, U(M, n))) : ONE;
		return add(v(M, P(M, 1, n)), u);
	}
	let p: Term = ONE;
	for (const i of C(M, n)) {
		if (!(M[i][0] === M[n][0] + 1 && M[i][1] === M[n][1] && M[i][2] === 1)) {
			continue;
		}
		let q: Term = [];
		for (const j of C(M, i)) {
			q = add(q, o(M, j));
		}
		p = add(p, exp(q));
	}
	return add(v(M, P(M, 1, n)), exp(p));
}

function o(M: Matrix, n: number): Term {
	let S: Term = [];
	const u: number[] = [...Array(M.length).keys()].map(x => U(M, x));
	for (const i of C(M, n)) {
		if (M[i][0] === M[n][0] + 1 && M[i][1] === M[n][1] && M[i][2] === 1) {
			continue;
		}
		if (u.includes(i)) {
			const c = C(M, i);
			if (c.length > 0) {
				const last = c[c.length - 1];
				if (M[last][0] === M[i][0] + 1 && 
					M[last][1] === M[i][1] && 
					M[last][2] === 1) {
					continue;
				}
			} else {
				continue;
			}
		}
		S = add(S, o(M, i));
	}
	return [v(M, n), S, []];
}

function _o(M: Matrix): Term {
	let S: Term = [];
	for (let i = 0; i < M.length; i++) {
		if (M[i][0] === 0 && M[i][1] === 0 && M[i][2] === 0) {
			S = add(S, o(M, i));
		}
	}
	return sf(S);
}

function NS(M: Matrix): Term {
	let S: Term = [];
	for (let i = 0; i < M.length; i++) {
		if (M[i][0] === 0 && M[i][1] === 0 && M[i][2] === 0) {
			S = add(S, o(M, i));
		}
	}
	return S;
}

function sp(a: Term, b: Term, c: Term): Term {
	if (iz(c)) {
		return [a, b, []];
	}
	const termC = c as [Term, Term, Term];
	if (lt(b, termC[1]) && gt(c, [a, [], []])) {
		const t = ttc(termC[1], suc(termC[0]));
		console.log(t);
		return sp(a, add(t, sub([termC[0], termC[1], []], [termC[0], t, []])), termC[2]);
	}
	return sp(a, add(b, [termC[0], termC[1], []]), termC[2]);
}

function sf(a: Term): Term {
	if (iz(a)) return [];
	const termA = a as [Term, Term, Term];
	return add(sp(sf(termA[0]), [], sf(termA[1])), sf(termA[2]));
}

function toString(q: Term | number, maxLength = 40): string {
  if (maxLength <= 0) return "..."
	if (typeof q === 'number') return q.toString();
	if (iz(q)) return '0';
	
	const termQ = q as [Term, Term, Term];
	if (iz(termQ[0]) && iz(termQ[1])) {
		return (Number(toString(termQ[2])) + 1).toString();
	}
	
	const [a, b] = s(q, [termQ[0], termQ[1], []]);
	const termA = a as [Term, Term, Term];
	
	let m = `ψ<sub>${toString(termA[0], --maxLength)}</sub>(${toString(termA[1], --maxLength)})`;
	if (iz(termA[1])) m = `Ω<sub>${toString(termA[0], --maxLength)}</sub>`;
	if (iz(termA[1]) && eq(termA[0], ONE)) m = `Ω`;
	if (iz(termA[0])) m = `ψ(${toString(termA[1], --maxLength)})`;
	
	if (eq(termA[0], []) && eq(termA[1], ONE)) {
		m = 'ω';
	} else if (!eq(log([termA[0], termA[1], []]), [termA[0], termA[1], []])) {
		m = `ω<sup>${toString(log(a), --maxLength)}</sup>`;
	}
	
	function getCoef(x: Term): number {
		if (iz(x)) return 0;
		const termX = x as [Term, Term, Term];
		if (iz(termX[2])) return 1;
		return getCoef(termX[2]) + 1;
	}
	
	const coef = getCoef(a);
	if (coef > 1) {
		m += coef.toString();
	}
	
	if (!iz(b)) {
		m += `+${toString(b, --maxLength)}`;
	}
	return m;
}

// prettier-ignore
const EBO = [
  [0, 0, 0],
  [1, 1, 1],
  [2, 1, 1],
  [3, 1, 0],
  [2, 0, 0],
]

export function calculate(BMS: string): string {
	const cleanBMS = BMS.replace(/\s+/g, '');
	
	if (cleanBMS == "") return "0";
	
	const matrix = JSON.parse('['+cleanBMS.replaceAll(')(','],[').replaceAll('(','[').replaceAll(')',']')+']')
	  .map(x=>{let y=x.slice();while(y.length<3){y.push(0)}return y;});
	
	for (const col of matrix) {
	  if (col.length >= 4) return ">ψ(a(ω;0))"
	}

	for (let i in EBO) {
	  if (matrix[1][2] < 1) break;
    const currentColumn = matrix[i] ?? [];
    
    if (iz(currentColumn)) break;
    
    const maxCol = EBO[i];
    
    if (i == "4") {
      if (currentColumn[0] >= 2) return ">ψ(ψ<sub>I</sub>(0))"
      break;
    }
    
    for (let j in maxCol) {
      if (currentColumn[j] < maxCol[j]) break;
      if (currentColumn[j] == maxCol[j]) continue;
      if (currentColumn[j] > maxCol[j]) return ">ψ(ψ<sub>I</sub>(0))"
    }
  }
	
	try {
		const result = _o(matrix);
		return toString(result);
	} catch (error) {
		throw error
	}
}