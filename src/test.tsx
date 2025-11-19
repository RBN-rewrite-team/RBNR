import { difference, xor } from 'lodash-es';
import { VueLatex } from 'vatex';
import { Comment, Static, Text, type VNodeTypes } from 'vue';
import { Fragment, type JSX } from 'vue/jsx-runtime';
import zh_CN from './locales/zh_CN';
import en_US from './locales/en_US';
// const a = (
// 	<>
// 		假设这样的 <vue-latex expression="k \in \mathbb N" /> 不存在。则对于每个
// 		<vue-latex expression="k \in \mathbb N" />
// 		，有
// 		<vue-latex expression="S[a_0][a_1]\cdots[a_{k-1}] \neq E" />
// 		，所以
// 		<vue-latex expression="\textrm{trans}(S[a_0][a_1]\cdots[a_{k-1}]) \neq 0" />
// 		。因此，如果 <vue-latex expression="S[a_0][a_1]\cdots[a_{k-1}]" /> 有定义，则
// 		<vue-latex expression="S[a_0][a_1]\cdots[a_{k-1}][a_k]" />
// 		也有定义。通过数学归纳法，对于任意
// 		<vue-latex expression="k \in \mathbb N" />，
// 		<vue-latex expression="S[a_0][a_1]\cdots[a_{k-1}]" />
// 		都有定义。然而，由引理 4，有
// 		<vue-latex expression="\textrm{trans}(S) > \textrm{trans}(S[a_0]) > \textrm{trans}(S[a_0][a_1]) > \cdots " />
// 		，这是一个序数的无穷降链。这与序数的良基性矛盾。由反证法，存在
// 		<vue-latex expression="k \in \mathbb N" /> 使得
// 		<vue-latex expression="S[a_0][a_1]\cdots[a_{k-1}] = E" />。
// 	</>
// );
export function convertJSXtoPlain(x: JSX.Element) {
	if (
		(typeof x.type == 'object' && x.type == VueLatex) ||
		(typeof x.type == 'string' && x.type == 'vue-latex')
	) {
		const props = x.props;
		if (!props) return '\\(不对\\)';
		const hasExpression = 'expression' in props;
		if (!hasExpression) return '\\(不对\\)';
		const expression = props.expression as string;
		const isDisplayMode = props.displayMode ?? props['display-mode'] ?? false;

		return isDisplayMode ? `\\[${expression}\\]` : `\\(${expression}\\)`;
	}

	if (typeof x.type == 'string') {
		if (x.type == 'br') {
			return '\n';
		} else {
			if (Array.isArray(x.children)) {
				const suffix = x.type == 'p' || x.type == 'div' ? '\n' : '';
				return x.children.map((x: any): any => convertJSXtoPlain(x)).join('') + suffix;
			}
		}
		return 'Element ' + x.type;
	}

	if ((x.children?.length ?? 0) == 0) {
		return '';
	}

	if (typeof x.type == 'symbol') {
		// a.type==Symbol(v-fgt)
		if (x.type == Text) {
			return x.children;
		}
		if (x.children) {
			if (Array.isArray(x.children)) {
				return x.children.map((x: any): any => convertJSXtoPlain(x)).join('');
			}
		}
	}
	return x.type;
}
const array1 = Object.keys(zh_CN);
const array2 = Object.keys(en_US);
// console.log(convertJSXtoPlain(a));
const onlyInFirst = difference(array1, array2);

// 对称差集
const symmetricDifference = xor(array1, array2);
console.log(onlyInFirst, symmetricDifference);
