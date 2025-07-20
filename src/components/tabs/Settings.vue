<script setup lang="ts">
import { export_file, import_file, player, save } from '@/core/save';
import { UIHardReset } from '@/core/save/saveui';
import { notationNamesMap, notations } from '@/utils/format';
import { reverseUiOptions, themeDetailsMap, themes } from '@/utils/themes';
import { computed } from 'vue';
const validNotations = computed(() =>
	Object.values(notations).filter((v) => typeof v === 'number'),
);

const validThemes = computed(() => Object.values(themes).filter((v) => typeof v == 'number'));

// code...
</script>

<template>
	<div class="main" v-if="player.currentTab === 1" style="text-align: center">
		<h3>存档设置</h3>
		<div class="setting_button" @click="save()">手动保存</div>
		<div class="setting_button" @click="import_file()">导入存档</div>
		<div class="setting_button" @click="export_file()">导出存档</div>
		<div class="hard_reset" @click="UIHardReset">硬重置</div>
		<br />
		<div class="center_line" />
		<h3>记数法</h3>
		<button
			@click="player.options.notation = notation"
			v-for="notation in validNotations"
			class="setting_button"
		>
			{{ notationNamesMap.get(notation) }}
		</button>
		<br />
		<div class="center_line" />
		<h3>主题</h3>
		<button class="setting_button" @click="reverseUiOptions('color_inversion')">
			颜色{{ player.options.ui.otherwise['color_inversion'] ? '反转' : '正常' }}
		</button>
		<button class="setting_button" @click="reverseUiOptions('full_gray')">
			{{ player.options.ui.otherwise['full_gray'] ? '全灰度' : '正常颜色' }}
		</button>
		<button class="setting_button" @click="reverseUiOptions('blur')">
			{{ player.options.ui.otherwise['blur'] ? '模糊' : '清晰' }}
		</button>
		<button class="setting_button" @click="reverseUiOptions('sepia')">
			{{ player.options.ui.otherwise['sepia'] ? '旧相片开启' : '旧相片关闭' }}
		</button>
		<br />
		<button
			v-for="theme in validThemes"
			class="setting_button"
			@click="player.options.ui.theme = theme"
		>
			{{ themeDetailsMap.get(theme)?.name ?? 'unknown' }} {{ theme }}
		</button>
		<h3>界面</h3>
		<button
			class="setting_button"
			@click="player.options.ui.newsbar = !player.options.ui.newsbar"
		>
			{{ player.options.ui.newsbar ? '新闻栏开启' : '新闻栏关闭' }}
		</button>
		<button
			class="setting_button"
			@click="player.options.ui.titlebar = !player.options.ui.titlebar"
		>
			{{ player.options.ui.titlebar ? '标题栏开启' : '标题栏关闭' }}
		</button>
	</div>
	<!-- code... -->
</template>

<style scoped>
/* code... */
</style>
