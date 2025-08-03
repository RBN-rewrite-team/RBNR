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
	<div class="main" v-if="player.currentTab === 1" align="center">
		<h3>存档设置</h3>
		<div class="setting_button" @click="save()">手动保存</div>
		<div class="setting_button" @click="import_file()">导入存档</div>
		<div class="setting_button" @click="export_file()">导出存档</div>
		<div class="hard_reset" @click="UIHardReset">硬重置</div>
		<br />
		<div v-if="player.singularity.stage < 1"><div class="center_line" />
		<h3>记数法</h3>
		<button
			@click="player.options.notation = notation"
			v-for="notation in validNotations"
			class="setting_button"
		>
			{{ notationNamesMap.get(notation) }}
		</button></div>
		<br />
		<div class="center_line" />
		<h3>主题</h3>
		<button class="setting_button" @click="reverseUiOptions('color_inversion')">
			颜色反转：{{ player.options.ui.otherwise['color_inversion'] ? '开' : '关' }}
		</button>
		<button class="setting_button" @click="reverseUiOptions('full_gray')">
			全灰度：{{ player.options.ui.otherwise['full_gray'] ? '开' : '关' }}
		</button>
		<button class="setting_button" @click="reverseUiOptions('blur')">
			模糊：{{ player.options.ui.otherwise['blur'] ? '开' : '关' }}
		</button>
		<button class="setting_button" @click="reverseUiOptions('sepia')">
			旧相片：{{ player.options.ui.otherwise['sepia'] ? '开' : '关' }}
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
			新闻栏：{{ player.options.ui.newsbar ? '开' : '关' }}
		</button>
		<button
			class="setting_button"
			@click="player.options.ui.titlebar = !player.options.ui.titlebar"
		>
			标题栏：{{ player.options.ui.titlebar ? '开' : '关' }}
		</button>
	</div>
	<!-- code... -->
</template>

<style scoped>
/* code... */
</style>
