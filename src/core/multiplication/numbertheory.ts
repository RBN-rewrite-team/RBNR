import {eulerFunction} from "@/utils/algorithm";
import {UPGRADES} from "../mechanic"
import {player} from "../save";

export const NUMTHEORY = {
  initMechanics() {
    /*UPGRADES.create('31R', {
      
    })*/
  },
  funcS(x: number = player.numbertheory.euler.x.floor().toNumber()) {
    let res = 0;
    for (let k = 1; k<=x+0.04; k++){
      res+=eulerFunction(k);
    }
    return res;
  }
}
