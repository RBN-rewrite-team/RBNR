import Decimal from "break_eternity.js"
import {UPGRADES} from "../mechanic"
import {player} from "../save";
type onetwofive = 1|2|3|4|5;
type onetwofour = 1|2|3|4;
export type qolUpgs = `${4}${onetwofour}${onetwofive}q` | '400q'


export const QolUpgrades = {
  initMechanics() {
    UPGRADES.create('400q', {
      displayName: "4-QOL-00",
      description: "U2-1的效果*2",
      canAfford() { return !!(player.firstResetBit & 0b100) },
      currency: "生活质量点",
      cost: new Decimal(0),
      buy() {},
      requirement: [],
      show() {return true}

    })
  }
}
