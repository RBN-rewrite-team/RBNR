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
      canAfford() { return Boolean(player.firstResetBit & 0b100) },
      currency: "生活质量点",
      cost: new Decimal(0),
      buy() {},
      requirement: [],
      show() {return true}
    })
    UPGRADES.create('411q', {
      displayName: "4-QOL-11",
      description: "保持后继升级和U2-2。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [],
      show() {return true}
    })
    UPGRADES.create('412q', {
      displayName: "4-QOL-12",
      description: "B0-1的数量不会少于1个。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [],
      show() {return true}
    })
    UPGRADES.create('413q', {
      displayName: "4-QOL-13",
      description: "指数不重置挑战1的奖励。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [],
      show() {return true}
    })
    UPGRADES.create('414q', {
      displayName: "4-QOL-14",
      description: "指数不重置U2-R1-1。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [],
      show() {return true}
    })
    UPGRADES.create('415q', {
      displayName: "4-QOL-15",
      description: "自动购买质因数2、3、5、7。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [],
      show() {return true}
    })
    
  }
}
