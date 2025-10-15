/**
 * 一个Term
 * 用[a,b,c]表示序数ψ_a(b)+c(使用BOCF)
 * 类似单项链表
 */
type Term = [] | [Term, Term, Term];
type MatrixRow = [number, number, number];
type Matrix = MatrixRow[];

/**
 * 0
 */
const ZERO: Term = [];
/**
 * ψ_0(0)+0 = 1+0=1
 */
const ONE: Term = [[], [], []];
/**
 * ψ_0(1)+0 = ω+0=ω
 */
const OMEGA: Term = [[], ONE, []];
/**
 * ψ_1(0)+0 = Ω_1
 */
const OMEGA1: Term = [ONE, [], []];
/**
 * ψ_0(Ω)+0 = ε_0
 */
const EPSILON0: Term = [[], OMEGA1, []];

/*
BMS analyzer by Solarzone
由 FiveYearGaoKao 进行批注和修改

修改内容:
1.为提高可读性，对部分变量和函数名进行了修改
2.添加了一些辅助函数

程序介绍:
此程序分为两部分：序数表示和BMS分析
存储序数的结构类似单向链表
程序用[a,b,c]表示序数ψ_a(b)+c(使用BOCF)
BMS分析的部分暂时没有看懂
*/

/**
 * 判断一个序数是否为0
 */
function isZero(a: Term | number): a is [] {
	return Array.isArray(a) && a.length === 0;
}

/**
 * 判断一个序数是否有限
 */
function isOrdinalFinite(a: Term): boolean {
	return isZero(a) || (isZero(a[0]) && isZero(a[1]));
}

/**
 * 求一个序数由多少个单项相加而成
 */
function length1(a: Term): number {
	return isZero(a) ? 0 : 1 + length1(a[2]);
}

/**
 * 判断两个序数是否全等
 * 甚至也可以判断两个矩阵列是否全等
 */
function eq(a: Term | number, b: Term | number): boolean {
	if (typeof a === 'number' && typeof b === 'number') {
		return a === b;
	}
	if (isZero(a) || isZero(b)) {
		return isZero(a) === isZero(b);
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		return eq(a[0], b[0]) && eq(a[1], b[1]) && eq(a[2], b[2]);
	}
	return false;
}

/**
 * 判断是否a<b
 */
function lt(a: Term | number, b: Term | number): boolean {
	if (isZero(b)) return false;
	if (isZero(a)) return true;
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

/**
 * 判断是否a>b
 */
function gt(a: Term | number, b: Term | number): boolean {
	return !(lt(a, b) || eq(a, b));
}

/**
 * ω^a1+ω^a2+...+ω^an的首项ω^a1
 *
 * 相当于把加法部分换成0
 *
 * 1的首项ω^0,则返回1
 *
 * OMEGA [0, 1, 0]的首项为ω^1，则返回[0,1,0]
 */
function firstTerm(a: Term): Term {
	if (isZero(a)) {
		return [];
	}
	return [a[0], a[1], []];
}

/**
 * ω^a1+ω^a2+...+ω^an的末项ω^an
 */
function lastTerm(a: Term): Term {
	if (isZero(a)) {
		return [];
	}
	if (isZero(a[2])) {
		return a;
	}
	return lastTerm(a[2]);
}

/**
 * 序数相加
 */
function add(a: Term, b: Term): Term {
	if (isZero(a)) return b;
	if (isZero(b)) return a;
	const termA = a as [Term, Term, Term];
	const termB = b as [Term, Term, Term];

	// 如果ω最大指数a<最大指数b的话，返回b(a+b=b)
	if (lt(firstTerm(a), firstTerm(b))) {
		return b;
	}

	// 往加法部分进行加法，遇到0会停止
	return [termA[0], termA[1], add(termA[2], b)];
}

/**
 * 序数后继
 */
function succ(a: Term): Term {
	return add(a, ONE);
}

/**
 * 序数左减，即a-b为满足b+c=a的序数c(若不存在为0)
 */
function sub(a: Term, b: Term): Term {
	if (isZero(a)) return [];
	if (isZero(b)) return a;
	const termA = a as [Term, Term, Term];
	const termB = b as [Term, Term, Term];
	if (gt(firstTerm(a), firstTerm(b))) {
		return a;
	}
	return sub(termA[2], termB[2]);
}

/**
 * 将a分为大于b和小于b两段
 */
function separate(a: Term, b: Term): [Term, Term] {
	if (isZero(a)) return [[], []];
	const termA = a as [Term, Term, Term];
	if (lt(firstTerm(a), b)) {
		return [[], a];
	}
	const sResult = separate(termA[2], b);
	return [[termA[0], termA[1], sResult[0]], sResult[1]];
}

/**
 * 找末项，和lastTerm一样
 */
function lastTerm3(a: Term): Term {
	if (isZero(a)) return [];
	const termA = a as [Term, Term, Term];
	if (isZero(termA[2])) return a;
	return lastTerm3(termA[2]);
}

/**
 * 对小于ψ_b(0)的部分进行截断
 */
function truncate(a: Term, b: Term): Term {
	if (isZero(a)) return [];
	const termA = a as [Term, Term, Term];
	const truncateResult = truncate(termA[2], b);
	/**
	 * truncateResult = 0 &&  termA without add < ψ_b(0)
	 */
	if (isZero(truncateResult) && lt([termA[0], termA[1], []], [b, [], []])) {
		return [];
	}
	return [termA[0], termA[1], truncateResult];
}

/**
 * 序数ω^a，自动化为标准式
 * 设a=ψb(p+d)+e,其中b的每一项都大于等于ψb+1(0)
 * 则该函数返回的是ψb(p+{a-ψb(p)})
 * 注意到当d<ψb+1(0)时,ψb(c+d)=ψb(c)*ω^d
 * 分情况讨论：
 * 1.若d=e=0，则ψb(p)=ψb(...+ψb+1(0))是一个ε点，取指数后不变
 * 2.若d=0,e>0，函数返回ψb(p+e)=ψb(p)*ω^e=ω^(ψb(p)+e)
 * 3.若d>0，函数返回ψb(p+a)=ψb(p)*ω^a=ω^(ψb(p)+a)=ω^a
 */
function exp(a: Term): Term {
	if (lt(a, EPSILON0)) {
		return [[], a, []];
	}
	const termA = a as [Term, Term, Term];
	const p = separate(termA[1], [succ(termA[0]), [], []])[0];
	return [termA[0], add(p, sub(a, [termA[0], p, []])), []];
}

function log(a: Term): Term {
	if (isZero(a)) return [];
	const termA = a as [Term, Term, Term];
	const [p, q] = separate(termA[1], [succ(termA[0]), [], []]);

	if (isZero(termA[0]) && isZero(p)) {
		if (!lt(termA[1], [[], [ONE, [], []], []])) {
			const logQ = log(q);
			if (eq(logQ, q) && isZero(q[2]!) && lt(termA[1], [ONE, [], []])) {
				return [termA[0], termA[1], []];
			}
		}
		return q;
	}

	const m = add([termA[0], p, []], q);
	if (!lt(termA[1], [termA[0], [succ(termA[0]), [], []], []])) {
		const logA1 = log(termA[1]);
		if (eq(logA1, termA[1]) && isZero(termA[2]) && lt(termA[1], [succ(termA[0]), [], []])) {
			return [termA[0], termA[1], []];
		}
	}
	return m;
}

/**
 * 找BMS的父项用的
 *
 * 在第0(row)行中，查找相对于第3(n)列（值3）具有更小值的最近前驱列
 * 如矩阵[ [ 0, 0, 0 ], [ 1, 1, 1 ], [ 2, 2, 2 ] ]
 */
function findMatrixParentTerm(matrix: Matrix, findRow: number, relativeColumn: number): number {
	if (findRow === -1) return relativeColumn - 1;
	let curColumn = findMatrixParentTerm(matrix, findRow - 1, relativeColumn);
	while (curColumn > -1 && matrix[curColumn][findRow] >= matrix[relativeColumn][findRow]) {
		curColumn = findMatrixParentTerm(matrix, findRow - 1, curColumn);
	}
	return curColumn;
}

/**
 * 有哪些项的坏根是column
 */
function countChildColumnsForColumn(matrix: Matrix, column: number): number[] {
	const X: number[] = [];
	for (let i = 0; i < matrix.length; i++) {
		if (findMatrixParentTerm(matrix, 0, i) === column) {
			X.push(i);
		}
	}
	return X;
}

function maybeCheckOmega_omegaLikeFunction(matrix: Matrix, column: number): number {
	/**第2项是0的matrix， 第3项是1的matrix， 和后面没了的matrix为-1（找后面的？ */
	if (matrix[column][1] === 0 || matrix[column][2] === 1 || column + 1 === matrix.length) {
		return -1;
	}
	const parentTerm = findMatrixParentTerm(matrix, 1, column);
	/**
	 * 找column父项，为[x+1, 当前列psi_x数, z+1]， 可能是找Ω_ω特殊情况
	 */
	const maybeCheckOmega_omega: MatrixRow = [
		matrix[parentTerm][0] + 1,
		matrix[column][1],
		matrix[parentTerm][2] + 1,
	];
	if (
		findMatrixParentTerm(matrix, 1, column) === findMatrixParentTerm(matrix, 1, column + 1) &&
		matrix[column + 1][0] === maybeCheckOmega_omega[0] &&
		matrix[column + 1][1] === maybeCheckOmega_omega[1] &&
		matrix[column + 1][2] === maybeCheckOmega_omega[2]
	) {
		return column + 1;
	}
	let q = column;
	while (q !== -1) {
		q = findMatrixParentTerm(matrix, 0, q);
		if (
			q >= 0 &&
			findMatrixParentTerm(matrix, 1, column) === findMatrixParentTerm(matrix, 1, q) &&
			matrix[q][0] === maybeCheckOmega_omega[0] &&
			matrix[q][1] === maybeCheckOmega_omega[1] &&
			matrix[q][2] === maybeCheckOmega_omega[2] &&
			matrix[column + 1][0] > matrix[q][0]
		) {
			return q;
		}
	}
	return -1;
}

function matrix_xthAdm(matrix: Matrix, index: number): Term {
	// 对于[1,0]，为ω系序数，返回0
	if (matrix[index][1] === 0) {
		return [];
	}
	// 对于[x,y,0]
	if (matrix[index][2] === 0) {
		// 可能是前有Ω_ω列，需要检查,比如说[0,0,0][1,1,1][2,1][3,2]
		// 通常检查BO以下BMS u默认为1
		const u =
			maybeCheckOmega_omegaLikeFunction(matrix, index) >= 0
				? lastTerm3(matrix_xthAdm(matrix, maybeCheckOmega_omegaLikeFunction(matrix, index)))
				: ONE;
		return add(matrix_xthAdm(matrix, findMatrixParentTerm(matrix, 1, index)), u);
	}
	let omega_power_x_counter: Term = ONE;
	for (const i of countChildColumnsForColumn(matrix, index)) {
		if (
			!(
				matrix[i][0] === matrix[index][0] + 1 &&
				matrix[i][1] === matrix[index][1] &&
				matrix[i][2] === 1
			)
		) {
			continue;
		}
		let q: Term = [];
		for (const j of countChildColumnsForColumn(matrix, i)) {
			q = add(q, convertMatrixToTerm(matrix, j));
		}
		omega_power_x_counter = add(omega_power_x_counter, exp(q));
	}
	return add(
		matrix_xthAdm(matrix, findMatrixParentTerm(matrix, 1, index)),
		exp(omega_power_x_counter),
	);
}

/**主要的矩阵转换成序数的函数 */
function convertMatrixToTerm(matrix: Matrix, index: number): Term {
	let psiInner: Term = [];
	const maybeOmega_omega_columns: number[] = [...Array(matrix.length).keys()].map((x) =>
		maybeCheckOmega_omegaLikeFunction(matrix, x),
	);
	/**如果没有找到此列的坏根，就说明遇到(0)(1) index=1或者(0)(1)(2)(1), index=2这个情况 */
	for (const i of countChildColumnsForColumn(matrix, index)) {
		if (
			matrix[i][0] === matrix[index][0] + 1 &&
			matrix[i][1] === matrix[index][1] &&
			matrix[i][2] === 1
		) {
			continue;
		}
		if (maybeOmega_omega_columns.includes(i)) {
			const c = countChildColumnsForColumn(matrix, i);
			if (c.length > 0) {
				const last = c[c.length - 1];
				if (
					matrix[last][0] === matrix[i][0] + 1 &&
					matrix[last][1] === matrix[i][1] &&
					matrix[last][2] === 1
				) {
					continue;
				}
			} else {
				continue;
			}
		}
		//对psiInner内的序数进行递归处理，
		psiInner = add(psiInner, convertMatrixToTerm(matrix, i));
	}
	return [matrix_xthAdm(matrix, index), psiInner, []];
}

/**
 * 把一个矩阵转换成Term形式
 */
function matrixToTerm(matrix: Matrix): Term {
	let ordinal_term: Term = [];
	for (let index = 0; index < matrix.length; index++) {
		/**把整个矩阵分成(0,0,0)xxxx(0,0,0)xxx */
		if (matrix[index][0] === 0 && matrix[index][1] === 0 && matrix[index][2] === 0) {
			ordinal_term = add(ordinal_term, convertMatrixToTerm(matrix, index));
		}
	}
	return toStandardize(ordinal_term);
}

function toStandardize2(a: Term, b: Term, c: Term): Term {
	if (isZero(c)) {
		return [a, b, []];
	}
	const termC = c as [Term, Term, Term];
	if (lt(b, termC[1]) && gt(c, [a, [], []])) {
		const t = truncate(termC[1], succ(termC[0]));
		return toStandardize2(
			a,
			add(t, sub([termC[0], termC[1], []], [termC[0], t, []])),
			termC[2],
		);
	}
	return toStandardize2(a, add(b, [termC[0], termC[1], []]), termC[2]);
}

function toStandardize(a: Term): Term {
	if (isZero(a)) return [];
	const termA = a as [Term, Term, Term];
	return add(
		toStandardize2(toStandardize(termA[0]), [], toStandardize(termA[1])),
		toStandardize(termA[2]),
	);
}

/**
 * 将ψa(x)(a>0)转化为Ω_a^b*c的形式
 */
function toStandardize3(a: Term): [Term, Term] {
	if (isZero(a)) {
		return [[], []];
	}
	if (isZero(a[0])) {
		return [log(a), []];
	}
	const [p, s] = separate(a[1], [succ(a[0]), [], []]);
	const [q, r] = separate(s, [a[0], [], []]);
	//令x=p+q+r,其中p每一项大于ψb+1(0),q每一项大于ψb(0)
	const second = exp(r);
	let first = add(ONE, p);
	let ptr = q;
	while (!isZero(ptr)) {
		((first = add(first, exp(sub(log(ptr), [a[0], [], []])))), (ptr = ptr[2]));
	}
	return [first, second];
}

/**
 * Ω_a的简写
 */
function omega(a: Term, maxLength = 40): string {
	if (isZero(a)) return 'ω';
	if (eq(a, ONE)) return 'Ω';
	return `Ω<sub>${termToString(a, --maxLength)}</sub>`;
}

function termToString(q: Term | number, maxLength = 40): string {
	if (maxLength <= 0) return '...';
	if (typeof q === 'number') return q.toString();
	if (isZero(q)) return '0';

	const termQ = q as [Term, Term, Term];
	// 判断是不是有限序数, 不是就-1取下一个
	if (isZero(termQ[0]) && isZero(termQ[1])) {
		return (Number(termToString(termQ[2])) + 1).toString();
	}

	/**
	 * a为第一个加数,b为剩下加的
	 */
	const [a, b] = separate(q, [termQ[0], termQ[1], []]);
	const termA = a as [Term, Term, Term];

	/**
	 * 简单的转换
	 */
	let m = `ψ<sub>${termToString(termA[0], --maxLength)}</sub>(${termToString(termA[1], --maxLength)})`;
	/**
	 * 对于ψ_a(0)，写成Ω_a
	 */
	if (isZero(termA[1])) m = `Ω<sub>${termToString(termA[0], --maxLength)}</sub>`;
	/**
	 * 对于ψ_1(0)，写成Ω
	 */
	if (isZero(termA[1]) && eq(termA[0], ONE)) m = `Ω`;
	/**
	 * 对于ψ_0(anything)，写成ψ(anything)
	 */
	if (isZero(termA[0])) m = `ψ(${termToString(termA[1], --maxLength)})`;

	/**
	 * 对于ψ_0(1),写成ω
	 */
	if (eq(termA[0], []) && eq(termA[1], ONE)) {
		m = 'ω';
		/**
		 * 对于ψ_α(x), x<ψ_α+1(0),写成Ω_x*ω^xxx的形式
		 */
	} else if (lt(termA[1], [succ(termA[0]), [], []])) {
		const [first, second] = toStandardize3(termA);
		m = omega(termA[0]);
		if (gt(first, ONE)) {
			m += `<sup>${termToString(first, --maxLength)}</sup>`;
		}
		if (gt(second, ONE)) m += termToString(second, --maxLength);
	}

	if (length1(a) > 1) {
		m += length1(a);
	}

	if (!isZero(b)) {
		m += `+${termToString(b, --maxLength)}`;
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
	if (BMS === '(0)(1<sup>ω</sup>)') return 'ψ(a(1;@(1;@(...))))';
	debugger;
	const cleanBMS = BMS.replace(/\s+/g, '');

	if (cleanBMS == '') return '0';

	/**
	 * BMS矩阵
	 * 转换成[[0,0,0],[x,x,x],[x,x,x]...]数组
	 */
	const matrix = JSON.parse(
		'[' + cleanBMS.replace(/\)\(/g, '],[').replace(/\(/g, '[').replace(/\)/g, ']') + ']',
	).map((x: number[]) => {
		const y = x.slice();
		while (y.length < 3) {
			y.push(0);
		}
		return y;
	});

	for (const row of matrix) {
		if (row.length >= 4) return '>ψ(a(ω;0))';
	}

	// 是否大于EBO
	for (const i in EBO) {
		if ((matrix[1]?.[2] ?? 0) < 1) break;
		const currentColumn = matrix[i] ?? [];

		if (isZero(currentColumn)) break;

		const maxCol = EBO[i];

		if (i == '4') {
			if (currentColumn[0] >= 2) return '>ψ(I)';
			break;
		}

		for (const j in maxCol) {
			if (currentColumn[j] < maxCol[j]) break;
			if (currentColumn[j] == maxCol[j]) continue;
			if (currentColumn[j] > maxCol[j]) return '>ψ(I)';
		}
	}

	try {
		const result = matrixToTerm(matrix);
		return termToString(result);
	} catch (error) {
		throw error;
	}
}
// window.calculate = calculate;
