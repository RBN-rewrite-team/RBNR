<script setup lang="ts">
import { temp } from '@/core/temp-data';
import { plotTitles, unlockedPlots } from '@/core/plot';
import { computed, onMounted, ref } from 'vue';
import { component as convertTextToComponent } from '../help/text-to-component-convert';
import { zeroToHundred } from '@/utils/zeroToHundred';

import type { $t } from '@/utils/types';
import { useI18n } from 'vue-i18n';

const $t = useI18n().t;

function enterPlot(i: number) {
	console.log(i);
	if (unlockedPlots() >= i) {
		temp.plotdisplay = i;
	}
}

// 数据源 - 字符串列表
const options = computed(function (): number[] {
	return zeroToHundred.slice(0, unlockedPlots()) as unknown as number[];
});

let actualIndex = 0;
// 选择的结果
const selectedValue = ref(-1);

// 下拉框状态
const isOpen = ref(false);

// 搜索查询
const searchQuery = ref('');

// 过滤后的选项
const filteredOptions = computed(() => {
	if (!searchQuery.value) {
		return options.value;
	}
	return options.value.filter((option: number) =>
		$t(`plot.${option}`).toLowerCase().includes(searchQuery.value.toLowerCase()),
	);
});

// 切换下拉框显示/隐藏
const toggleDropdown = () => {
	isOpen.value = !isOpen.value;
	if (isOpen.value) {
		searchQuery.value = '';
	}
};

// 选择选项
const selectOption = (option: number) => {
	selectedValue.value = option;
	isOpen.value = false;
	searchQuery.value = '';
	actualIndex = option;
};

// 点击外部关闭下拉框
const handleClickOutside = (event: any) => {
	const selectContainer = document.querySelector('.select-container');
	if (selectContainer && !selectContainer.contains(event.target)) {
		isOpen.value = false;
	}
};

onMounted(() => {
	document.addEventListener('click', handleClickOutside);
});
</script>

<template>
	<div class="main">
		<h1>{{ $t('plot.title') }}</h1>
		<div>
			<div class="select-container">
				<div class="select-header" :class="{ open: isOpen }" @click="toggleDropdown">
					<span v-if="selectedValue == -1" class="placeholder">{{
						$t('plot.select')
					}}</span>
					<span v-else class="selected-value"
						><convertTextToComponent :text="$t('plot.' + selectedValue)"
					/></span>
					<span class="arrow" :class="{ open: isOpen }">▼</span>
				</div>

				<div class="dropdown" :class="{ open: isOpen }">
					<input
						type="text"
						class="search-input"
						:placeholder="$t('plot.search')"
						v-model="searchQuery"
					/>
					<ul class="option-list">
						<li
							v-for="option in filteredOptions"
							:key="option"
							class="option"
							:class="{
								selected: $t('plot.' + option) === $t('plot.' + selectedValue),
							}"
							@click="selectOption(option)"
						>
							<convertTextToComponent :text="$t('plot.' + option)" />
						</li>
						<li v-if="filteredOptions.length === 0" class="no-options">
							{{ $t('plot.couldntfound') }}
						</li>
					</ul>
				</div>
			</div>
			<button
				class="clickable_button"
				@click="() => enterPlot(actualIndex + 1)"
				style="margin: auto"
			>
				{{ $t('plot.enter') }}
			</button>
		</div>
	</div>
</template>

<style lang="css" scoped>
.select-container {
	position: relative;
	margin-bottom: 30px;
	margin: auto;
	width: 50%;
}

.select-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 14px 16px;
	border: 2px solid var(--hover-color);
	border-radius: 10px;
	cursor: pointer;
	background: var(--background-color);
	transition: all 0.3s ease;
}

.select-header:hover {
	border-color: #a777e3;
}

.select-header.open {
	border-color: #6e8efb;
	box-shadow: 0 0 0 3px rgba(110, 142, 251, 0.2);
}

.placeholder {
	color: #999;
}

.selected-value {
	color: var(--color);
	font-weight: 500;
}

.arrow {
	transition: transform 0.3s ease;
}

.arrow.open {
	transform: rotate(180deg);
}

.dropdown {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: var(--background-color);
	border: 1px solid var(--hover-color);
	border-radius: 10px;
	margin-top: 5px;
	box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
	z-index: 10;
	max-height: 250px;
	overflow-y: auto;
	display: none;
}

.dropdown.open {
	display: block;
}

.search-input {
	width: 100%;
	padding: 12px 16px;
	border: none;
	border-bottom: 1px solid var(--hover-color);
	outline: none;
	font-size: 16px;
	border-radius: 10px 10px 0 0;
	background-color: var(--background-color);
	color: var(--color);
}

.option-list {
	list-style: none;
}

.option {
	padding: 12px 16px;
	cursor: pointer;
	transition: background 0.2s;
	border-bottom: 1px solid var(--background-color);
	text-align: left;
}

.option:hover {
	background: var(--app-background-color);
}

.option.selected {
	background: var(--hover-color);
	color: #6e8efb;
	font-weight: 500;
}
</style>
