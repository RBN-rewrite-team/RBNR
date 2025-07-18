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
        return x.pow_base(1000);
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
  },
  funcS(x: number = player.numbertheory.euler.x.floor().toNumber()) {
    if (x>=1000) {return 3/Math.PI**2 * x**2}
    let res = 0;
    for (let k = 1; k<=x+0.04; k++){
      res+=eulerFunction(k);
    }
    return res;
  },
  varXgain() {
    let x = new Decimal(0);
    if (player.buyables["31R"].gte(1)) x = x.add(player.buyables["31R"])
    return x;
  }
}
