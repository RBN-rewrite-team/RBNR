/**
 * 把一个字符串转换成JSX对象
 * \( \)会被转换成latex公式
 * \n会被转换成<br />
 */
import { VueLatex } from 'vatex';
import { defineComponent, type PropType } from 'vue';
import type { JSX } from 'vue/jsx-runtime';

export default function convertTextToComponent(text2: string): JSX.Element {
	if (!text2) return <></>;
	let text = text2;
	text = text.replace(/\s*\\\[/g, '\\[');

	const elements: JSX.Element[] = [];
	let keyCounter = 0;

	// 更精确的正则表达式，避免匹配部分公式
	const regex = /(\\\([^]*?\\\)|\\\[[^]*?\\\]|\n|===)/;

	const processPart = (part: string) => {
		if (!part) return;

		keyCounter++;

		// 检查行内公式 \( ... \)
		if (part.length >= 4 && part.startsWith('\\(') && part.endsWith('\\)')) {
			const latexContent = part.slice(2, -2);
			elements.push(<VueLatex key={`inline-${keyCounter}`} expression={latexContent} />);
		}
		// 检查显示模式公式 \[ ... \]
		else if (part.length >= 4 && part.startsWith('\\[') && part.endsWith('\\]')) {
			const latexExpression = part.slice(2, -2);
			elements.push(
				<VueLatex
					key={`display-${keyCounter}`}
					expression={latexExpression}
					display-mode
				/>,
			);
		}
		// 处理换行符
		else if (part === '\n') {
			elements.push(<br key={`br-${keyCounter}`} />);
		}
		// 处理 hr 符号
		else if (part === '===') {
			elements.push(<div key={`hr-${keyCounter}`} class="center_line" />);
		}
		// 普通文本 - 递归处理可能的多重公式
		else {
			// 如果普通文本中可能包含其他公式，递归处理
			const subParts = part.split(regex);
			if (subParts.length > 1) {
				subParts.forEach((subPart) => processPart(subPart));
			} else {
				elements.push(<span key={`text-${keyCounter}`}>{part}</span>);
			}
		}
	};

	const parts = text.split(regex);
	parts.forEach((part) => processPart(part));

	return <>{elements}</>;
}
export const component = defineComponent({
	props: {
		text: {
			type: String as PropType<string>,
			required: true,
		},
	} as const,
	setup(props) {
		return () => convertTextToComponent(props.text);
	},
});
// 使用示例：
// const text = "这是一个公式：\\(E = mc^2\\) 和另一个公式：\\(a^2 + b^2 = c^2\\)\n这是第二行";
// const jsxComponent = convertTextToComponent(text);
