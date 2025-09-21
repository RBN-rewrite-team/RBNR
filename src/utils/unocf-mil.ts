import { DC } from '@/core/constants';
import type Decimal from 'break_eternity.js';

const UNOCF_milestone = [
	[DC.D_4, 'Ω'],
	[DC.D_8, 'I'],
	[DC.D_16, 'M'],
	[DC.D_32, 'N'],
	[DC.D_64, 'K'],
	[DC.D_128, 'C(ω;0;0)'],
	[DC.D_256, 'ψ_T(2 aft T)'],
	[DC.D_1024, 'ψ_T(1-2 aft T)'],
	[DC.D_4096, 'ψ_T(2 1-2 aft T)'],
	[DC.D_16384, 'ψ_T(2 aft 2nd T)'],
	[DC.D_65536, 'T'],
	[DC.D_2P17, 'T 1-T'],
	[DC.D_2P18, '2-T'],
	[DC.D_2P20, 'T 2-T'],
	[DC.D_2P24, 'ψ_X(2 aft X)'],
	[DC.D_2P28, 'ψ_X(1-2 aft X)'],
	[DC.D_2P32, 'ψ_X(2 1-2 aft X)'],
	[DC.D_2P40, 'ψ_X(T aft X)'],
	[DC.D_2P48, 'ψ_X(2 aft 2nd X)'],
	[DC.D_2P64, 'X'],
	[DC.D_2P68, 'X 1-X'],
	[DC.D_2P72, '2-X'],
	[DC.D_2P80, 'X 2-X'],
	[DC.D_2P96, 'ψ_Y(2 aft Y)'],
	[DC.D_2P112, 'ψ_Y(1-2 aft Y)'],
	[DC.D_2P128, 'ψ_Y(2 1-2 aft Y)'],
	[DC.D_2P160, 'ψ_Y(T aft Y)'],
	[DC.D_2P176, 'ψ_Y(X aft Y)'],
	[DC.D_2P192, 'ψ_Y(2 aft 2nd Y)'],
	[DC.D_2P256, 'C(1{ω}0)'],
] as const;
export const UNOCF = {
	getCurMilestoneIndex(p: Decimal) {
		let a = UNOCF_milestone.findIndex(
			(a, i) =>
				a[0].gte(p) &&
				(i == UNOCF_milestone.length - 1 || a[0].lt(UNOCF_milestone[i + 1][0])),
		);
		return a;
	},
} as const;
