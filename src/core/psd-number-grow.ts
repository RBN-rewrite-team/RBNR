import { format } from '@/utils/format';
import { player } from './global';
import { OrdinalUtils } from '@/utils/ordinal';
import Decimal from 'break_eternity.js';
// prettier-ignore
const lists = [
    '1.0000F600,000', 'F1.0000e6', 'F1.0000e9', 'F1.0000e15',
    'F1.000e30', 'F1.000e300', 'F1.000e3000',' Fe1.000e9',
    'F1.0000F6', 'F1.0000F9', 'FF1.0000e6',
    '1.0000G6', 'G1.0000G6', '1.0000H6',' 1.0000J6',
];
export function psdBMS(t: number) {
	// 645-655
	let a = t - 645; //0-10
	let psdslog = a * 0.5437989422008631; // 1/10*slog10(4^^6)
	return Decimal.tetrate(10, psdslog).add(4).floor();
}
export function numberGrow(t: number) {
	if (t >= 666 + 2 / 3) {
		return 'ω';
	}
	if (t < 630) {
		return format(player.number);
	}
	if (t < 645) return lists[Math.floor(t - 630)];

	if (t < 655) {
		return `f_${OrdinalUtils.numberToBMS(psdBMS(t), new Decimal(4), 10)}(10)`;
	}
	if (t < 656) {
		return `f_Y(1,3)(10)`;
	}
	if (t < 657) {
		return `f_Y(1,3,4,3)(10)`;
	}
	if (t < 657.5) {
		return `f_Y(1,3,5)(10)`;
	}
	if (t < 658) {
		return `f_Y(1,3,9)(10)`;
	}
	if (t < 658.5) {
		return `f_Y(1,4)(10)`;
	}
	if (t < 659) {
		return `f_ω-Y(1,3,10)(10)`;
	}
	if (t < 659.5) {
		return `f_ω-Y(1,4)(10)`;
	}
	if (t < 659.6) {
		return `f_ω-Y(1,ω)(10)`;
	}
	if (t < 660) {
		return `f_(ω2MN limit)(10)`;
	}
	if (t < 661) {
		return `f_(ω^2MN limit)(10)`;
	}
	if (t < 661.5) {
		return `f_(ω^ωMN limit)(10)`;
	}
	if (t < 661.5) {
		return `f_(ε_0MN limit)(10)`;
	}
	if (t < 661.75) {
		return `f_(ε_1MN limit)(10)`;
	}
	if (t < 662) {
		return `f_PTO(Z_ω)(10)`;
	}
	if (t < 663) {
		return `f_PTO(ZFC)(10)`;
	}
	if (t < 664) {
		return `f_PTO(ZFC+I0)(10)`;
	}
	if (t < 665) {
		return `f_ω_1^CK(D^5(99))`;
	}
	// if (t < 665.1) {
	// 	return `f_ω_2^CK(D^5(99))`;
	// }
	// if (t < 665.2) {
	// 	return `f_ω_ω^CK(D^5(99))`;
	// }
	// if (t < 665.3) {
	// 	return `f_ψ_I(I)(D^5(99))`;
	// }
	// if (t < 665.4) {
	// 	return `f_ψ_I(I_2)(D^5(99))`;
	// }
	// if (t < 665.4) {
	// 	return `f_I(D^5(99))`;
	// }
	// if (t < 665.5) {
	// 	return `f_(Π2ontoΠ2)(D^5(99))`;
	// }
	// if (t < 665.6) {
	// 	return `f_(Π1ontoΠ2ontoΠ2)(D^5(99))`;
	// }
	// if (t < 665.7) {
	// 	return `f_(Π2ontoΠ2ontoΠ2)(D^5(99))`;
	// }
	// if (t < 665.7) {
	// 	return `f_(K)(D^5(99))`;
	// }
	// if (t < 665.8) {
	// 	return `f_(Π4)(D^5(99))`;
	// }
	// if (t < 665.9) {
	// 	return `f_(Πω)(D^5(99))`;
	// }
	// if (t < 666) {
	// 	return `f_(ω-ply-Π0)(D^5(99))`;
	// }
	// if (t < 666.1) {
	// 	return `f_(ω-ply-Σ2-Π0)(D^5(99))`;
	// }
	// if (t < 666.2) {
	// 	return `f_(ω-ply-Σ3-Π0)(D^5(99))`;
	// }
	// if (t < 666.5) {
	// 	return `Rayo's number`;
	// }
	// if (t < 666.6) {
	// 	return 'Obvilion';
	// }
	// if (t < 666.666) {
	// 	return 'Utter Obvilion';
	// }
	// if (t < 666.6666666666666666666) {
	// 	return '...';
	// }
	return '???';
}
