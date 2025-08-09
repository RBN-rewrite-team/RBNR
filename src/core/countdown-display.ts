import { DecimalsMin } from '@/utils/algorithm';
import { formatTime } from '@/utils/format';
import Decimal from 'break_eternity.js';

/**
 *
 * @param cost 价格
 * @param curres 当前资源
 * @param speed 增长速度（每秒）
 */
export function countdown(cost: Decimal, curres: Decimal, speed: Decimal, isconstant = false, speed_deri: Decimal = new Decimal(0)) {
	if (speed_deri.eq(0))
		return (isconstant ? '' : `≤`) + formatTime(cost.sub(curres).div(speed));
	else
		return ("~") + formatTime(countdown_with_double_derivative(cost, curres, speed, speed_deri) ?? Infinity)
}

/**
 * 
 * @param cost 价格
 * @param curres x 当前资源
 * @param cur_derivative x' 增长速度（每秒）
 * @param cur_dbl_derivative x'' 增长速度的增长速度（每秒）
 */
export function countdown_with_double_derivative(cost: Decimal, curres: Decimal, cur_derivative: Decimal, cur_dbl_derivative: Decimal){
	// 如果 cost ≤ 0，已经满足条件，时间 = 0
    if (cost.lte(0)) {
        return new Decimal(0);
    }

    const a = cur_dbl_derivative; // 加速度
    const v0 = cur_derivative;    // 初始速度
    const s = cost;               // 需要增长的量

    // 情况1：加速度 a = 0（线性增长）
    if (a.eq(0)) {
        if (v0.eq(0)) {
            // 既不增长也不加速，永远达不到
            return null;
        }
        const time = s.div(v0);
        return time.gt(0) ? time : null; // 时间必须为正
    }

    // 情况2：二次增长（a ≠ 0）
    // 方程：0.5 a Δt² + v0 Δt - s = 0
    // 转换为标准二次方程：a Δt² + 2 v0 Δt - 2 s = 0
    const two = new Decimal(2);
    const A = a;
    const B = two.mul(v0);
    const C = two.mul(s).neg(); // -2s

    // 判别式 D = B² - 4AC
    const D = B.pow(2).minus(A.mul(C).mul(4));

    if (D.lt(0)) {
        // 无实数解，无法达到目标
        return null;
    }

    const sqrtD = D.sqrt();
    const denominator = two.mul(A);

    // 计算两个可能的解
    const root1 = B.neg().plus(sqrtD).div(denominator);
    const root2 = B.neg().minus(sqrtD).div(denominator);

    // 找出正实数解
    const validRoots = [root1, root2].filter((t) => t.gt(0));

    if (validRoots.length === 0) {
        return null; // 无有效解
    }

    // 返回最小的正解
    return DecimalsMin(...validRoots);
}
