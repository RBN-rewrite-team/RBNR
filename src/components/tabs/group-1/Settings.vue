<script setup lang="ts">
import { export_file, import_file, player, save } from '@/core/save';
import { UIHardReset, UIChangeSave, UIEnterTesting } from '@/core/save/saveui';
import { notationNamesMap, notations } from '@/utils/format';
import { reverseUiOptions, themeDetailsMap, themes } from '@/utils/themes';
import { computed } from 'vue';
import { isTester } from '@/core/save/testing.ts';
import ModalService from '@/utils/Modal';
import fontUI from '@/core/save/fontUI';
import { setMusic as incMusic, MUSIC_TEXT, setMusicUrlAndPlay } from '@/core/music';
import CenterLine from '@/components/ui/CenterLine.vue';
import { openSetLangModel } from '@/components/i18nUI';
import { useI18n } from 'vue-i18n';
import type { $t } from '@/utils/types';
import { i18n } from '@/utils/i18n';
import { openedAutosave } from '@/core/game-loop';
import { useUpdate } from '@/lib/useUpdate';

const $t = useI18n().t;
const validNotations = computed(() =>
	Object.values(notations).filter((v) => typeof v === 'number'),
);

const validThemes = computed(() => Object.values(themes).filter((v) => typeof v == 'number'));
const setFontUI = () =>
	ModalService.show(($t: $t) => ({ title: $t('modal.font2'), component: fontUI }), $t);

function b() {
	return i18n.global.locale.value == 'zh-CN';
}
const q = useUpdate(() => openedAutosave());
</script>

<template>
	<div class="main" v-if="player.currentTab === 1" align="center">
		<h3>{{ $t('set.title.saveset') }}</h3>
		<div>
			{{
				$t('set.status', {
					label: $t('set.autosave'),
					status: $t(q ? 'set.status.on' : 'set.status.off'),
				})
			}}
		</div>
		<div>
			<div class="setting_button" @click="save()">{{ $t('set.save') }}</div>
			<div class="setting_button" @click="import_file()">{{ $t('set.import') }}</div>
			<div class="setting_button" @click="export_file()">{{ $t('set.export') }}</div>
			<div class="hard_reset" @click="() => UIHardReset()">{{ $t('set.hardreset') }}</div>
		</div>
		<div>
			<div class="setting_button" @click="() => UIChangeSave($t)">
				{{ $t('set.saveslot') }}
			</div>
			<div class="setting_button" @click="() => UIEnterTesting($t)">{{ $t('set.beta') }}</div>
			<div class="setting_button" style="opacity: 0.5">
				{{ /*$t('set.gamma')*/ $t('set.gamma.unabled') }}
			</div>
			<button
				class="setting_button"
				@click="player.options.allowOffline = !player.options.allowOffline"
			>
				{{
					$t('set.status', {
						label: $t('set.offline'),
						status: $t(
							player.options.allowOffline ? 'set.status.on' : 'set.status.off',
						),
					})
				}}
			</button>
			<button class="setting_button" @click="player.currentTab = 300">
				{{ $t('set.savebank') }}
			</button>
			<button class="setting_button" @click="() => openSetLangModel($t)">
				{{ $t('set.setlang') }}
			</button>
		</div>
		<span v-if="isTester()"><br />{{ $t('set.enteredbeta') }}</span>
		<span v-if="player.options.gammaTest"><br />{{ $t('set.enteredgamma') }}</span>

		<br />
		<div v-if="player.singularity.stage < 1">
			<CenterLine />
			<h3>{{ $t('set.title.notations') }}</h3>
			<button
				@click="player.options.notation = notation"
				v-for="notation in validNotations"
				class="setting_button"
			>
				{{ $t(`set.notation.${notation}`) }}
			</button>
		</div>
		<br />
		<CenterLine />
		<h3>{{ $t('set.title.theme') }}</h3>
		<button class="setting_button" @click="reverseUiOptions('color_inversion')">
			{{
				$t('set.status', {
					label: $t('set.colorinverse'),
					status: $t(
						player.options.ui.otherwise['color_inversion']
							? 'set.status.on'
							: 'set.status.off',
					),
				})
			}}
		</button>
		<button class="setting_button" @click="reverseUiOptions('full_gray')">
			{{
				$t('set.status', {
					label: $t('set.grey'),
					status: $t(
						player.options.ui.otherwise['full_gray']
							? 'set.status.on'
							: 'set.status.off',
					),
				})
			}}
		</button>
		<button class="setting_button" @click="reverseUiOptions('blur')">
			{{
				$t('set.status', {
					label: $t('set.blur'),
					status: $t(
						player.options.ui.otherwise['blur'] ? 'set.status.on' : 'set.status.off',
					),
				})
			}}
		</button>
		<button class="setting_button" @click="reverseUiOptions('sepia')">
			{{
				$t('set.status', {
					label: $t('set.oldalbum'),
					status: $t(
						player.options.ui.otherwise['sepia'] ? 'set.status.on' : 'set.status.off',
					),
				})
			}}
		</button>
		<br />
		<button
			v-for="theme in validThemes"
			class="setting_button"
			@click="player.options.ui.theme = theme"
		>
			{{ $t(`set.theme.${theme}`) }} {{ theme }}
		</button>
		<br />
		<button class="setting_button" @click="setFontUI">{{ $t('set.setfont') }}</button>
		<br />
		<br />
		<CenterLine />
		<h3>{{ $t('set.title.ui') }}</h3>
		<button
			class="setting_button"
			@click="player.options.ui.newsbar = !player.options.ui.newsbar"
		>
			{{
				$t('set.status', {
					label: $t('set.news'),
					status: $t(player.options.ui.newsbar ? 'set.status.on' : 'set.status.off'),
				})
			}}
		</button>
		<button
			class="setting_button"
			@click="player.options.ui.titlebar = !player.options.ui.titlebar"
		>
			{{
				$t('set.status', {
					label: $t('set.title'),
					status: $t(player.options.ui.titlebar ? 'set.status.on' : 'set.status.off'),
				})
			}}
		</button>
		<button
			class="setting_button"
			@click="player.options.isGuoGao = !player.options.isGuoGao"
			v-if="b()"
		>
			{{
				$t('set.status', {
					label: $t('set.guogao'),
					status: $t(player.options.isGuoGao ? 'set.status.on' : 'set.status.off'),
				})
			}}
		</button>
		<button
			class="setting_button"
			@click="player.options.ui.upgnewui = !player.options.ui.upgnewui"
		>
			{{
				$t('set.status', {
					label: $t('set.upgnewui'),
					status: $t(player.options.ui.upgnewui ? 'set.status.on' : 'set.status.off'),
				})
			}}
		</button>
		<br />
		<CenterLine />
		<button class="setting_button" @click="incMusic">
			{{
				$t('set.status', {
					label: $t('set.music'),
					status: MUSIC_TEXT[player.options.music],
				})
			}}
		</button>
		<button class="setting_button" @click="setMusicUrlAndPlay">{{ $t('set.musicurl') }}</button>
	</div>
	<!-- code... -->
</template>

<style scoped>
/* code... */
</style>
