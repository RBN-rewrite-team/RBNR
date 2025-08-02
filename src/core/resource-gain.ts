import Decimal from "break_eternity.js";
import { feature } from "./global";
import { buyables, SOFTCAPS } from "./mechanic";
import { player } from "./save";
import { CHALLENGE } from "./challenge";
import { Logarithm } from "./exponention/logarithm";

export const resourceGain = {
    /**
     * 用于给用户界面展示用的函数
     * @returns value: 每秒获取数值, softcaps: 有多少个cap
     */
    number(num = player.number) {
        let base = feature.SUCCESSOR.successorBulk().pow(feature.SUCCESSOR.successorPow());
        base = base.mul(feature.SUCCESSOR.autoSuccessPerSecond());
		if (player.exponention.logarithm.in_dilate) {
			base = base.add(10).ln().ln().div(10)
		}
        if (player.buyables[31].gt(0) && Logarithm.logarithm.buyables_in_dilated.includes("31")) base = base.mul(buyables[31].effect(player.buyables[31]));
		
		if (player.exponention.logarithm.upgrades_in_dilated.includes("31")) {
			base = base.pow(3)
		}
        let softcaps = 0,
            scList = ['number^1', 'number^2', 'number^3', 'number^4', 'number^5', 'number^6', 'number^7', 'number^8', 'number^9'];
        for (let i = 0; i < scList.length; i++) {
            if (SOFTCAPS.reach(scList[i], player.number)) {
                softcaps++;
                base = SOFTCAPS.fluidComputed(scList[i], base, player.number);
            }
        }
        if (CHALLENGE.inChallenge(0, 2))
            base = SOFTCAPS.fluidComputed('number_C1', base, player.number);
        return { value: base, softcaps: softcaps };
    },
    addpower() {
        let base = feature.ADDITION.gain();
		if (player.exponention.logarithm.in_dilate) {
			base = base.add(Math.E).ln().ln().mul(10)
		}
        let softcaps = 0,
            scList = ['addpower^1', 'addpower^2', 'addpower^3', 'addpower^4', 'addpower^5'];
        for (let i = 0; i < scList.length; i++) {
            if (SOFTCAPS.reach(scList[i], player.addpower)) {
                softcaps++;
                base = SOFTCAPS.fluidComputed(scList[i], base, player.addpower);
            }
        }
        let passive = new Decimal(0);
        if (player.upgrades[38]) passive = passive.add(0.01);
        if (player.upgrades['441q'] && !player.exponention.logarithm.in_dilate) passive = passive.add(1);
        
        return { value: base, passive: passive, softcaps: softcaps };
    },
    mulpower() {
        let base = feature.MULTIPLICATION.gain();
        let passive = new Decimal(0);
        if (player.upgrades[46]) passive = passive.add(0.01);
        if (player.exponention.logarithm.in_dilate && !player.exponention.logarithm.upgrades_in_dilated.includes('26')) passive = new Decimal(0)
        let softcaps = 0,
            scList = ['mulpower^1','mulpower^2'];
        for (let i = 0; i < scList.length; i++) {
            if (SOFTCAPS.reach(scList[i], player.multiplication.mulpower)) {
                softcaps++;
                base = SOFTCAPS.fluidComputed(scList[i], base, player.multiplication.mulpower);
            }
        }
        return { value: base, passive, softcaps };
    },
    exppower() {
        let base = feature.EXPONENTION.gain();
        let passive = new Decimal(0);
        if (player.exponention.logarithm.upgrades_in_dilated.includes('38')) passive = passive.add(0.01);
        return { value: base, passive };
    },
}