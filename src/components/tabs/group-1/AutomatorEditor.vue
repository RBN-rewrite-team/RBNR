<script lang="ts" setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue';
import { player } from '@/core/global';
import { highlightAutomator } from '@/core/automator/lexer';
import DOMPurify from 'dompurify';
import { runAutomator } from '@/core/automator';
import { format } from '@/utils/format';
import { component as textToComponent } from '../help/text-to-component-convert';
import automatorhelp from './automatorhelp.txt?raw';
import examplecode from './examplecode.rbnr.txt?raw';
import { setInterrupt } from '@/core/automator/evaluator';

const emit = defineEmits<{
	(e: 'update:code', code: string): void;
}>();
const editorRef = ref<HTMLDivElement>();
const highlightRef = ref<HTMLDivElement>();
const gutterRef = ref<HTMLDivElement>();

// 添加撤销重做历史
const history = ref<string[]>([]);
const historyIndex = ref(-1);

const lineNumbers = computed(() => {
	const lines = player.automator.code.split('\n').length;
	return Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
});

const highlightedCode = computed(() => {
	return highlightAutomator(player.automator.code);
});

// 添加历史记录
const addToHistory = (code: string) => {
	// 如果当前不在历史记录的最新位置，移除后面的记录
	if (historyIndex.value < history.value.length - 1) {
		history.value = history.value.slice(0, historyIndex.value + 1);
	}

	history.value.push(code);
	historyIndex.value = history.value.length - 1;

	// 限制历史记录长度
	if (history.value.length > 100) {
		history.value.shift();
		historyIndex.value--;
	}
};

const handleInput = (): void => {
	if (editorRef.value) {
		const newCode = santize(editorRef.value.innerHTML);
		if (newCode !== player.automator.code) {
			player.automator.code = newCode;
			addToHistory(newCode);
			emit('update:code', player.automator.code);
			handleScroll();
		}
	}
};

const handleScroll = (): void => {
	if (editorRef.value && highlightRef.value && gutterRef.value) {
		highlightRef.value.scrollTop = editorRef.value.scrollTop;
		highlightRef.value.scrollLeft = editorRef.value.scrollLeft;
		gutterRef.value.scrollTop = editorRef.value.scrollTop;
	}
};

const handleKeyDown = (e: KeyboardEvent): void => {
	// Tab 键缩进
	if (e.key === 'Tab') {
		e.preventDefault();
		insertTextAtCursor('  ');
	}
	// // Ctrl+/ 注释/取消注释
	// else if (e.key === '/' && (e.ctrlKey || e.metaKey)) {
	// 	e.preventDefault();
	// 	toggleComment();
	// }
	// // Ctrl+Z 撤销
	// else if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
	// 	e.preventDefault();
	// 	undo();
	// }
	// // Ctrl+Y 或 Ctrl+Shift+Z 重做
	// else if (
	// 	(e.key === 'y' && (e.ctrlKey || e.metaKey)) ||
	// 	(e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey)
	// ) {
	// 	e.preventDefault();
	// 	redo();
	// }
	// // Ctrl+D 复制当前行
	// else if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
	// 	e.preventDefault();
	// 	duplicateLine();
	// }
	// // Ctrl+L 选择当前行
	// else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
	// 	e.preventDefault();
	// 	selectCurrentLine();
	// }
};

// 在光标位置插入文本
const insertTextAtCursor = (text: string) => {
	const selection = window.getSelection();
	if (!selection?.rangeCount) return;

	const range = selection.getRangeAt(0);
	range.deleteContents();
	const textNode = document.createTextNode(text);
	range.insertNode(textNode);
	range.setStartAfter(textNode);
	range.setEndAfter(textNode);
	selection.removeAllRanges();
	selection.addRange(range);

	handleInput();
};

// 注释/取消注释当前行或选中行
const toggleComment = () => {
	const selection = window.getSelection();
	if (!selection?.rangeCount) return;

	const range = selection.getRangeAt(0);
	const startContainer = range.startContainer;

	// 获取编辑器的内容
	let code = player.automator.code;
	const lines = code.split('\n');

	// 获取选中行的范围
	const startLine = getLineNumberFromPosition(range.startOffset, code);
	const endLine = getLineNumberFromPosition(range.endOffset, code);

	// 检查选中行是否都已经注释
	let allCommented = true;
	for (let i = startLine; i <= endLine; i++) {
		if (lines[i] && !lines[i].trim().startsWith('//')) {
			allCommented = false;
			break;
		}
	}

	// 注释或取消注释
	for (let i = startLine; i <= endLine; i++) {
		if (lines[i]) {
			if (allCommented) {
				// 取消注释
				lines[i] = lines[i].replace(/^(\s*)\/\//, '$1');
			} else {
				// 添加注释
				const trimmed = lines[i].trim();
				if (trimmed && !trimmed.startsWith('//')) {
					const indent = lines[i].match(/^(\s*)/)?.[0] || '';
					lines[i] = indent + '//' + lines[i].substring(indent.length);
				}
			}
		}
	}

	// 更新代码
	const newCode = lines.join('\n');
	player.automator.code = newCode;
	addToHistory(newCode);

	// 更新编辑器显示
	if (editorRef.value) {
		editorRef.value.innerText = newCode;
	}

	emit('update:code', newCode);
};

// 获取指定位置的行号
const getLineNumberFromPosition = (position: number, code: string): number => {
	return code.substring(0, position).split('\n').length - 1;
};

// 撤销
const undo = () => {
	if (historyIndex.value > 0) {
		historyIndex.value--;
		const code = history.value[historyIndex.value];
		player.automator.code = code;
		if (editorRef.value) {
			editorRef.value.innerText = code;
		}
		emit('update:code', code);
	}
};

// 重做
const redo = () => {
	if (historyIndex.value < history.value.length - 1) {
		historyIndex.value++;
		const code = history.value[historyIndex.value];
		player.automator.code = code;
		if (editorRef.value) {
			editorRef.value.innerText = code;
		}
		emit('update:code', code);
	}
};

// 复制当前行
const duplicateLine = () => {
	const selection = window.getSelection();
	if (!selection?.rangeCount) return;

	const range = selection.getRangeAt(0);
	let code = player.automator.code;
	const lines = code.split('\n');
	const currentLine = getLineNumberFromPosition(range.startOffset, code);

	// 复制当前行
	if (lines[currentLine]) {
		lines.splice(currentLine + 1, 0, lines[currentLine]);
		const newCode = lines.join('\n');
		player.automator.code = newCode;
		addToHistory(newCode);

		if (editorRef.value) {
			editorRef.value.innerText = newCode;
		}
		emit('update:code', newCode);
	}
};

// 选择当前行
const selectCurrentLine = () => {
	const selection = window.getSelection();
	if (!selection?.rangeCount || !editorRef.value) return;

	const range = selection.getRangeAt(0);
	let code = player.automator.code;
	const currentLine = getLineNumberFromPosition(range.startOffset, code);
	const lines = code.split('\n');

	// 计算当前行的开始和结束位置
	let lineStart = 0;
	for (let i = 0; i < currentLine; i++) {
		lineStart += lines[i].length + 1; // +1 for newline
	}
	const lineEnd = lineStart + lines[currentLine].length;

	// 创建新的范围
	const newRange = document.createRange();
	const textNode = getTextNodeAtPosition(editorRef.value, lineStart);
	const endNode = getTextNodeAtPosition(editorRef.value, lineEnd);

	if (textNode && endNode) {
		newRange.setStart(textNode.node, textNode.offset);
		newRange.setEnd(endNode.node, endNode.offset);
		selection.removeAllRanges();
		selection.addRange(newRange);
	}
};

// 获取指定位置的文本节点
const getTextNodeAtPosition = (
	root: Node,
	position: number,
): { node: Node; offset: number } | null => {
	let current = 0;

	function findNode(node: Node): { node: Node; offset: number } | null {
		if (node.nodeType === Node.TEXT_NODE) {
			const length = node.textContent?.length || 0;
			if (position <= current + length) {
				return { node, offset: position - current };
			}
			current += length;
		} else {
			for (let i = 0; i < node.childNodes.length; i++) {
				const result = findNode(node.childNodes[i]);
				if (result) return result;
			}
		}
		return null;
	}

	return findNode(root);
};

const santize = (text: string): string => {
	return escapeText(
		DOMPurify.sanitize(text)
			.replace(/<div><br><\/div>/g, '\n')
			.replace(/<div>/g, '\n')
			.replace(/<\/div>/g, '')
			.replace(/<br>/g, '\n'),
	);
};

const escapeText = (text: string): string => {
	let a = document.createElement('textarea');
	a.innerHTML = text;
	return a.innerText;
};

// 格式化代码
const formatCode = () => {
	// 简单的代码格式化：去除多余空白，统一缩进
	let code = player.automator.code;
	const lines = code.split('\n').map((line) => line.trimEnd());
	player.automator.code = lines.join('\n');
	addToHistory(player.automator.code);

	if (editorRef.value) {
		editorRef.value.innerText = player.automator.code;
	}
	emit('update:code', player.automator.code);
};

// 清空代码
const clearCode = () => {
	player.automator.code = '';
	addToHistory('');

	if (editorRef.value) {
		editorRef.value.innerText = '';
	}
	emit('update:code', '');
};

watch(
	() => player.automator.code,
	(newCode) => {
		if (newCode !== player.automator.code && editorRef.value) {
			player.automator.code = santize(newCode);
			editorRef.value.innerText = newCode;
		}
	},
);

onMounted(() => {
	if (editorRef.value) {
		editorRef.value.innerText = player.automator.code;
		addToHistory(player.automator.code);
	}
	handleInput();
});
const interrupt = () => setInterrupt(true);
</script>

<template>
	<div align="center">
		自动机<br />
		<div class="toolbar">
			<button class="clickable_button" @click="runAutomator">运行</button>
			<button class="clickable_button" @click="clearCode">清空</button>
			<button class="clickable_button" @click="undo" :disabled="historyIndex <= 0">
				撤销
			</button>
			<button
				class="clickable_button"
				@click="redo"
				:disabled="historyIndex >= history.length - 1"
			>
				重做
			</button>
			<button class="clickable_button" @click="interrupt">停止运行</button>
		</div>
		<p>
			自动机每运行一个语句就需要耗费0.1时间碎片，你当前有
			<span style="color: rgb(255, 63, 255)">{{ format(player.timeshard.value) }}</span>
			时间碎片， 可以运行 {{ format(player.timeshard.value.mul(10).floor()) }}个语句
		</p>
		<div class="code-editor" align="left">
			<div ref="gutterRef" class="gutter" v-html="lineNumbers"></div>
			<div class="editor-container">
				<div ref="highlightRef" class="highlight-layer" v-html="highlightedCode"></div>
				<div
					ref="editorRef"
					class="editor"
					contenteditable="plaintext-only"
					spellcheck="false"
					@input="handleInput"
					@scroll="handleScroll"
					@keydown="handleKeyDown"
				></div>
			</div>
		</div>
		<!-- <div class="shortcut-hints">
			<small
				>快捷键: Ctrl+/ 注释 | Ctrl+Z 撤销 | Ctrl+Y 重做 | Ctrl+D 复制行 | Ctrl+L
				选择行</small
			>
		</div> -->
		<h2>自动机语法</h2>
		<div class="selectable">
		<textToComponent :text="automatorhelp" />
		<div v-if="player.upgrades['ts_auto_pkg_hydra']">
			<div class="center_line"></div>
			hydra包<br />使用include hydra;导入<br />
			call hydra.reset(0); 进行一次九头蛇能量重置<br />
			call hydra.reset(1); 进行一次转生<br />
			call hydra.reset(2); 进行一次飞升<br />
			call hydra.reset(3); 进行一次超越<br />
			call hydra.reset(4); 轮回<br />
			call hydra.dilute(); 进入/退出稀释<br />
			call hydra.diluteset(a, b); 设置稀释a type为b<br />
			hydra.indilute; 是否在稀释中
		</div>
		<div v-if="player.upgrades['ts_auto_pkg_nonrec']">
			<div class="center_line"></div>
			nonrec包<br />使用include nonrec;导入<br />
			call nonrec.reset(); 如果可能，进行一次非递归重置<br />
			call nonrec.buyStudy(0); 购买自动机ID为0的非递归研究树<br />
			call nonrec.respec(); 重置研究树<br />
			nonrec.power; 获取当前的非递归能量<br />
		</div>
		</div>
		<br />
		<button class="clickable_button" @click="player.automator.code = examplecode">
			加载示例代码
		</button>
	</div>
</template>

<style scoped>
.code-editor {
	position: relative;
	height: 600px;
	width: 80%;
	display: flex;
	background-color: #1f1f1f;
	color: white;
	font-family: 'JetBrains Mono', monospace;
	font-size: 15px;
	overflow: hidden;
	white-space: nowrap;
	word-break: keep-all;
	border: 1px solid #444;
	border-radius: 4px;
}

.editor-container {
	position: relative;
	width: calc(100% - 50px);
	height: 100%;
}

.gutter {
	width: 50px;
	background-color: #2d2d30;
	color: #858585;
	text-align: right;
	padding: 15px 5px;
	box-sizing: border-box;
	user-select: none;
	overflow: hidden;
	flex-shrink: 0;
	line-height: 1.5;
	border-right: 1px solid #444;
}

.highlight-layer {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	padding: 15px;
	box-sizing: border-box;
	background: #1f1f1f;
	z-index: 1;
	overflow: auto;
	font-family: inherit;
	font-size: inherit;
	line-height: 1.5;
	white-space: pre;
	pointer-events: none;
}

.editor {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	padding: 15px;
	box-sizing: border-box;
	background: transparent;
	color: transparent;
	caret-color: white;
	z-index: 2;
	overflow: auto;
	font-family: inherit;
	font-size: inherit;
	line-height: 1.5;
	white-space: pre;
	border: none;
	outline: none;
	resize: none;
}

.toolbar {
	margin: 10px 0;
}

.toolbar button {
	margin: 0 5px;
}

.shortcut-hints {
	margin: 10px 0;
	color: #888;
}

.clickable_button:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.keyword {
	color: #569cd6;
}

.string {
	color: #ce9178;
}

.comment {
	color: #6a9955;
	font-style: italic;
}

.function {
	color: #dcdcaa;
}

.number {
	color: #b5cea8;
}

@font-face {
	font-family: JetBrains Mono;
	src: url('../../assets/JetBrainsMono-Regular.ttf') format('truetype');
	font-style: normal;
}

@font-face {
	font-family: JetBrains Mono;
	src: url('../../assets/JetBrainsMonoNL-Italic.ttf') format('truetype');
	font-style: italic;
}
.clickable_button {
	display: inline;
}
</style>
