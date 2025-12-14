<script setup lang="ts">
import { player } from '@/core/save';
import MenuObject from './MenuObject';
import { menus } from './menus';
import { useI18n } from 'vue-i18n';
const use = useI18n();
const $t = use.t;
function title() {
	return player.pt.resetTimes.gte(1) || player.retribution >= 2
		? $t('title.idlen')
		: $t('title.rewritten');
}
function titleStyle() {
	const size = use.locale.value == 'zh-CN' ? 24 : 16;
	return {
		'font-size': size + 'px',
		color: 'var(--color)',
		'text-shadow': 'var(--title-color) 1px 1px 2px',
	};
}
</script>

<template>
	<div class="side">
		<div class="title_box" v-if="player.options.ui.titlebar" id="title_box">
			<div class="background">
				<div class="title">
					<div :style="titleStyle()">
						{{ title() }}
					</div>
					<div style="font-size: 15px">{{ $t('title.version') }}</div>
				</div>
			</div>
		</div>
		<div class="menu" id="menu">
			<div class="background" style="overflow: auto">
				<div class="main">
					<template v-for="menu in menus">
						<MenuObject :menu="menu" />
					</template>
				</div>
			</div>
		</div>
	</div>
</template>
