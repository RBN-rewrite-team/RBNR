// utils/modal.ts
import { createApp, h, ref, type Component, type App, type VNode } from 'vue';
import Modal from '../components/group-2/Modal.vue';
import { i18n } from './i18n';
import type { $t } from './types';

export interface FieldConfig {
	type?: string;
	label?: string;
	placeholder?: string;
	defaultValue?: string;
	required?: boolean;
	validation?: RegExp | ((value: string) => boolean);
	validateOnChange?: boolean;
	errorMessage?: string;
	rows?: number;
}

export interface ButtonConfig {
	text: string;
	handler: (e?: MouseEvent, instance?: ModalInstance) => void;
	class?: string;
	disabled?: boolean;
}

export interface ModalOptions {
	title?: string;
	content?: string;
	icon?: Component;
	fields?: FieldConfig[];
	width?: string;
	confirmText?: string;
	cancelText?: string;
	closeOnClickMask?: boolean;
	validateOnChange?: boolean;
	showProgress?: boolean;
	progress?: number;
	buttons?: ButtonConfig[];
	onConfirm?: (values: string[]) => void;
	onCancel?: () => void;
	onClose?: () => void;
	showCancelButton?: boolean;
	showConfirmButton?: boolean;
	// 新增：支持自定义组件
	component?: Component;
	componentProps?: Record<string, any>;
	slots?: Record<string, () => VNode | VNode[]>;
	dangerous?: boolean;
}

export interface ModalInstance {
	handleConfirm?: () => void;
	handleCancel?: () => void;
	close?: () => void;
	updateComponentProps?: (props: Record<string, any>) => void;
}

export interface ProgressController {
	updateProgress: (value: number) => void;
	updateContent: (content: string) => void;
	updateButtons: (buttons: ButtonConfig[]) => void;
	close: () => void;
	getInstance: () => ModalInstance | null;
	updateComponentProps: (props: Record<string, any>) => void;
}

const ModalService = {
	show(
		options2: ModalOptions | (($t: $t) => ModalOptions),
		$t?: $t,
	): { controller: ProgressController } {
		const container = document.createElement('div');
		document.body.appendChild(container);

		const options =
			typeof options2 === 'function'
				? (function () {
						if (!$t) {
							throw new Error('The configuration needs $t method!!!');
						}
						return options2($t);
					})()
				: options2;
		const visible = ref(true);
		const progress = ref(options.progress || 0);
		const customButtons = ref(options.buttons || []);
		const currentContent = ref(options.content || '');
		const componentProps = ref(options.componentProps || {});
		let modalInstance: ModalInstance | null = null;

		const controller: ProgressController = {
			updateProgress: (value: number) => {
				progress.value = Math.min(100, Math.max(0, value));
			},
			updateButtons: (buttons: ButtonConfig[]) => {
				customButtons.value = buttons.map((btn) => ({
					...btn,
					handler: () => btn.handler(undefined, modalInstance!),
				}));
			},
			updateContent: (content: string) => {
				currentContent.value = content;
			},
			updateComponentProps: (props: Record<string, any>) => {
				componentProps.value = { ...componentProps.value, ...props };
			},
			close: () => {
				visible.value = false;
				setTimeout(() => {
					app.unmount();
					container.remove();
				}, 300);
			},
			getInstance: () => modalInstance,
		};

		const app: App = createApp({
			setup(_, { expose }) {
				const methodsRef = ref<ModalInstance>();

				// 创建代理方法
				const exposedMethods = {
					handleConfirm: () => methodsRef.value?.handleConfirm?.(),
					handleCancel: () => methodsRef.value?.handleCancel?.(),
					close: () => methodsRef.value?.close?.(),
					updateComponentProps: (props: Record<string, any>) => {
						componentProps.value = { ...componentProps.value, ...props };
					},
				};

				expose({ getMethods: () => exposedMethods });

				return () =>
					h(Modal, {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						ref: (el: any) => {
							if (el) {
								methodsRef.value = {
									handleConfirm: el.handleConfirm,
									handleCancel: el.handleCancel,
									close: el.close,
									updateComponentProps: exposedMethods.updateComponentProps,
								};
								modalInstance = methodsRef.value; // 更新实例引用
							}
						},
						visible: visible.value,
						title: options.title,
						content: currentContent.value,
						icon: options.icon,
						fields: options.fields,
						modalWidth: options.width,
						showCancelButton: options.showCancelButton,
						showConfirmButton: options.showConfirmButton,
						confirmText: options.confirmText,
						cancelText: options.cancelText,
						closeOnClickMask: options.closeOnClickMask,
						onClose: options.onClose,
						validateOnChange: options.validateOnChange,
						showProgress: options.showProgress,
						progress: progress.value,
						customComponent: options.component,
						componentProps: componentProps.value,
						customSlots: options.slots,
						customButtons: customButtons.value.map((btn) => ({
							...btn,
							handler: () => btn.handler(undefined, modalInstance!), // 直接使用实例引用
						})),
						'onUpdate:visible': (val: boolean) => {
							if (!val) controller.close();
						},
						onConfirm: (values: string[]) => {
							options.onConfirm?.(values);
							controller.close();
						},
						onCancel: () => {
							options.onCancel?.();
							controller.close();
						},
						dangerous: options.dangerous
					});
			},
		});
		app.use(i18n);
		app.mount(container);
		return { controller };
	},
};

export default ModalService;
