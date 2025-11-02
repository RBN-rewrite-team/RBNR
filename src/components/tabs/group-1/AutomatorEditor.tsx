import { defineComponent, onMounted, ref } from 'vue';
import { basicSetup, EditorView } from 'codemirror';
import { automatorLinter, customCompletionExtension } from '@/core/automator/ui/extension';
import { player } from '@/core/save';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { runAutomator } from '@/core/automator';
import { Compartment } from '@codemirror/state';
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
		return () => (
			<>
				<div
					ref={a}
					style={{
						/** Keep alive */
						marginTop: '10px',
						display: player.currentTab !== 167 ? 'none' : 'block',
					}}
				>
					<PrimaryButton onClick={runAutomator}>Run automator</PrimaryButton>
				</div>
			</>
		);
	},
});
