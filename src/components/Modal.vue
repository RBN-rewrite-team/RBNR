<template>
	<transition name="modal-slide">
		<div v-if="visible" class="modal-mask" @click.self="handleMaskClick">
			<div class="modal-container" :style="{ width: modalWidth }">
				<div class="modal-header">
					<slot name="icon">
						<div v-if="icon" class="modal-icon">
							<component :is="icon" />
						</div>
					</slot>
					<span class="modal-title">{{ title }}</span>
				</div>

				<div class="modal-body">
					<slot>
						<!-- 自定义组件模式 -->
						<div v-if="customComponent" class="custom-component-container">
							<component
								:is="customComponent"
								v-bind="componentProps"
								@update:props="handleComponentUpdate"
							>
								<!-- 渲染自定义插槽 -->
								<template
									v-for="(slotContent, slotName) in customSlots"
									#[slotName]
								>
									<component :is="slotContent" />
								</template>
							</component>
						</div>

						<!-- 正常模式 -->
						<template v-if="content">
							<div class="modal-content" v-html="content"></div>
						</template>

						<!-- 进度条模式 -->
						<ProgressBar v-if="showProgress" :progress="progress"></ProgressBar>

						<template v-for="(field, index) in fields" :key="index">
							<div class="input-group">
								<label v-if="field.label">{{ field.label }}</label
								><br />
								<component
									:is="field.type === 'textarea' ? 'textarea' : 'input'"
									v-model="inputValues[index].value"
									:type="getInputType(field.type)"
									:placeholder="field.placeholder"
									:rows="field.rows"
									class="modal-input"
									:class="{
										'input-error': errors[index] && inputValues[index].touched,
									}"
									@input="updateValue(index, $event.target.value)"
									@blur="handleBlur(index)"
									@keyup.enter="handleConfirm"
								/>
								<div
									v-if="errors[index] && inputValues[index].touched"
									class="error-message"
								>
									{{ errors[index] }}
								</div>
							</div>
						</template>
					</slot>
				</div>
				<div class="modal-footer">
					<template v-for="(btn, index) in processedButtons" :key="'btn-' + index">
						<button
							:class="btn.class"
							@click="btn.handler"
							:disabled="btn.disabled || loading"
						>
							{{ btn.text }}
						</button>
					</template>
				</div>
			</div>
		</div>
	</transition>
</template>

<script lang="ts" setup>
import { ref, computed, watch, type Component, type VNode, onMounted } from 'vue';
import type { FieldConfig, ButtonConfig } from '../utils/Modal';
import ProgressBar from './ProgressBar';

interface Props {
	title?: string;
	content?: string;
	visible: boolean;
	icon?: Component;
	fields?: FieldConfig[];
	showCancelButton?: boolean;
	showConfirmButton?: boolean;
	cancelText?: string;
	confirmText?: string;
	modalWidth?: string;
	closeOnClickMask?: boolean;
	validateOnChange?: boolean;
	loading?: boolean;
	customButtons?: ButtonConfig[];
	showProgress?: boolean;
	progress?: number;
	onClose?: () => void;
	// 新增：支持自定义组件
	customComponent?: Component;
	componentProps?: Record<string, any>;
	customSlots?: Record<string, () => VNode | VNode[]>;
}
const props = withDefaults(defineProps<Props>(), {
	title: '提示',
	content: '',
	fields: () => [],
	showCancelButton: true,
	showConfirmButton: true,
	cancelText: '取消',
	confirmText: '确定',
	modalWidth: '500px',
	closeOnClickMask: true,
	validateOnChange: true,
	loading: false,
	customButtons: () => [],
	showProgress: false,
	progress: 0,
	onClose: () => {},
	customComponent: undefined,
	componentProps: () => ({}),
	customSlots: () => ({}),
});

const emit = defineEmits([
	'update:visible',
	'confirm',
	'cancel',
	'update:values',
	'update:componentProps',
]);

// 响应式数据
const inputValues = ref(
	props.fields.map((field) => ({
		value: field.defaultValue || '',
		touched: false,
	})),
);
const errors = ref<string[]>([]);
// 计算属性
const hasErrors = computed(() => errors.value.some(Boolean));
const processedButtons = computed(() => {
	const buttons: ButtonConfig[] = [...props.customButtons];

	if (props.showCancelButton && !props.showProgress) {
		buttons.push({
			text: props.cancelText,
			handler: handleCancel,
			class: 'cancel-btn',
			disabled: props.loading,
		});
	}

	if (!props.showProgress && props.showConfirmButton) {
		buttons.push({
			text: props.confirmText,
			handler: handleConfirm,
			class: 'confirm-btn',
			disabled: hasErrors.value || props.loading,
		});
	}

	return buttons;
});

// 方法实现
const getInputType = (type?: string) => {
	const types = ['text', 'password', 'email', 'number', 'tel'];
	return type && types.includes(type) ? type : 'text';
};

const validateFields = (): boolean => {
	let isValid = true;
	errors.value = props.fields.map((field, index) => {
		const value = inputValues.value[index]?.value || '';
		let error = '';

		if (field.required && !value.trim()) {
			error = field.errorMessage || '此字段为必填项';
		} else if (field.validation) {
			if (typeof field.validation === 'function' && !field.validation(value)) {
				error = field.errorMessage || '输入内容无效';
			} else if (field.validation instanceof RegExp && !field.validation.test(value)) {
				error = field.errorMessage || '格式不正确';
			}
		}

		if (error) isValid = false;
		return error;
	});
	return isValid;
};

const updateValue = (index: number, value: string) => {
	const newValues = [...inputValues.value];
	newValues[index] = {
		...newValues[index],
		value,
		touched: true,
	};
	inputValues.value = newValues;
};

const handleBlur = (index: number) => {
	inputValues.value[index].touched = true;
	validateFields();
};

const handleComponentUpdate = (newProps: Record<string, any>) => {
	emit('update:componentProps', newProps);
};

const handleConfirm = async () => {
	inputValues.value.forEach((_, index) => {
		inputValues.value[index].touched = true;
	});

	if (!validateFields()) return;
	emit(
		'confirm',
		inputValues.value.map((item) => item.value),
	);
};

const handleCancel = () => {
	emit('cancel');
	close();
};

const handleMaskClick = () => {
	if (props.closeOnClickMask) close();
};

const close = () => {
	emit('update:visible', false);
	props?.onClose?.();
};

// 监听器
watch(
	() => inputValues.value.map((item) => item.value),
	(newValues) => {
		emit('update:values', newValues);
		if (props.validateOnChange) validateFields();
	},
	{ deep: true },
);

defineExpose({
	handleConfirm,
	handleCancel,
	close,
});
</script>

<style scoped lang="scss">
button {
	padding: 5px;
	border-radius: 4px;
}
</style>
