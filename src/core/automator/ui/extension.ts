import { autocompletion, CompletionContext } from '@codemirror/autocomplete';

// 定义一个自定义的补全源
const myCompletions = (context: CompletionContext) => {
	const word = context.matchBefore(/\w*/);
	// 如果从行首开始或显式激活，才提供补全
	if (!word || (word.from == word.to && !context.explicit)) return null;

	return {
		from: word.from,
		options: [
			{ label: 'var', type: 'keyword' },
			{ label: 'for', type: 'keyword' },
			{ label: 'while', type: 'keyword' },
			{ label: 'import', type: 'keyword' },
			{ label: 'include', type: 'keyword' },
		],
	};
};

// 将自定义补全源作为扩展使用
export const customCompletionExtension = autocompletion({ override: [myCompletions] });

import { linter, type Diagnostic } from '@codemirror/lint';
import { parseAndCheckErrors } from './check-errors';

// 定义一个简单的 linter，用于 TypeScript 语法检查
export const automatorLinter = linter((view) => {
	const diagnostics: Diagnostic[] = [];
	// 示例：检查是否使用了 'var'，推荐使用 'let' 或 'const'
	const text = view.state.doc.toString();
	const errors = parseAndCheckErrors(text);
	console.log(errors[0]);
	errors.forEach((x) => {
		diagnostics.push({
			from: x.offset ?? 0,
			to: x.offset2 ?? 0,
			severity: 'error',
			message: "I don't known",
		});
	});
	//   const regex = /\bvar\b/g;
	//   let match;
	//   while ((match = regex.exec(text)) !== null) {
	//     diagnostics.push({
	//       from: match.index,
	//       to: match.index + match[0].length,
	//       severity: "warning",
	//       message: "Consider using 'let' or 'const' instead of 'var'.",
	//     });
	//   }
	return diagnostics;
});
