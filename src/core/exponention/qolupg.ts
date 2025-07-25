import Decimal from "break_eternity.js"
import {UPGRADES, type singleReq} from "../mechanic"
import {player} from "../save";
import {format, formatWhole} from '@/utils/format';
type onetwofive = 1|2|3|4|5;
type onetwofour = 1|2|3|4;
export type qolUpgs = `${4}${onetwofive}${onetwofive}q` | '400q'


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
    UPGRADES.create('421q', {
      displayName: "4-QOL-21",
      description: "保持加法升级。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-11", () => player.upgrades['411q']] as singleReq
      ],
      show() {return true}
    })
    UPGRADES.create('422q', {
      displayName: "4-QOL-22",
      description: "B0-1的数量不会少于10个。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-12", () => player.upgrades['412q']] as singleReq
      ],
      show() {return true}
    })
    UPGRADES.create('423q', {
      displayName: "4-QOL-23",
      description: "指数不重置挑战2的奖励。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-13", () => player.upgrades['413q']] as singleReq
      ],
      show() {return true}
    })
    UPGRADES.create('424q', {
      displayName: "4-QOL-24",
      description: "指数不重置B2-R1-1。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-14", () => player.upgrades['414q']] as singleReq
      ],
      show() {return true}
    })
    UPGRADES.create('425q', {
      displayName: "4-QOL-25",
      description: "自动购买质因数11、13、17、19",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-15", () => player.upgrades['415q']] as singleReq
      ],
      show() {return true}
    })
    UPGRADES.create('431q', {
      displayName: "4-QOL-31",
      description: "指数不重置U2-3和U2-4。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-21", () => player.upgrades['421q']] as singleReq
      ],
      show: QolUpgrades.row1AllUnlocked
    })
    UPGRADES.create('432q', {
      displayName: "4-QOL-32",
      description: "B1-1的增幅立即生效，无需加法重置。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-22", () => player.upgrades['422q']] as singleReq
      ],
      show: QolUpgrades.row1AllUnlocked
    })
    UPGRADES.create('433q', {
      displayName: "4-QOL-33",
      description: "指数不重置挑战3的奖励。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-23", () => player.upgrades['423q']] as singleReq
      ],
      show: QolUpgrades.row1AllUnlocked
    })
    UPGRADES.create('434q', {
      displayName: "4-QOL-34",
      description: "指数不重置B2-R1-2。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-24", () => player.upgrades['424q']] as singleReq
      ],
      show: QolUpgrades.row1AllUnlocked
    })
    UPGRADES.create('435q', {
      displayName: "4-QOL-35",
      description: "乘法不重置质因数时间。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-25", () => player.upgrades['425q']] as singleReq
      ],
      show: QolUpgrades.row1AllUnlocked
    })
    UPGRADES.create('441q', {
      displayName: "4-QOL-41",
      description: "每秒自动获得100%重置时可获得的加法能量。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-31", () => player.upgrades['431q']] as singleReq
      ],
      show: QolUpgrades.row2AllUnlocked
    })
    UPGRADES.create('442q', {
      displayName: "4-QOL-42",
      description: "B0-1的数量保持在100个。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-32", () => player.upgrades['432q']] as singleReq
      ],
      show: QolUpgrades.row2AllUnlocked
    })
    UPGRADES.create('443q', {
      displayName: "4-QOL-43",
      description: "挑战4纪录不低于本指数内累计乘法能量^" + format(new Decimal(0.001)) + "。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-33", () => player.upgrades['433q']] as singleReq
      ],
      show: QolUpgrades.row2AllUnlocked
    })
    UPGRADES.create('444q', {
      displayName: "4-QOL-44",
      description: "自动化数论研究1的购买项。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-34", () => player.upgrades['434q']] as singleReq
      ],
      show: QolUpgrades.row2AllUnlocked
    })
    UPGRADES.create('445q', {
      displayName: "4-QOL-45",
      description: "指数不重置质因数时间。",
      canAfford() { return player.exponention.qolpoints.gte(1)},
      currency: "生活质量点",
      cost: new Decimal(1),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-35", () => player.upgrades['435q']] as singleReq
      ],
      show: QolUpgrades.row2AllUnlocked
    })
    UPGRADES.create('451q', {
      displayName: "4-QOL-51",
      description: "保持乘法升级。",
      canAfford() { return player.exponention.qolpoints.gte(5)},
      currency: "生活质量点",
      cost: new Decimal(5),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-41", () => player.upgrades['441q']] as singleReq
      ],
      show: QolUpgrades.row3AllUnlocked
    })
    UPGRADES.create('452q', {
      displayName: "4-QOL-52",
      description: "自动化B2-1和B2-2。",
      canAfford() { return player.exponention.qolpoints.gte(5)},
      currency: "生活质量点",
      cost: new Decimal(5),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-42", () => player.upgrades['442q']] as singleReq
      ],
      show: QolUpgrades.row3AllUnlocked
    })
    UPGRADES.create('453q', {
      displayName: "4-QOL-53",
      description: "前3个挑战的纪录保持为本次指数的最高数值。",
      canAfford() { return player.exponention.qolpoints.gte(5)},
      currency: "生活质量点",
      cost: new Decimal(5),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-43", () => player.upgrades['443q']] as singleReq
      ],
      show: QolUpgrades.row3AllUnlocked
    })
    UPGRADES.create('454q', {
      displayName: "4-QOL-54",
      description: "保持数论研究1的升级。",
      canAfford() { return player.exponention.qolpoints.gte(5)},
      currency: "生活质量点",
      cost: new Decimal(5),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-44", () => player.upgrades['444q']] as singleReq
      ],
      show: QolUpgrades.row3AllUnlocked
    })
    UPGRADES.create('455q', {
      displayName: "4-QOL-55",
      description: "B2-3的数量保持在99个。",
      canAfford() { return player.exponention.qolpoints.gte(5)},
      currency: "生活质量点",
      cost: new Decimal(5),
      buy() {player.exponention.qolpoints = player.exponention.qolpoints.sub(this.cost)},
      requirement: [
        ["购买4-QOL-45", () => player.upgrades['445q']] as singleReq
      ],
      show: QolUpgrades.row3AllUnlocked
    })
  },
  row1AllUnlocked() {
    return player.upgrades['411q'] && player.upgrades['412q'] && player.upgrades['413q'] && player.upgrades['414q'] && player.upgrades['415q'] 
  },
  row2AllUnlocked() {
	return player.upgrades['421q'] && player.upgrades['422q'] && player.upgrades['423q'] && player.upgrades['424q'] && player.upgrades['425q'] 
  },
  row3AllUnlocked() {
	return player.upgrades['431q'] && player.upgrades['432q'] && player.upgrades['433q'] && player.upgrades['434q'] && player.upgrades['435q'] 
  },
}
