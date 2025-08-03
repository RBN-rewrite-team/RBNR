import Decimal from 'break_eternity.js';
import { player } from '@/core/global.ts';
export function singularityExponent() {
  let t = player.singularity.t / 1000
  return Math.min(0.5 + t, 1.15)
}

export function singularityDivision() {
  return 100
}

export function getSingularityEnergy() {
  let t = player.singularity.t
  if (t >= converage_point()) return Infinity
  let a = singularityExponent()
  let b = singularityDivision()
  if (a == 1) return Math.E ** (t / b) - 1
  return (1 + t * (1 - a) / b) ** (1 / (1 - a)) - 1
}

export function converage_point() {
  let a = singularityExponent()
  if (a <= 1) return Infinity
  return singularityDivision() / (a - 1)
}

export function getSingularityEffect() {
  return new Decimal(2).tetrate(getSingularityEnergy())
}