import Decimal from "break_eternity.js";
import { player } from "../save";
import { Hydra } from "./hydra";
import type { IntClosedRange } from "type-fest";
import { diff } from "../game-loop";
import ModalService from "@/utils/Modal";

export type backupHydraType = {
    upgrades: ((`${IntClosedRange<61,69>}R`)|keyof typeof Hydra.upgrades)[];
    buyables: Partial<Record<"61R" | "62R" | "611" | "612" | "613" | "614", Decimal>>;
    prestiges: Decimal[];
}

export const Dilute = {
	enterDilute() {
        if(player.hydra.dilute.solvent.map((x)=>Number(x)).reduce((x,y)=>x+y)<1) return;
		let zero = new Decimal(0), one = new Decimal(1);
        player.hydra.backupHydra = this.backupHydra();
        for (const id2 of ([['61R','62R','63R','64R','65R','66R','67R','68R'],Object.keys(Hydra.upgrades)] as const).flat()) {
            if (id2!=="61")
                player.upgrades[id2 as keyof typeof player.upgrades] = false;
        }
        for (const id2 of Object.keys(Hydra.buyables)) {
            const id = id2 as keyof typeof Hydra.buyables
            player.buyables[id] = zero;
		}for (const id2 of ['61R','62R']) {
            const id = id2 as keyof typeof Hydra.buyables
            player.buyables[id] = zero;
		}
        player.hydra.prestige = [zero, zero, zero, zero];
        player.hydra.power = zero;
		player.hydra.deduceOrdinal = [zero, zero, zero, zero];
		player.hydra.deduceProgress = [zero, zero, zero, zero];
		player.hydra.powerMult = [one, one, one, one];
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
        if (!import.meta.env.DEV) {
            ModalService.show({
                title: "WIP!",
                content: "稀释功能正在开发中(WIP)，请等待游戏更新再尝试启用。"
            })
            return;
        }
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
    /**
     * 溶剂数量，在稀释未开启时会设置为falsy
     * @returns 
     */
    diluteAmount(id: number): number | boolean {
		if(id < 0 || id > 8) return false;
        if (!player.hydra.dilute.inDilute) return id < 6 ? 0 : false
        if (player.hydra.dilute.solvent[8]) {
            return id < 6 ? 10 : true
        };
        return player.hydra.dilute.solvent[id];
    },
    solutionGain() {
        let effectiveDilute = Array(9).fill(null).map((_, index) => this.diluteAmount(index))
        let base;
		let eb = effectiveDilute.slice(0, 6);
		for(let i in eb) if(typeof eb[i] == 'boolean') eb[i] = eb[i] ? 1 : 0;
		//@ts-ignore
		base = eb.reduce((total, num) => total + num, 0) ** 2;
        if (effectiveDilute[6]) base *= 2
        if (effectiveDilute[7]) base *= 3
        if (effectiveDilute[8]) base *= 10
        let deduceMult = player.hydra.deduceOrdinal[0].ln().min(4.99359204e304).toNumber();
        return deduceMult * base
    }
};

/**
 * TODO dilute list:
 * 溶剂I:时空黑洞(ok)
“虽然这很不幸，但至少你能用自己比别人活得久的事实来安慰自己。”
推演速度ok和乘数积累速度ok变为5^(-此溶剂等级)
溶剂II:阿兹海默症
“你变得越来越健忘......”
所有升级成本×5^此溶剂等级none
溶剂III:地球爆炸
“地球很快就要爆炸了，更糟的是你没有宇宙飞船......”
选择本溶剂的稀释会在(1000/稀释等级^2)秒内自我毁灭(即强行退出稀释)none
溶剂IV:数论地狱
“数学家的最新研究打开了地狱的大门......”
数论研究选项卡下的数论研究4变成反向数论研究4none，效果如下:
x_DOOM4=f(稀释中的秒数)^本溶剂等级
τ_DOOM4=g(x_4)
f(x)=g(x)=√x
τ_DOOM4效果:推演速度和乘数积累速度/τ_DOOM4
溶剂V:朊病毒噩梦(改)
“脲¤-二~~~.-_/T~/个 --”
此溶剂中会不断产生朊病毒none，生成量为((1+溶剂等级/100)^稀释中时间)-1，朊病毒在获取的总推演数量超过10,000时开始生成，当朊病毒数量超过稀释中获取的总推演数量时此稀释将会自我毁灭
溶剂VI:核食惊魂
“他摸着女儿的第二个头说:海鲜当然能吃！”
推演速度^(1-0.1×溶剂等级)none
溶剂VII:天堂已满
“你发现天上那些黑点不是雨，而是坠落的人类。”
转生，飞升，超越，轮回全部无效none(此溶剂没有等级，只有开启和不开启)
溶剂VIII:坠毁
“试图升天的人类迎来了自己的末日。”
进入稀释后1分钟便无法获得任何九头蛇能量none。
溶剂IX:天启
“晚安，世界。”
所有溶剂等级提升到最大，无法清除ok。
全局速度/1000none。
 */