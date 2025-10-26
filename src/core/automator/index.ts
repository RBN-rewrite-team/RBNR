import ModalService from '@/utils/Modal';
import { player } from '../save';
import { Environment, parentEnvironment } from './environment';
import { compileAndEvaluate } from './evaluator';
import Decimal from 'break_eternity.js';
import { format } from '@/utils/format';
export function formatResult(result: any): string {
	if (result instanceof Decimal) return format(result);
	else if (typeof result == 'string') {
		return `"${result.replace(/\\/g, '\\\\')}"`;
	} else if (Array.isArray(result)) {
		return `[${result.map((x) => formatResult(x)).join(',')}]`;
	} else if (result === undefined) return `No result`;
	return result.toString() as string;
}
export async function runAutomator() {
	try {
		const result = await compileAndEvaluate(
			player.automator.code,
			new (class extends Environment {
				nodeclarecheck: boolean = false;
			})(parentEnvironment),
		);
	} catch (e) {
		if (e instanceof RangeError && e.message.includes('call stack size')) {
			player.achievements.push(-5);
		}
		ModalService.show({
			title: '自动机出现错误',
			content: (function () {
				if (e instanceof Error) {
					return `${e.name}, ${e.message}`;
				}
				return (e as any).toString();
			})(),
		});
		console.log(e);
	}
}
