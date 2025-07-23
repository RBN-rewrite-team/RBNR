import Decimal from "break_eternity.js"
import {UPGRADES} from "../mechanic"
type onetwofive = 1|2|3|4|5
export type qolUpgs = `${4}${onetwofive}${onetwofive}q` | '400q'


export const QolUpgrades = {
  initMechanics() {
    UPGRADES.create('400q', {
      displayName: "4-QOL-00",
      description: "666",
      canAfford() { return false },
      currency: "e",
      cost: new Decimal(0),
      buy() {},
      requirement: [],
      show() {return true}

    })
  }
}
