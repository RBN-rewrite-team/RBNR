<script setup lang="ts">
import { player } from '@/core/save';
</script>

<template>
	<div class="side">
		<div class="title_box">
			<div class="background">
				<div class="title">
					<div style="font-size: 24px; color: #000000; text-shadow: #8e8e8e 1px 1px 2px">
						大数之路重制版
					</div>
					<div style="font-size: 20px">v0.1.1</div>
				</div>
			</div>
		</div>
		<div class="menu">
			<div class="background" style="overflow: auto">
				<div class="main">
					<div class="menu1">后继</div>
					<div class="menu_line"></div>
					<div
						class="menu2"
						:class="{ focus: player.currentTab == 0 }"
						@click="player.currentTab = 0"
					>
						后继
					</div>
					<template v-if="player.upgrades[13]">
						<div class="menu1">加法</div>
						<div class="menu_line"></div>
						<div
							class="menu2"
							:class="{ focus: player.currentTab == 2 }"
							@click="player.currentTab = 2"
						>
							加法
						</div>
					</template>
					<template v-if="player.upgrades[26]">
						<div class="menu1">乘法</div>
						<div class="menu_line"></div>
						<div
							class="menu2"
							:class="{ focus: player.currentTab == 4 }"
							@click="player.currentTab = 4"
						>
							乘法
						</div>
						<div
							class="menu2"
							:class="{ focus: player.currentTab == 5 }"
							@click="player.currentTab = 5"
							v-if="player.firstResetBit & 0b10"
						>
							质因数
						</div>
					</template>
					<div class="menu1">杂项</div>
					<div class="menu_line"></div>
					<div
						class="menu2"
						:class="{ focus: player.currentTab == 1 }"
						@click="player.currentTab = 1"
					>
						存档
					</div>
					<div
						class="menu2"
						:class="{ focus: player.currentTab == 3 }"
						@click="player.currentTab = 3"
					>
						关于游戏
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
