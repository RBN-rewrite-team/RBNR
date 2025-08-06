import { formatTime } from "@/utils/format";
import type Decimal from "break_eternity.js";

/**
 * 
 * @param cost 价格
 * @param curres 当前资源
 * @param speed 增长速度（每秒）
 */
export function countdown(cost: Decimal, curres: Decimal, speed: Decimal, isconstant=false) {
    return (isconstant?'':`~`)+formatTime(cost.sub(curres).div(speed))
}