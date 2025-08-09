import Decimal from "break_eternity.js"
import { player } from "../save"
import { diff } from "../game-loop";
import { Upgrade } from "../upgrade";
import type { buyables } from "../mechanic";
import { Buyable } from "../buyable";
import { Currencies } from "../currencies";
import { Ordinal } from "@/lib/ordinal";
import { feature } from "../global";

export const ORDINAL_BOOSTER = {
    buyables: {
        '51A': new class extends Buyable<Decimal> {
            description = '加速器倍率增加速度+0.01';
			cost(x: Decimal): Decimal {
				return new Ordinal('w^w')
					.toDecimal(feature.Ordinal.base().toNumber())
					.mul(x.pow_base(new Ordinal('w^2').toDecimal(feature.Ordinal.base().toNumber())));
			}
			ordinal = true;
			name = 'B41-A';
			effect(x: Decimal): Decimal {
				return x.mul(0.01);
			}
			effectDescription(x: Decimal) {
				return '+' + this.effect(x);
			}
			currency: Currencies = Currencies.ORDINAL;
			canBuyMax(): boolean {
				return false;
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
                return x.div(new Ordinal('w^w')
					.toDecimal(feature.Ordinal.base().toNumber()))
                    .max(1)
                    .log(new Ordinal('w^2').toDecimal(feature.Ordinal.base().toNumber()))
			}
        },
        '52A': new class extends Buyable<Decimal> {
            description = '加速器最大倍率×2';
			cost(x: Decimal): Decimal {
				return new Ordinal('w^(w*2)')
					.toDecimal(feature.Ordinal.base().toNumber())
					.pow(x.pow_base(2));
			}
			ordinal = true;
			name = 'B42-A';
			effect(x: Decimal): Decimal {
				return x.pow_base(2)
			}
			effectDescription(x: Decimal) {
				return '×' + this.effect(x);
			}
			currency: Currencies = Currencies.ORDINAL;
			canBuyMax(): boolean {
				return false;
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
                return x
                    .max(1).log(new Ordinal('w^(w*2)')
                    .toDecimal(feature.Ordinal.base().toNumber()))
                    .max(1)
                    .log2()
			}
        },
        '53A': new class extends Buyable<Decimal> {
            description = '加速器效果^+0.05';
			cost(x: Decimal): Decimal {
				return new Ordinal('w^(w*2)')
					.toDecimal(feature.Ordinal.base().toNumber())
					.pow(x.pow_base(2));
			}
			ordinal = true;
			name = 'B43-A';
			effect(x: Decimal): Decimal {
				return x.mul(0.05)
			}
			effectDescription(x: Decimal) {
				return '+' + this.effect(x);
			}
			currency: Currencies = Currencies.ORDINAL;
			canBuyMax(): boolean {
				return false;
			}
			autoBuyMax(): boolean {
				return false;
			}
			costInverse(x: Decimal): Decimal {
                return x
                    .max(1).log(new Ordinal('w^(w*2)')
                    .toDecimal(feature.Ordinal.base().toNumber()))
                    .max(1)
                    .log2()
			}
        },
    } as const,
    boosterLoop() {
        if (player.upgrades[59]) {
            player.ordinal.booster.mult = player.ordinal.booster.mult
            .add(ORDINAL_BOOSTER.boosterGrow().mul(diff/1000))
            .min(ORDINAL_BOOSTER.boosterCap());

        }
    },
    boosterExponent() {
        let exp = new Decimal(1);
        exp = exp.add(ORDINAL_BOOSTER.buyables['53A'].effect(player.buyables['53A']));

        return exp;
    },
    boosterGrow() {
        let grow = new Decimal(0.1);
        grow = grow.add(ORDINAL_BOOSTER.buyables['51A'].effect(player.buyables['51A']));
        return grow;
    },
    boosterCap() {
        let cap = new Decimal(100);
        cap = cap.mul(ORDINAL_BOOSTER.buyables['52A'].effect(player.buyables['52A']));

        return cap;
    },
    boosterEffect() {
        let eff = player.ordinal.booster.mult;
        eff = eff.pow(this.boosterExponent());
        return eff;
    }
}