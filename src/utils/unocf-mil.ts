import { DC } from '@/core/constants';
import type Decimal from 'break_eternity.js';

export const UNOCF_milestone = [
	[DC.D_0, 'ω'],
	[DC.D_4, 'Ω'],
	[DC.D_5, 'Ω_\\omega'],
	[DC.D_6, '\\psi_I(I)'],
	[DC.D_7, '\\psi_I(I_I)'],
	[DC.D_8, 'I'],
	[DC.D_9, 'I_\\omega'],
	[DC.D_10, 'I_I'],
	[DC.D_11, 'Ω(1,0)'],
	[DC.D_12, 'Ω(1,0,0)'],
	[DC.D_13, 'ψ_M(M^{M^{\\omega}})'],
	[DC.D_14, 'ψ_M(M^{M^{M}})'],
	[DC.D_15, 'ψ_M(\\Omega_{M+1})'],
	[DC.D_16, 'M'],
	[DC.D_32, 'N'],
	[DC.D_64, 'K'],
	[DC.D_128, 'C(ω;0;0)'],
	[DC.D_256, 'ψ_T(2\\space\\mathrm{aft}\\space T)'],
	[DC.D_1024, 'ψ_T(1-2\\space\\mathrm{aft}\\space T)'],
	[DC.D_4096, 'ψ_T(2\\space1-2\\space\\mathrm{aft}\\space T)'],
	[DC.D_16384, 'ψ_T(2\\space\\mathrm{aft}\\space\\mathrm{2nd}\\space T)'],
	[DC.D_32768, 'ψ_T(T(1,0))'],
	[DC.D_65536, 'T'],
	[DC.D_98304, 'T_\\omega'],
	[DC.D_2P17, 'T\\space1-T'],
	[DC.D_2P18, '2-T'],
	[DC.D_2P20, 'T\\space2-T'],
	[DC.D_2P24, 'ψ_X(2\\space\\mathrm{aft}\\space X)'],
	[DC.D_2P28, 'ψ_X(1-2\\space\\mathrm{aft}\\space X)'],
	[DC.D_2P32, 'ψ_X(2\\space1-2\\space\\mathrm{aft}\\space X)'],
	[DC.D_2P40, 'ψ_X(T\\space\\mathrm{aft}\\space X)'],
	[DC.D_2P48, 'ψ_X(2\\space\\mathrm{aft}\\space\\mathrm{2nd}\\space X)'],
	[DC.D_2P64, 'X'],
	[DC.D_2P68, 'X\\space1-X'],
	[DC.D_2P72, '2-X'],
	[DC.D_2P80, 'X\\space2-X'],
	[DC.D_2P96, 'ψ_Y(2\\space\\mathrm{aft}\\space Y)'],
	[DC.D_2P112, 'ψ_Y(1-2\\space\\mathrm{aft}\\space Y)'],
	[DC.D_2P128, 'ψ_Y(2\\space1-2\\space\\mathrm{aft}\\space Y)'],
	[DC.D_2P160, 'ψ_Y(T\\space\\mathrm{aft}\\space Y)'],
	[DC.D_2P176, 'ψ_Y(X\\space\\mathrm{aft}\\space Y)'],
	[DC.D_2P192, 'ψ_Y(2\\space\\mathrm{aft}\\space\\mathrm{2nd}\\space Y)'],
	[DC.D_2P256, 'C(1\\{ω\\}0)'],
	[DC.D_2P256_A_2P255, 'C(1\\{\\Omega\\}0)'],
	[DC.D_2P262, 'C(1\\{1,0\\}0)'],
	[DC.D_2P263, 'C(1\\{1;0\\}0)'],
	[DC.D_2P264, 'C(1\\{1;;0\\}0)'],
	[DC.D_2P265, 'C(1\\{1;;;0\\}0)'],
	[DC.D_2P266, 'C(1\\{1\\{\\omega\\}0\\}0)'],
	[DC.D_2P267, 'C(1\\{1\\{1\\{\\omega\\}0\\}0\\}0)'],
	[DC.D_2P268, 'C(1:0)'],
	[DC.D_2P288, 'C(1::0)'],
	[DC.D_2P320, 'C(1{:\\omega}0)'],
	[DC.D_2P352, 'C(1:_20)'],
	[DC.D_2P1024, 'C(1[1:0]0)'],
	[DC.D_2P2048, 'C(1[[1:0]]0)'],
	[DC.D_INFINITY, '\\omega_1'],
] as const;
export const UNOCF = {
	getCurMilestoneIndex(p: Decimal) {
		let a = UNOCF_milestone.findIndex((a, i) => {
			return (
				(i == UNOCF_milestone.length - 1 || p.lt(UNOCF_milestone[i + 1][0])) && p.gte(a[0])
			);
		});
		return a;
	},
	getUNOCFMilestone(a: number) {
		let t = UNOCF_milestone[a];
		if (!t) return '0';
		return t;
	},
} as const;
