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
					<h3>{{ title }}</h3>
				</div>

				<div class="modal-body">
					<slot>
						<div v-if="content" class="modal-content" v-html="content"></div>
						<div v-if="showProgress" class="progress-container">
							<div class="progress-bar">
								<div
									class="progress-inner"
									:style="{ width: progress + '%' }"
								></div>
							</div>
							<div class="progress-text">{{ progress.toFixed(2) }}%</div>
						</div>

						<!-- 正常模式 -->
						<template v-else>
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
											'input-error':
												errors[index] && inputValues[index].touched,
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
import { ref, computed, watch } from 'vue';
import type { Component } from 'vue';
import type { FieldConfig, ButtonConfig } from '../utils/Modal';

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
});

const emit = defineEmits(['update:visible', 'confirm', 'cancel', 'update:values']);

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
});
</script>

<style scoped lang="scss">
.modal-mask {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.7);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
}

.modal-container {
	background-color: #fdfdfd;
	border: 2px solid #c9c9c9;
	border-radius: 8px;
	font-size: 17px;
	line-height: 25px;
	text-align: center;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	max-width: 70%;
	max-height: 90vh;
	overflow-y: auto;
}

.modal-header {
	padding: 5px;
	padding-left: 20px;
	border-bottom: 1px solid #aaa;
	display: flex;
	align-items: center;
	gap: 12px;
}

.modal-icon {
	color: #409eff;
}

.modal-body {
	padding: 20px;
}

.input-group {
	margin-bottom: 16px;
}

.modal-input {
	width: 90%;
	padding: 8px 12px;
	background: #2a2a2a;
	border: 1px solid #444;
	border-radius: 4px;
	color: #fff;
	font-size: 14px;
	transition: border-color 0.2s;
}

.modal-input:focus {
	border-color: #409eff;
	outline: none;
}

.input-error {
	border-color: #f56c6c !important;
}

.error-message {
	color: #f56c6c;
	font-size: 12px;
	margin-top: 4px;
}

.modal-footer {
	padding: 16px 20px;
	border-top: 1px solid #333;
	display: flex;
	justify-content: flex-end;
	gap: 8px;
}

.confirm-btn {
	background: #409eff;
	color: white;
	border: none;
	border: 1px solid #207edd;

	&:hover {
		background: #66b1ff;
	}

	&:disabled {
		background: #2a2a2a;
		color: #666;
		cursor: not-allowed;
	}
}

.cancel-btn {
	background: #2a2a2a;
	color: #ccc;
	border: 1px solid #444;

	&:hover {
		border-color: #666;
	}
}

.progress-container {
	padding: 20px 0;
}

.progress-bar {
	height: 6px;
	background: #333;
	border-radius: 3px;
	overflow: hidden;
}

.progress-inner {
	height: 100%;
	background: #409eff;
	transition: width 0.3s ease;
}

.progress-text {
	text-align: center;
	color: #888;
	font-size: 14px;
	margin-top: 8px;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-slide-enter-from,
.modal-slide-leave-to {
	opacity: 0;
	transform: translateY(-20px);
}

.danger-btn {
	background: #f56c6c !important;
	color: white !important;
	border: none !important;
}

.danger-btn:hover {
	background: #f78989 !important;
}

.danger-btn:disabled {
	background: #5a2a2a !important;
	color: #a0a0a0 !important;
}
button {
	padding: 5px;
	border-radius: 4px;
}
</style>
