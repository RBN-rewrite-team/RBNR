import Decimal from 'break_eternity.js';
import { reactive } from 'vue';

export function createDeepValidatedReactive<T>(obj: T): T {
	// 递归处理对象的所有属性
	function processObject(target: any) {
		return new Proxy(target, {
			get(target, key, receiver) {
				const value = Reflect.get(target, key, receiver);
				// 如果是对象且不是 null，则递归处理
				if (
					typeof value === 'object' &&
					value !== null &&
					value! instanceof Decimal &&
					!Array.isArray(value)
				) {
					return processObject(value);
				}
				// 如果是数组，也进行处理（可选）
				if (Array.isArray(value)) {
					return processArray(value);
				}
				return value;
			},
			set(target, key, value, receiver) {
				// 检查新值是否为数字且是 NaN
				if (
					typeof target[key] === 'object' &&
					target[key] instanceof Decimal &&
					typeof value === 'object' &&
					value instanceof Decimal &&
					!Decimal.isFinite(value)
				) {
					// alert(`不能设置 NaN 到属性 ${String(key)}！`)
					console.error(`我操称冯，何意味`, target, key);
					console.trace();
					return true; // 阻止写入
				}

				// 如果设置的是对象，需要先处理
				let processedValue = value;
				if (
					typeof value === 'object' &&
					value !== null &&
					value! instanceof Decimal &&
					!Array.isArray(value)
				) {
					processedValue = processObject(value);
				} else if (Array.isArray(value)) {
					processedValue = processArray(value);
				}

				return Reflect.set(target, key, processedValue, receiver);
			},
		});
	}

	// 处理数组（可选）
	function processArray(array: any) {
		return new Proxy(array, {
			get(target, key, receiver) {
				const value = Reflect.get(target, key, receiver);
				// 如果是对象，递归处理
				if (typeof value === 'object' && value! instanceof Decimal && value !== null) {
					return processObject(value);
				}
				return value;
			},
			set(target, key, value, receiver) {
				// 检查数组元素是否为数字且是 NaN
				const numericKey = Number(key);
				if (
					!isNaN(numericKey) &&
					typeof target[numericKey] === 'object' &&
					target[numericKey] instanceof Decimal &&
					typeof value === 'object' &&
					value instanceof Decimal &&
					!Decimal.isFinite(value)
				) {
					console.error(`我操称冯，何意味`, target, key);
					console.trace();
					// alert(`不能设置 NaN 到数组索引 ${String(key)}！`)
					return true; // 阻止写入
				}

				// 如果设置的是对象，需要先处理
				let processedValue = value;
				if (
					typeof value === 'object' &&
					value !== null &&
					value! instanceof Decimal &&
					!Array.isArray(value)
				) {
					processedValue = processObject(value);
				} else if (Array.isArray(value)) {
					processedValue = processArray(value);
				}

				return Reflect.set(target, key, processedValue, receiver);
			},
		});
	}

	return reactive(processObject(obj));
}
