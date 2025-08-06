import { feature, player } from '../global.ts';
export function getOrdinalLevel() {
  let base = feature.Ordinal.base();
  let ord = player.ordinal.number
  let level = 0;
  if (ord.gte(base)) level++
  if (ord.gte(base.mul(2))) level++
  if (ord.gte(base.mul(3))) level++
  if (ord.gte(base.pow(2))) level++
  if (ord.gte(base.pow(3))) level++
  if (ord.gte(base.pow(4))) level++
  if (ord.gte(base.pow(base))) level++
  if (ord.gte(base.pow(base.add(1)))) level++
  if (ord.gte(base.pow(base.add(2)))) level++
  if (ord.gte(base.pow(base.add(3)))) level++
  if (ord.gte(base.pow(base.mul(2)))) level++
  return level
}

export const ordinalDatas = [
  "\\omega",
  "\\omega\\cdot2",
  "\\omega\\cdot3",
  "\\omega^2",
  "\\omega^3",
  "\\omega^4",
  "\\omega^\\omega",
  "\\omega^{\\omega+1}",
  "\\omega^{\\omega+2}",
  "\\omega^{\\omega+3}",
  "\\omega^{\\omega\\cdot2}",
]