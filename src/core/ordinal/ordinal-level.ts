import { feature, player } from '../global.ts';
import { Ordinal } from '@/lib/ordinal/';
import { OrdinalUtils } from '@/utils/ordinal';

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
  if (player.upgrades[61]) return getBMSOrdinalLevel()
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

export function getBMSOLReq(i:number) {
  if (i < 44) return OrdinalUtils.numberToLaTeXOrdinal(
									new Ordinal(ordinalNormal?.[i]?.[0]).toDecimal(
										feature.Ordinal.base(),
									),
									feature.Ordinal.base(),
								)
  if (i == 44) return "\\varepsilon_0"
  return BMSReq[i-45] ?? "\\textit{way too large}"
}

const BMSReq = [
  "\\varepsilon_0\\cdotω",
] as const

function getBMSOrdinalLevel() {
  let num = player.hydra.deduceOrdinal[0];
  let level = 0;
  if (num.lt(16)) {
  if (num.gte(4)) level++
  if (num.gte(5)) level+=7
  if (num.gte(6)) level+=5
  if (num.gte(7)) level+=4
  if (num.gte(8)) level+=10
  if (num.gte(9)) level+=5
  if (num.gte(10)) level+=3
  if (num.gte(11)) level+=9
  if (num.gte(13)) level++
  }
  level = 45
  if (num.gte(17)) level++
  return level
}