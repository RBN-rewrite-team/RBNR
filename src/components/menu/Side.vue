<script setup lang="ts">
import { player } from '@/core/save';
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
						{{
							player.pt.resetTimes.gte(1) ? $t('title.idlen') : $t('title.rewritten')
						}}
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
