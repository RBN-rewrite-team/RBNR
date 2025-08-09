import Decimal from "break_eternity.js"
import { player } from "../save"
import { diff } from "../game-loop";
import { Upgrade } from "../upgrade";

export const ORDINAL_BOOSTER = {
    upgrades: {
        '51A': new class extends Upgrade {
            
        }
    } as const,
    boosterLoop() {
        if (player.upgrades[59]) {
            player.ordinal.booster.mult = player.ordinal.booster.mult
            .add(ORDINAL_BOOSTER.boosterGrow().mul(diff));

        }
    },
    boosterGrow() {
        let grow = new Decimal(0.1);
        return grow;
    },
    boosterCap() {
        let cap = new Decimal(100);

        return cap;
    },
    boosterEffect() {
        let eff = player.ordinal.booster.mult;

        return eff;
    }
}