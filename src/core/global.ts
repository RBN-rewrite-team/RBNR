import { player } from './save';
import { successor } from './successor/successor.ts';
import { upgrades, buyables, UPGRADES, BUYABLES } from './mechanic.ts';
import {Addition} from './addition/addition.ts';

const feature = {
  mechanic: { UPGRADES: UPGRADES, BUYABLES: BUYABLES },
  upgrades: upgrades,
  buyables: buyables,
  successor: successor,
  ADDITION: Addition
};

export { player, feature };

export function getPointGen() {
  return feature.successor.successorBulk().mul(feature.successor.autosuccessorPerSecond())
}
