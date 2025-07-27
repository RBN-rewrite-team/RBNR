import { player } from "./save";
import { Successor } from "./successor/successor";

interface IAchievement {
    title: string;
    desc: string;
    satisfied?(): boolean;
}

export function achLoop (){
    for (const row of achievements) {
        for (const ach of row) {
            if (ach.satisfied?.() ?? false) {
                
            }
        }
    }
}
export const achievements: IAchievement[][] = [
    [
        {
            title: "道↓理↑生一",
            desc: "数值到达1",
            satisfied() {
                return player.number.gte(1);
            }
        }, 
        {
            title: "现在挂机e9e15秒就可以通关",
            desc: "开始自动获得数值",
            satisfied() {
                return Successor.autoSuccessPerSecond().gt(0);
            },
        }
    ]
] as const;