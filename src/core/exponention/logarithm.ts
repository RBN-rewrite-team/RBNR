import Decimal from "break_eternity.js"
import { buyables, BUYABLES } from "../mechanic"
import { player } from "../save"
import { format, formatWhole } from "@/utils/format"
import { diff } from "../game-loop";
export interface IAstronomer {
    life: number;
    boost: Decimal;
}
export const Logarithm = {
    get logarithm() {
        return player.exponention.logarithm
    },
    get astronomers() {
        return this.logarithm.astronomers;
    },
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
                const life = Logarithm.astronomerLife();
                Logarithm.astronomers.push({
                    life: life[0],
                    boost: life[1],
                })
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
    },
    astronomerLife(): [number, Decimal]{
        let life = new Decimal(100);
        let boost = new Decimal(1); //计算生命溢出的
        let eff = buyables.lgr_impr.effect(player.buyables.lgr_impr)
        life = life.mul(eff);


        let temp_life = life.add(1).sub(1);
        if (life.gt(137e8)) {
            life = new Decimal(137e8)
            boost = boost.mul(temp_life.div(137e8));
        }
        return [life.toNumber()-40, boost]
    },
    astronomerProduce(i: number) {
        return new Decimal(25).mul(
            Decimal.pow(new Decimal(1.5).mul(this.astronomers[i].boost), i)
        ).mul(buyables.lgr_impr.effect(player.buyables.lgr_impr));
    },
    astronomerUpdate() {
        for (let i = 0; i<this.astronomers.length; i++){
            this.astronomers[i].life = this.astronomers[i].life - diff/1000;
            let actualtime = diff/1000;
            if (this.astronomers[i].life<0) {
                actualtime = this.astronomers[i].life+actualtime;
            } 
            this.logarithm.calculate_datas = this.logarithm.calculate_datas
            .add(this.astronomerProduce(i).mul(actualtime))
            if (this.astronomers[i].life<=0) {
                this.astronomers.splice(i, 1);
                i--;
                player.buyables.lgr_emp = player.buyables.lgr_emp.sub(1)
            }
        }
    },
    observe() {
        this.logarithm.observe_datas = this.logarithm.observe_datas.add(1)
    },
    observeConvert() {
        if (this.logarithm.observe_datas.lte(0)) return;
        this.logarithm.observe_datas = this.logarithm.observe_datas.sub(1)
        this.logarithm.calculate_datas = this.logarithm.calculate_datas.add(5)
    }
}