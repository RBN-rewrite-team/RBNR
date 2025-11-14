import './assets/stylesheet/main.scss';
import './core/anti-cheat.ts';
import './core/automator/evaluator.ts';
import { init } from './utils/init.ts';

import './core/save/index.ts';
import './core/hydra/hydra.ts';
import { Logarithm } from './core/exponention/logarithm';

declare global {
	interface BigInt {
		toJSON(): string;
	}
}

BigInt.prototype.toJSON = function () {
	return this.toString();
};
init();

import PowiainaNum from 'powiaina_num.js';
import { achievements } from './core/achievements.ts';
import { milestones } from './core/mechanic.ts';

console.log('我错了', new PowiainaNum(3));
// const res = {};
// for (let i = 0; i < achievements.length; i++) {
// 	for (let j = 0; j < achievements[i].length; j++) {
// 		res[`ach.${i}.${j}`] = achievements[i][j].title;
// 		res[`ach.${i}.${j}.desc`] = achievements[i][j].desc;
// 	}
// }
// console.log(JSON.stringify(res));

// window.exp = function () {
// 	const res = {};
// 	const a = milestones;
// 	for (const i in a) {
// 		const t = Object.getOwnPropertyDescriptor(a[i], 'description');
// 		if (typeof t?.value !== 'undefined' && t.value !== null) {
// 			res[i] = t.value;
// 		} else {
// 			res[i] = t.get;
// 		}
// 	}
// 	return res;
// };

import { difference, xor } from 'lodash-es';
import en_US from './locales/en_US.tsx';
import zh_CN from './locales/zh_CN.tsx';

const array1 = Object.keys(en_US);
const array2 = Object.keys(zh_CN);
// 找出 arr1 中有但 arr2 中没有的元素
const onlyInFirst = difference(array1, array2);

// 对称差集
const symmetricDifference = xor(array1, array2);
console.log(onlyInFirst, symmetricDifference);
