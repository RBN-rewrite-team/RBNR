import Decimal from "break_eternity.js"
import { buyables, BUYABLES, MILESTONES } from "../mechanic"
import { player } from "../save"
import { format, formatWhole } from "@/utils/format"
import { diff } from "../game-loop";
import { Buyable } from "../buyable";
import { Currencies } from "../currencies";
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
    buyables: {
        'lgr_emp': new class extends Buyable<Decimal> {
            name="B-LG-EMP"
            description: string="雇佣一名天文学家";
            currency: Currencies = Currencies.EXPONENTION_POWER;
            cost(x: Decimal): Decimal {
                let base = new Decimal(10);
                if (player.milestones.log_law3)base = base.sub(Logarithm.logarithm.calculate_datas.max(1).log10().pow(0.7).min(4))
                return Decimal.pow(base, Decimal.pow(x, 2).sub(Logarithm.logarithm.calculate_datas.max(1).log10().pow(0.7).min(4)))
            }
            postBuy(): void {
                const life = Logarithm.astronomerLife();
                Logarithm.astronomers.push({
                    life: life[0],
                    boost: life[1],
                })
            }
            capped(): boolean {
                return player.buyables.lgr_emp.gte(50);
            }
            effectDescription(x: Decimal) {
                return `+${format(this.effect(x))}`
            }
            effect(x:Decimal) {
                return x;
            }
        },
        'lgr_impr': new class extends Buyable<Decimal> {
            name="B-LG-EMP"
            description: string="雇佣一名天文学家";
            currency: Currencies = Currencies.EXPONENTION_POWER;
            cost(x: Decimal): Decimal {
                let base = new Decimal(10);
                if (player.milestones.log_law3) base = base.sub(Logarithm.logarithm.calculate_datas.max(1).log10().pow(0.7).min(4))
                return Decimal.pow(10, Decimal.pow(x, x).sub(Logarithm.logarithm.calculate_datas.max(1).log10().pow(0.7).min(4)))
            }
            effectDescription(x: Decimal) {
                return `×${format(this.effect(x))}`
            }
            effect(x:Decimal) {
                if (x.eq(0)) return new Decimal(1);
                return x.root(10).pow_base(x).div(10).add(1);
            }
        },
    } as const,
    initMechanics() {
        MILESTONES.create("log_law1", {
            displayName: "M-LAW-1",
            get description(){
                return "Actually, this milestone is hidden, you shouldn't see it"
            } ,
            requirement: new Decimal(2000),
            get canDone() {
                return Logarithm.logarithm.calculate_datas.gte(this.requirement)
            },
            show: true,
            currency: "麦粒"
        })
        MILESTONES.create("log_law2", {
            displayName: "M-LAW-2",
            get description(){
                return "Actually, this milestone is hidden, you shouldn't see it"
            } ,
            requirement: new Decimal(40000),
            get canDone() {
                return Logarithm.logarithm.calculate_datas.gte(this.requirement)
            },
            show: true,
            currency: "麦粒"
        })
        MILESTONES.create("log_law3", {
            displayName: "M-LAW-3",
            get description(){
                return "Actually, this milestone is hidden, you shouldn't see it"
            } ,
            requirement: new Decimal(1000000),
            get canDone() {
                return Logarithm.logarithm.calculate_datas.gte(this.requirement)
            },
            show: true,
            currency: "麦粒"
        })
        MILESTONES.create("log_G", {
            displayName: "M-LAW-G",
            get description(){
                return "Actually, this milestone is hidden, you shouldn't see it"
            } ,
            requirement: new Decimal(10000000),
            get canDone() {
                return Logarithm.logarithm.calculate_datas.gte(this.requirement)
            },
            show: true,
            currency: "麦粒"
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
        ).mul(buyables.lgr_impr.effect(player.buyables.lgr_impr))
        .mul(player.milestones.log_law1 ? 10 : 1)
        .mul(player.milestones.log_law1 ? 5 : 1);
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
        let convertgain = new Decimal(5);
        convertgain = convertgain.mul(player.milestones.log_law1 ? 10 : 1);
        this.logarithm.calculate_datas = this.logarithm.calculate_datas.add(convertgain)
    }
}