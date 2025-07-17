import { player } from './save';
import { Successor } from './successor/successor.ts';
import { upgrades, buyables, UPGRADES, BUYABLES } from './mechanic.ts';
import { Addition } from './addition/addition.ts';
import { Multiplication } from './multiplication/multiplication.ts';
import { PrimeFactor } from './multiplication/pf.ts';

const feature = {
  mechanic: { UPGRADES: UPGRADES, BUYABLES: BUYABLES },
  upgrades: upgrades,
  buyables: buyables,
  SUCCESSOR: Successor,
  ADDITION: Addition,
  MULTIPLICATION: Multiplication,
  PrimeFactor: PrimeFactor,
};

export { player, feature };

export function getNumberGen() {
  return feature.SUCCESSOR.successorBulk().mul(feature.SUCCESSOR.autoSuccessPerSecond());
}
