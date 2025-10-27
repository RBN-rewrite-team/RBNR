<script setup lang="ts">
import { player } from '@/core/save';
import { Logarithm } from '../../core/exponention/logarithm';
import { unlockedPlots, viewedPlotLength } from '@/core/plot';
import { isTester } from '@/core/save/testing';
import { RETRIBUTION } from '@/core/post-nonrec/retribution';
import SubMenuObject from './SubMenuObject.vue';
import MenuObject from './MenuObject';
import { menus } from './menus';
</script>

<template>
	<div class="side">
		<div class="title_box" v-if="player.options.ui.titlebar" id="title_box">
			<div class="background">
				<div class="title">
					<div
						style="
							font-size: 24px;
							color: var(--color);
							text-shadow: var(--title-color) 1px 1px 2px;
						"
					>
						{{ player.pt.resetTimes.gte(1) ? '大数之路放置版' : '大数之路重制版' }}
					</div>
					<div style="font-size: 15px">Garden Beta</div>
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
