import Decimal from "break_eternity.js"
import { buyables, BUYABLES } from "../mechanic"
import { player } from "../save"
import { format, formatWhole } from "@/utils/format"

export const Logarithm = {
    initMechanics() {
        BUYABLES.create("lgr_emp", {
            displayName: "B-LG-EMP",
            description: "雇佣一名天文学家",
            currency: "指数能量",
            cost(x) {
                return Decimal.pow(10, Decimal.pow(x, 2))
            },
            canAfford(x) {
                return player.exponention.exppower.gte(this.cost(x));
            },
            buy(x){
                player.exponention.exppower = player.exponention.exppower.sub(this.cost(x));
            },
            requirement: [],
            show(){ return true },
            capped() {
                return player.buyables.lgr_emp.gte(50);
            },
            effD(x) {
                return `+${format(this.effect(x))}`
            },
            effect(x) {
                return x;
            },
        })
        BUYABLES.create("lgr_impr", {
            displayName: "B-LG-IMPR",
            description: "改进对数表，提升天文学家的寿命和运算速度",
            currency: "指数能量",
            cost(x) {
                return Decimal.pow(10, Decimal.pow(x, x))
            },
            canAfford(x) {
                return player.exponention.exppower.gte(this.cost(x));
            },
            buy(x){
                player.exponention.exppower = player.exponention.exppower.sub(this.cost(x));
            },
            requirement: [],
            show(){ return true },
            capped() {
                return false
            },
            effD(x) {
                return `×${format(this.effect(x))}`
            },
            effect(x) {
                if (x.eq(0)) return new Decimal(1);
                return x.root(10).pow_base(x).div(10).add(1);
            },
        })
    }
}