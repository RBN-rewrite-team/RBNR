import { defineComponent, onMounted, ref } from 'vue';
import { basicSetup, EditorView } from 'codemirror';
import { automatorLinter, customCompletionExtension } from '@/core/automator/ui/extension';
import { player } from '@/core/save';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { runAutomator } from '@/core/automator';
import { Compartment } from '@codemirror/state';
import { useI18n } from 'vue-i18n';
import { setInterrupt } from '@/core/automator/evaluator';
import { i18n } from '@/utils/i18n';
// 为主题创建一个配置隔间
const themeCompartment = new Compartment();

export const AutomatorTextUI = {
	editor: null as EditorView | null,
	container: null as HTMLDivElement | null,
	div: null as HTMLDivElement | null,
	textArea: null as HTMLTextAreaElement | null,
	// mode: {
	// 	mode: 'automato',
	// 	lint: 'automato',
	// 	lineNumbers: true,
	// 	theme: 'liquibyte',
	// 	tabSize: 2,
	// 	extraKeys: {
	// 		Tab: (cm: Document) => cm.execCommand('indentMore'),
	// 		'Shift-Tab': (cm: Document) => cm.execCommand('indentLess'),
	// 	},
	// 	autoCloseBrackets: true,
	// 	lineWrapping: true,
	// },
	initialize() {
		if (this.container) return;
		this.setUpContainer();
		this.setUpEditor();
		// EventHub.ui.on(GAME_EVENT.GAME_LOAD, () => this.documents = {});
	},
	setUpContainer() {
		if (!this.div) {
			return;
		}
		this.container = document.createElement('div');
		this.container.className = 'l-automator-editor__codemirror-container';
		// this.textArea = document.createElement('textarea');
		// this.container.appendChild(this.textArea);
		this.div.appendChild(this.container);
	},
	setUpEditor() {
		this.editor = new EditorView({
			doc: player.automator.code,
			extensions: [
				basicSetup,
				customCompletionExtension,
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						// 获取编辑器最新全文
						player.automator.code = update.state.doc.toString();
						// 这里可以调用其他处理函数，如自动保存
					}
				}),
				themeCompartment.of(EditorView.theme({}, { dark: true })), // 初始为空主题，浅色模式
				automatorLinter,
			],
			parent: this.container as HTMLDivElement,
		});
		// this.editor = CodeMirror.fromTextArea(this.textArea, this.mode);
		// // CodeMirror has a built-in undo/redo functionality bound to ctrl-z/ctrl-y which doesn't have an
		// // easily-configured history buffer; we need to specifically cancel this event since we have our own undo
		// this.editor.on('beforeChange', (_, event) => {
		// 	if (event.origin === 'undo') event.cancel();
		// });
		// this.editor.on('keydown', (editor, event) => {
		// 	const key = event.key;
		// 	if (event.ctrlKey && ['z', 'y'].includes(key)) {
		// 		if (key === 'z') AutomatorData.undoScriptEdit();
		// 		if (key === 'y') AutomatorData.redoScriptEdit();
		// 		return;
		// 	}
		// 	// This check is related to the drop-down command suggestion menu, but must come after the undo/redo check
		// 	// as it often evaluates to innocuous false positives which eat the keybinds
		// 	if (editor.state.completionActive) return;
		// 	if (event.ctrlKey || event.altKey || event.metaKey || !/^[a-zA-Z0-9 \t]$/u.test(key))
		// 		return;
		// 	CodeMirror.commands.autocomplete(editor, null, { completeSingle: false });
		// });
		// this.editor.on('change', (editor, event) => {
		// 	const scriptID = ui.view.tabs.reality.automator.editorScriptID;
		// 	const scriptText = editor.getDoc().getValue();
		// 	// Undo/redo directly changes the editor contents, which also causes this event to be fired; we have a few
		// 	// things which we specifically only want to do on manual typing changes
		// 	if (event.origin !== 'setValue') {
		// 		AutomatorBackend.saveScript(scriptID, scriptText);
		// 		AutomatorData.redoBuffer = [];
		// 	}
		// 	AutomatorData.recalculateErrors();
		// 	const errors = AutomatorData.currentErrors().length;
		// 	if (errors > editor.doc.size) SecretAchievement(48).unlock();
		// 	// Clear all line highlighting as soon as any text is changed because that might have shifted lines around
		// 	AutomatorHighlighter.clearAllHighlightedLines();
		// });
	},
	clearEditor() {
		// In some importing cases (mostly when importing a save without the automator unlocked), the editor doesn't exist
		// and attempting to modify it will cause console errors; in this case we initialize it to a blank editor (even
		// though its inaccessible) in order to prevent errors on-load and when first checking that subtab
		// if (!this.editor) {
		// 	this.setUpContainer();
		// 	this.setUpEditor();
		// }
		// this.editor.setValue('');
		// this.editor.clearHistory();
		// this.editor.clearGutter('gutterId');
	},
	// Used to return back to the same line the editor was on from before switching tabs
	savedVertPos: 0,
};

export default defineComponent({
	name: 'AutomatorEditor',
	setup() {
		const a = ref<HTMLDivElement | null>(null);
		onMounted(function () {
			AutomatorTextUI.div = a.value;
			AutomatorTextUI.initialize();
		});
		const interrupt = () => setInterrupt(true);
		const $t = useI18n().t;
		return () => (
			<>
				<div
					style={{
						/** Keep alive */
						marginTop: '10px',
						display: player.currentTab !== 167 ? 'none' : 'block',
					}}
				>
					<div ref={a}></div>

					<PrimaryButton onClick={runAutomator}>Run automator</PrimaryButton>
					<PrimaryButton onClick={interrupt}>Interrupt</PrimaryButton>

					{i18n.global.locale.value == 'zh-CN' ? (
						<>
							<h1>自动机语法</h1>
							<h2>字面量</h2>
							<p>如 1, "xxxx", [1,3,4,3] 为字面量</p>
							<h3>数字</h3>
							<p>形如1, f3.4e38为数字字面量</p>
							<h3>字符串</h3>
							<p>形如"hello world", "jenesaispas"为字符串字面量</p>
							<h3>数组</h3>
							<p>形如[1,1,4,5,1,4] [1,3,4,2,5,8,10]为数组字面量</p>
							<h3>哈希表</h3>
							<p>
								形如{'{'} a: xx, b: cc, d:ee{'}'}为哈希表字面量
							</p>
							<p>其中a, b, d为键， xx, cc, ee为值（可以为任何字面量）</p>
							<h2>语句</h2>
							<p>每一个语句（除非有特殊说明），在末尾需要加分号</p>
							<p>例如: delay(100); var a = 0;</p>
							<h2>变量</h2>
							<p>使用var a = 3;声明变量</p>
							<p>变量需要使用var a才能用a = 字面量; 形式</p>
							<h2>函数</h2>
							<p>
								使用function name(x, y, z) {'{'} ...return y;{'}'}声明函数
							</p>
							<p>后面不需要加分号</p>
							<p>x,y,z为参数，数量任定，可无。</p>
							<p>name为函数名</p>
							<p>return y;为函数的返回结果。</p>
							<h3>函数调用</h3>
							<p>使用 name(); 或 name(a,b,c); 调用函数。</p>
							<p>也可使用 call name();</p>
							<h2>循环</h2>
							<h3>for循环</h3>
							<p>
								使用 for (var x = y; xxx;yyy) {'{'}....{'}'}
							</p>
							<p>其中xxx是循环不停止的条件, yyy是每一次循环末尾执行的语句</p>
							<h3>while循环</h3>
							<p>
								使用 while (xxx) {'{'}....{'}'}
							</p>
							<p>其中xxx是循环不停止的条件</p>
							<h2>导入导出机制</h2>
							<p>
								可以使用语句include xxx; import xxx; #include xxx;导入某个Module。
							</p>
							<h3>Module列表</h3>
							<p>math: 数学 module</p>
							<p>music: 音乐 module</p>
							<p>rbnr: RBNR module</p>
						</>
					) : (
						<>
							<h1>Automator syntaxes</h1>
							<p style="color: #ffcc00ff">It's not all translated</p>

							<h2>Literal</h2>
							<p>1, "xxxx", [1,3,4,3] are literals</p>
							<h3>Number</h3>
							<p>1, e300, 1.79e308, f3.422e38, 1f33 are number literals</p>
							<h3>String</h3>
							<p>"hello world", "jenesaispas" are string literals</p>
							<h3>Array</h3>
							<p>[1,1,4,5,1,4] [1,3,4,2,5,8,10] are array literals</p>
							<h3>Hash Table</h3>
							<p>
								{'{'} a: xx, b: cc, d:ee{'}'} is an hash table literal
							</p>
							<p>a, b, d are keys, xx, cc, ee are values(can be any literals)</p>
							<h2>Sentence</h2>
							<p>
								each sentence (except for some special cases), needs to add
								semicolon on the end of sentence
							</p>
							<p>such as: delay(100); var a = 0;</p>
							<h2>Variable</h2>
							<p>Use var a = 3; to declare a variable</p>
							<p>the variable need to use `var a` to use `a = literal;`</p>
							<h2>Function</h2>
							<p>
								use function name(x, y, z) {'{'} ...return y;{'}'} to declare a
								function
							</p>
							<p>don't add semicolon after declaration</p>
							<p>x,y,z are arguments.</p>
							<p>`name` is the function name</p>
							<p>return y; is the result of function</p>
							<h3>Function call</h3>
							<p>use name(); or name(a,b,c); to call function.</p>
							<p>or use call name();</p>
							<h2>Loop </h2>
							<h3>for Loop</h3>
							<p>
								use for (var x = y; xxx;yyy) {'{'}....{'}'}
							</p>
							<p>其中xxx是循环不停止的条件, yyy是每一次循环末尾执行的语句</p>
							<h3>while循环</h3>
							<p>
								使用 while (xxx) {'{'}....{'}'}
							</p>
							<p>其中xxx是循环不停止的条件</p>
							<h2>导入导出机制</h2>
							<p>
								可以使用语句include xxx; import xxx; #include xxx;导入某个Module。
							</p>
							<h3>Module列表</h3>
							<p>math: 数学 module</p>
							<p>music: 音乐 module</p>
							<p>rbnr: RBNR module</p>
						</>
					)}
				</div>
			</>
		);
	},
});
