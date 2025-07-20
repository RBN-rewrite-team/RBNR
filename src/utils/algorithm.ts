/**
 * 计算两个数的最大公约数
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 两个数字的最大公约数
 */
export function gcd(x: number, y: number): number {
	if (x < y) [x, y] = [y, x];
	const cacheKey = `${x},${y}`;

	// 检查缓存
	if (gcdCache.has(cacheKey)) {
		return gcdCache.get(cacheKey)!;
	}
	let originalX = x;
	let originalY = y;
	// 使用欧几里得算法
	while (y !== 0) {
		const temp = y;
		y = x % y;
		x = temp;
	}
	return x;
}
const gcdCache = new Map<string, number>(); //K = xxx,xxx

/**
 * 判断两个数是否互质（最大公约数为1）
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 如果两个数互质则返回true，否则返回false
 */
export function isCoprime(a: number, b: number): boolean {
	// 处理边界情况：如果两个数中有1，则一定互质
	if (a === 1 || b === 1) {
		return true;
	}

	// 处理0的情况：0和任何数都不互质（除了1）
	if (a === 0 || b === 0) {
		return false;
	}

	// 计算最大公约数
	const greatestCommonDivisor = gcd(Math.abs(a), Math.abs(b));

	return greatestCommonDivisor === 1;
}
/*
// 测试示例
console.log(isCoprime(8, 15));  // true (互质)
console.log(isCoprime(12, 18)); // false (公约数为6)
console.log(isCoprime(1, 7));   // true
console.log(isCoprime(0, 5));    // false
console.log(isCoprime(-4, 9));   // true (负数也可以互质)
*/

/**
 * 计算1到a中与a互质的数的个数
 * @returns 互质的数的个数
 */
export function eulerFunction(a: number) {
	let c = 0;
	for (let i = 1; i <= a; i++) {
		c += isCoprime(a, i) ? 1 : 0;
	}
	return c;
}
