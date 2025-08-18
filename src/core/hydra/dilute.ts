import Decimal from "break_eternity.js";
import { player } from "../save";
import { Hydra } from "./hydra";
import type { IntClosedRange } from "type-fest";
import { diff } from "../game-loop";

export type backupHydraType = {
    upgrades: ((`${IntClosedRange<61,69>}R`)|keyof typeof Hydra.upgrades)[];
    buyables: Partial<Record<"61R" | "62R" | "611" | "612" | "613" | "614", Decimal>>;
    prestiges: Decimal[];
}

export const Dilute = {
	enterDilute() {
        player.hydra.backupHydra = this.backupHydra();
        for (const id2 of ([['61R','62R','63R','64R','65R','66R','67R','68R'],Object.keys(Hydra.upgrades)] as const).flat()) {
            if (id2!=="61")
                player.upgrades[id2 as keyof typeof player.upgrades] = false;
        }
        for (const id2 of Object.keys(Hydra.buyables)) {
            const id = id2 as keyof typeof Hydra.buyables
            player.buyables[id] = new Decimal(0);
		}for (const id2 of ['61R','62R']) {
            const id = id2 as keyof typeof Hydra.buyables
            player.buyables[id] = new Decimal(0);
		}
        player.hydra.prestige = [new Decimal(0),new Decimal(0),new Decimal(0),new Decimal(0)]
        
        player.hydra.dilute.inDilute = true;
    },
    exitDilute() {
        if (player.hydra.backupHydra)
            this.restoreHydra(player.hydra.backupHydra)
        else {
            console.warn("Cannot found restore datas")
        }
        player.hydra.dilute.inDilute = false;
    },
	backupHydra(): backupHydraType {
		let items: ((`${IntClosedRange<61,69>}R`)|keyof typeof Hydra.upgrades)[] = [];
		for (const id2 of Object.keys(Hydra.upgrades)) {
            const id = id2 as keyof typeof Hydra.upgrades
            if (player.upgrades[id]) {
                items.push(id);
            }
		}
        for (const id2 of ['61','62','63','64','65','66','67','68','69'] as const) {
            const id = (id2+"R") as `${IntClosedRange<61,69>}R`
            if (player.upgrades[id]) {
                items.push(id);
            }
		}
		let items2: Partial<Record<'61R'|'62R'|keyof typeof Hydra.buyables, Decimal>> = {};
		for (const id2 of Object.keys(Hydra.buyables)) {
            const id = id2 as keyof typeof Hydra.buyables
            items2[id] = player.buyables[id];
		}for (const id2 of ['61R','62R']) {
            const id = id2 as keyof typeof Hydra.buyables
            items2[id] = player.buyables[id];
		}
        let prestiges = [
            player.hydra.prestige[0], 
            player.hydra.prestige[1], 
            player.hydra.prestige[2], 
            player.hydra.prestige[3]
        ]
        return {
            upgrades: items,
            buyables: items2,
            prestiges
        }
	},
    restoreHydra(item: backupHydraType) {
        for (const id of item.upgrades) {
            player.upgrades[id] = true; 
        }
        for (const id2 in item.buyables) {
            const id = id2 as keyof typeof item.buyables
            player.buyables[id] = item.buyables[id] ?? new Decimal(0);
        }
        player.hydra.prestige[0] = item.prestiges[0]
        player.hydra.prestige[1] = item.prestiges[1]
        player.hydra.prestige[2] = item.prestiges[2]
        player.hydra.prestige[3] = item.prestiges[3]
    },
    diluteButton() {
        if (player.hydra.dilute.inDilute) {
            this.exitDilute()
        } else {
            this.enterDilute()
        }
    },
    diluteLoop() {
        if (player.hydra.dilute.inDilute){
            player.hydra.dilute.spentTime = player.hydra.dilute.spentTime+diff
        }
    },
    diluteAmount(id: IntClosedRange<0,8>): number | boolean {
        if (!player.hydra.dilute.inDilute) return id < 6 ? 0 : false
        if (player.hydra.dilute.solvent[8]) {
            return id < 6 ? 10 : true
        };
        return player.hydra.dilute.solvent[id];
    }
};
