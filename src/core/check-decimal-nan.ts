import Decimal from 'break_eternity.js';
import { reactive } from 'vue';

function isInvalid(x: Decimal) {
	return x.isNan() || !x.isFinite() || x.lt(0);
}
export function createDeepValidatedReactive<T>(obj: T): T {
	// 递归处理对象的所有属性
	function processObject(target: any) {
		return new Proxy(target, {
			get(target, key, receiver) {
				const value = Reflect.get(target, key, receiver);
				// 如果是对象且不是 null，则递归处理
				if (typeof value === 'object' && value !== null && !(value instanceof Decimal)) {
					return processObject(value);
				}
				return value;
			},
			set(target, key, value, receiver) {
				// 检查新值是否为数字且是 NaN
				if (typeof value === 'object' && value instanceof Decimal && isInvalid(value)) {
					// alert(`不能设置 NaN 到属性 ${String(key)}！`)
					console.error(`The game find something suspicious is writing invalid value`);
					console.error(`Target: `, target, `, Key:`, key);
					console.error(
						'If you see this, it means the game may meet problems and needs to checked',
					);
					console.error(value.toString());
					console.trace();
					return true; // 阻止写入
				}

				// 如果设置的是对象，需要先处理
				let processedValue = value;
				if (typeof value === 'object' && value !== null && !(value instanceof Decimal)) {
					processedValue = processObject(value);
				}

				return Reflect.set(target, key, processedValue, receiver);
			},
		});
	}

	return reactive(processObject(obj));
}
