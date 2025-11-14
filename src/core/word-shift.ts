import { predictableRandom } from '@/utils/algorithm';

function randomSymbol(cn = true): string {
	if (cn == true) {
		const lowerBoundBasic = 0x4e00; // 基本区起始
		const upperBoundBasic = 0x9fa5; // 基本区结束
		const lowerBoundExtendedA = 0x3400; // 扩展A区起始
		const upperBoundExtendedA = 0x4dbf; // 扩展A区结束

		if (Math.random() < 0.5) {
			return String.fromCodePoint(
				Math.floor(Math.random() * (upperBoundBasic - lowerBoundBasic + 1)) +
					lowerBoundBasic,
			);
		} else {
			return String.fromCodePoint(
				Math.floor(Math.random() * (upperBoundExtendedA - lowerBoundExtendedA + 1)) +
					lowerBoundExtendedA,
			);
		}
	} else {
		return String.fromCodePoint(Math.floor(Math.random() * (0x7e - 0x41 + 1)) + 0x41);
	}
}

export const wordShift = {
	wordCycle(list: string[], noBuffer: boolean = false, nothing?: number): string {
		const len = list.length;
		const tick = Math.floor(Date.now() / 250) % (len * 5);
		const mod5 = ((Date.now() / 250) % (len * 5)) % 5;
		const largeTick = Math.floor(tick / 5);
		let v = list[largeTick];

		if (mod5 < 0.6) {
			v = this.blendWords(
				list[(largeTick + list.length - 1) % list.length],
				list[largeTick],
				(mod5 + 0.6) / 1.2,
			);
		} else if (mod5 > 4.4) {
			v = this.blendWords(
				list[largeTick],
				list[(largeTick + 1) % list.length],
				(mod5 - 4.4) / 1.2,
			);
		}

		v = this.randomCrossWords(v, 0.1 * Math.pow(mod5 - 2.5, 4) - 0.6);
		return v;
	},

	randomCrossWords(str: string, frac: number = 0.7, cn = true): string {
		if (frac <= 0) return str;
		const x = str.split('');
		for (let i = 0; i < x.length * frac; i++) {
			const randomIndex = Math.floor(
				predictableRandom((Math.floor(Date.now() / 500) % 964372) + 1.618 * i) * x.length,
			);
			x[randomIndex] = randomSymbol(cn);
		}
		return x.join('').replace(' ', '&nbsp;');
	},

	blendWords(first: string, second: string, param: number): string {
		if (param <= 0) return first;
		if (param >= 1) return second;
		return (
			first.substring(0, Math.floor(first.length * (1 - param))) +
			second.substring(Math.floor(second.length * (1 - param)))
		);
	},
};
