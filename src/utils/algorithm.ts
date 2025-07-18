/**
 * 计算两个数的最大公约数
 * @param a 第一个数字
 * @param b 第二个数字
 * @returns 两个数字的最大公约数
 */
export function gcd(x: number, y: number): number {
	// 使用欧几里得算法
	while (y !== 0) {
		const temp = y;
		y = x % y;
		x = temp;
	}
	return x;
}

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
