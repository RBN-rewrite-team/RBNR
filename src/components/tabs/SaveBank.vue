<script lang="ts" setup>
import SaveBank from '../../core/save/SaveBank.json';
import { reactive } from 'vue';
import { loadFromString, save } from '@/core/save/index.ts';
import { player } from '@/core/save/index.ts';

interface SaveItem {
	title: string;
	uploader: string;
	'save-text': string;
}

interface Chapter {
	title: string;
	[key: string]: SaveItem | string;
}

const isExpanded = reactive<Record<string, boolean>>({});
for (let key in SaveBank) {
	isExpanded[key] = false;
}

const isSaveItem = (item: any): item is SaveItem => {
	return item && typeof item === 'object' && 'title' in item && 'uploader' in item;
};

const downloadSave = (saveText: string, title: string) => {
	const blob = new Blob([saveText], { type: 'text/plain' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `${title}.txt`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
};

const importSave = (saveText: string) => {
	if (confirm('确定要导入这个存档吗？当前进度将会被覆盖。')) {
		loadFromString(saveText, true);
		save();
		location.reload();
	}
};
</script>

<template>
	<div class="chapters-container">
		<div v-for="(chapter, chapterKey) in SaveBank" :key="chapterKey" class="chapter-item">
			<div
				class="chapter-header"
				@click="isExpanded[chapterKey] = !isExpanded[chapterKey]"
				:class="{ expanded: isExpanded[chapterKey] }"
			>
				<span class="chapter-title">{{ chapter.title }}</span>
				<span class="expand-icon">{{ isExpanded[chapterKey] ? '−' : '+' }}</span>
			</div>

			<div v-show="isExpanded[chapterKey]" class="saves-container">
				<div v-for="(item, itemKey) in chapter" :key="itemKey" class="save-item">
					<div v-if="isSaveItem(item)" class="save-content">
						<h3 class="save-title" v-html="item.title"></h3>
						<p class="save-uploader">上传者: {{ item.uploader }}</p>
						<div class="save-container">
							<button
								class="btn download-btn-btn"
								@click="
									downloadSave(
										item['save-text'],
										chapter.title + ' - ' + item.title,
									)
								"
							>
								下载存档
							</button>
							<button class="btn import-btn" @click="importSave(item['save-text'])">
								导入存档
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.chapters-container {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
	background-color: var(--app-background-color);
}

.chapter-item {
	margin-bottom: 12px;
	border: 1px solid var(--border-color);
	border-radius: 8px;
	overflow: hidden;
	background-color: var(--background-color);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chapter-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px 20px;
	cursor: pointer;
	transition: background-color 0.2s ease;
	color: var(--color);
}

.chapter-header:hover {
	background-color: var(--hover-color);
}

.chapter-header.expanded {
	border-bottom: 1px solid var(--border-color);
}

.chapter-title {
	font-weight: 600;
	font-size: 1.1rem;
}

.expand-icon {
	font-weight: bold;
	font-size: 1.2rem;
	width: 20px;
	height: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.saves-container {
	padding: 0 20px;
}

.save-item {
	padding: 16px 0;
	border-bottom: 1px solid var(--border-color);
}

.save-item:last-child {
	border-bottom: none;
}

.save-title {
	margin: 0 0 8px 0;
	font-size: 1rem;
	font-weight: 600;
}

.save-uploader {
	margin: 0 0 12px 0;
	color: var(--suptitle-color);
	font-size: 0.9rem;
}

.save-container {
	background-color: var(--app-background-color);
	padding: 12px;
	border-radius: 6px;
	border: 1px solid var(--border-color);
}

.save-text {
	margin: 0;
	font-size: 0.85rem;
	color: var(--color);
	word-break: break-all;
	line-height: 1.4;
}

.btn {
	padding: 10px 18px;
	border: none;
	border-radius: 6px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s ease;
	font-size: 0.95rem;
}

.download-btn {
	background-color: var(--background-color);
	color: var(--color);
	border: 1px solid var(--border-color);
}

.download-btn:hover {
	background-color: var(--hover-color);
}

.import-btn {
	background-color: var(--red);
	color: white;
}

.import-btn:hover {
	background-color: var(--red-hover-color);
	color: black;
}
</style>
