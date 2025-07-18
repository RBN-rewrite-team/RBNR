import {eulerFunction} from "@/utils/algorithm";
import {BUYABLES, UPGRADES} from "../mechanic"
import {player} from "../save";
import {formatWhole} from "@/utils/format";
import Decimal from "break_eternity.js";

export const NUMTHEORY = {
  initMechanics() {
    BUYABLES.create('31R', {
      description: "x每秒增加1",
      cost(x) {
        return x.pow_base(2).mul(10);
      },
      effect(x) { return x},
      effD(x){return `+${formatWhole(x)}/s`},
      canAfford(x) {return this.cost(x).lte(player.multiplication.mulpower)},
      buy(x) {
        
				player.multiplication.mulpower = player.multiplication.mulpower.sub(this.cost(x));
      },
      capped(){ return false},
      currency: "乘法能量",
      show(){return true;},
      requirement: [],
    })
    BUYABLES.create('32R', {
      description: "x值增速×+1",
      cost(x) {
        return x.pow_base(10).mul(100);
      },
      effect(x) { return x.add(1)},
      effD(x){return `×+${formatWhole(x)}`},
      canAfford(x) {return this.cost(x).lte(player.multiplication.mulpower)},
      buy(x) {
        
				player.multiplication.mulpower = player.multiplication.mulpower.sub(this.cost(x));
      },
      capped(){ return false},
      currency: "乘法能量",
      show(){return true;},
      requirement: [],
    })
  },
  funcS(x = player.numbertheory.euler.x.floor()) {
    if (x.gte(300)) {return x.pow(2).mul(3/Math.PI**2)}
    let res = 0;
    for (let k = 1; k<=x.toNumber(); k++){
      res+=eulerFunction(k);
    }
    return Decimal.fromNumber(res);
  },
  varXgain() {
    let x = new Decimal(0);
    if (player.buyables["31R"].gte(1)) x = x.add(player.buyables["31R"])
    if (player.buyables["32R"].gte(1)) x = x.mul(player.buyables["32R"].add(1))
    return x;
  }
}
