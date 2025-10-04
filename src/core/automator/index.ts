import ModalService from '@/utils/Modal';
import { player } from '../save';
import { Environment, parentEnvironment } from './environment';
import { compileAndEvaluate } from './evaluator';
import Decimal from 'break_eternity.js';
import { format } from '@/utils/format';
export function formatResult(result: any): string {
	if (result instanceof Decimal) return format(result);
	else if (typeof result == 'string') {
		return `"${result.replace(/\\/g, '\\\\').replace(/"/g, '\"')}"`;
	} else if (Array.isArray(result)) {
		return `[${result.map((x) => formatResult(x)).join(',')}]`;
	} else if (result === undefined) return `No result`;
	return result.toString() as string;
}
export async function runAutomator() {
	try {
		const result = await compileAndEvaluate(
			player.automator.code,
			new Environment(parentEnvironment),
		);

		ModalService.show({
			title: '运行成功',
			content: '运行结果: ' + formatResult(result),
		});
	} catch (e) {
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
