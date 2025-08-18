import { feature, player } from '../global.ts';
import { Ordinal } from '@/lib/ordinal/';
import { OrdinalUtils } from '@/utils/ordinal';
import Decimal from 'break_eternity.js';

export const ordinalNormal = [
	['w', 0],
	['w+1', 1],
	['w+2', 2],
	['w+3', 3],
	['w*2', 2],
	['w*2+1', 2],
	['w*3', 3],
	['w*4', 4],
	['w^2', 2],
	['w^2+w', 2],
	['w^2+w*2', 2],
	['w^2*2', 2],
	['w^2*3', 3],
	['w^3', 3],
	['w^3*2', 3],
	['w^4', 4],
	['w^5', 5],
	['w^(w)', 2],
	['w^(w+1)', 2],
	['w^(w+2)', 2],
	['w^(w+3)', 3],
	['w^(w*2)', 3],
	['w^(w*2+1)', 3],
	['w^(w*2+2)', 3],
	['w^(w*3)', 3],
	['w^(w*3+1)', 3],
	['w^(w*4)', 4],
	['w^(w^2)', 2],
	['w^(w^2+w)', 2],
	['w^(w^2+w*2)', 2],
	['w^(w^2*2)', 2],
	['w^(w^2*3)', 3],
	['w^(w^3)', 3],
	['w^(w^3*2)', 3],
	['w^(w^3*3)', 3],
	['w^(w^w)', 3],
	['w^(w^w+1)', 4],
	['w^(w^w+2)', 4],
	['w^(w^w*2)', 4],
	['w^(w^(w+1))', 4],
	['w^(w^(w+2))', 4],
	['w^(w^(w*2))', 4],
	['w^(w^(w*3))', 4],
	['w^(w^(w^2))', 4],
	['e_0', 0],
] as const;

export function getOrdinalLevel(): number {
	if (player.upgrades[61]) return getBMSOrdinalLevel();
	let level = 0;
	let base = feature.Ordinal.base();
	for (let i in ordinalNormal) {
		if (
			base.toNumber() > ordinalNormal[i][1] ||
			new Ordinal(ordinalNormal[i][0]).toDecimal(base).lte(player.ordinal.number)
		)
			level++;
	}
	return level;
}

export function getBMSOLReq(i: number) {
	if (i < 44)
		return OrdinalUtils.numberToLaTeXOrdinal(
			new Ordinal(ordinalNormal?.[i]?.[0]).toDecimal(feature.Ordinal.base()),
			feature.Ordinal.base(),
		);
	if (i == 44) return '\\varepsilon_0';
	return BMSReq[i - 45] ?? '\\textit{way too large}';
}

const BMSReq = [
	'\\varepsilon_1',
	'\\varepsilon_2',
	'\\varepsilon_\\omega',
	'\\varepsilon_{\\omega^2}',
	'\\varepsilon_{\\omega^3}',
	'\\varepsilon_{\\omega^\\omega}',
	'\\varepsilon_{\\omega^{\\omega^\\omega}}',
	'\\varepsilon_{\\varepsilon_0}',
	'\\varepsilon_{\\varepsilon_1}',
	'\\varepsilon_{\\varepsilon_\\omega}',
	'\\varepsilon_{\\varepsilon_{\\varepsilon_0}}',
	'\\zeta_0',
	'\\eta_0',
	'\\phi(4,0)',
	'\\phi(ω,0)',
	'\\phi(ω^2,0)',
	'\\phi(ε_0,0)',
	'\\phi(\\phi(ω,0),0)',
	'\\psi(Ω_2) = \\psi(1@(1,,0)) = \\text{BHO}',
	'\\psi(Ω_2+ψ(Ω_2+Ω))',
	'\\psi(Ω_2\\cdotω)',
	'\\psi(Ω_2\\cdotψ(Ω))',
	'\\psi(Ω_2\\cdotψ(Ω^2))',
	'\\psi(Ω_2\\cdotψ(Ω_2))',
	'\\psi(Ω_2\\cdotΩ)',
	'\\psi(\\Omega_2\\psi_{\\Omega_2}(\\Omega_2))',
	'\\psi(Ω_2\\cdotψ_1(Ω_2))',
	'\\psi(Ω_2^2)',
	'\\psi(Ω_2^Ω)',
	'\\psi(Ω_2^{Ω_2})',
	'\\psi(Ω_3)',
	'\\psi(Ω_3\\cdot\\Omega_2)',
	'\\psi(Ω_3^2)',
	'\\psi(Ω_3^{Ω_2})',
	'\\psi(Ω_3^{Ω_3})',
	'\\psi(Ω_ω)',
] as const;

function getBMSOrdinalLevel() {
	let num = player.hydra.deduceOrdinal[0];
	let level = 0;
	if (num.lt(16)) {
		if (num.gte(4)) level++;
		if (num.gte(5)) level += 7;
		if (num.gte(6)) level += 5;
		if (num.gte(7)) level += 4;
		if (num.gte(8)) level += 10;
		if (num.gte(9)) level += 5;
		if (num.gte(10)) level += 3;
		if (num.gte(11)) level += 9;
		if (num.gte(13)) level++;
	}
	level = 45;
	if (num.gte(17)) level++;
	if (num.gte(18)) level++;
	if (num.gte(19)) level++;
	if (num.gte(20)) level++;
	if (num.gte(21)) level++;
	if (num.gte(22)) level++;
	if (num.gte(25)) level++;
	if (num.gte(34)) level++;
	if (num.gte(35)) level++;
	if (num.gte(37)) level++;
	if (num.gte(52)) level++;
	if (num.gte(64)) level++;
	if (num.gte(65)) level++;
	if (num.gte(66)) level++;
	if (num.gte(67)) level++;
	if (num.gte(68)) level++;
	if (num.gte(82)) level++;
	if (num.gte(133)) level++;
	if (num.gte(256)) level++;
	if (num.gte(257)) level++;
	if (num.gte(259)) level++;
	if (num.gte(274)) level++;
	if (num.gte(322)) level++;
	if (num.gte(514)) level++;
	if (num.gte(1024)) level++;
	if (num.gte(65536)) level++;
	if (num.gte(262144)) level++;
	if (num.gte(4 ** 16)) level++;
	if (num.gte(4 ** 17)) level++;
	if (num.gte(4 ** 64)) level++;
	if (num.gte(4 ** 256)) level++;
	if (num.gte(new Decimal(4).pow(4 ** 5))) level++;
	if (num.gte(new Decimal(4).pow(4 ** 16))) level++;
	if (num.gte(new Decimal(4).pow(4 ** 17))) level++;
	if (num.gte(new Decimal(4).pow(4 ** 64))) level++;
	if (num.gte(new Decimal(4).pow(4 ** 256))) level++;
	return level;
}
