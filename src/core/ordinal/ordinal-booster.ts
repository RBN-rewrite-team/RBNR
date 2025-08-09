import Decimal from "break_eternity.js"
import { player } from "../save"
import { diff } from "../game-loop";
import { Upgrade, UpgradeWithEffect } from "../upgrade";
import type { buyables } from "../mechanic";
import { Buyable } from "../buyable";
import { Currencies } from "../currencies";
import { Ordinal } from "@/lib/ordinal";
import { feature } from "../global";
import { format } from "@/utils/format";

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
	upgrades: {
		'51A': new (class U51A extends UpgradeWithEffect<Decimal> {
					description = '基于序数增加加速器上限和增长速度';
					cost: () => Decimal = function () {
						return new Ordinal('w^(w*5+4)').toDecimal(feature.Ordinal.base().toNumber());
					};
					ordinal = true;
					name = 'U51-A';
					effect(): Decimal {
						return player.ordinal.number.max(1).root(10).floor().div(50).clampMin(1);
					}
					effectDescription(): string {
						return '×' + format(this.effect()) + "";
					}
					currency: Currencies = Currencies.ORDINAL;
				})(),
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
		if (player.upgrades['51A'])
			grow = grow.mul(this.upgrades["51A"].effect())
        return grow;
    },
    boosterCap() {
        let cap = new Decimal(100);
        cap = cap.mul(ORDINAL_BOOSTER.buyables['52A'].effect(player.buyables['52A']));
		if (player.upgrades['51A'])
			cap = cap.mul(this.upgrades["51A"].effect())

        return cap;
    },
    boosterEffect() {
        let eff = player.ordinal.booster.mult;
        eff = eff.pow(this.boosterExponent());
        return eff;
    }
}