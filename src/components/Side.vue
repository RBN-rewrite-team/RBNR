<script setup lang="ts">
import { player } from '@/core/save';
</script>

<template>
	<div class="side">
		<div class="title_box" v-if="player.options.ui.titlebar">
			<div class="background">
				<div class="title">
					<div
						style="
							font-size: 24px;
							color: var(--color);
							text-shadow: var(--title-color) 1px 1px 2px;
						"
					>
						大数之路重制版
					</div>
					<div style="font-size: 20px">v0.3</div>
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
						<div
							class="menu2"
							:class="{ focus: player.currentTab == 6 }"
							@click="player.currentTab = 6"
							v-if="player.upgrades[35]"
						>
							数论研究
						</div>
						<div
							class="menu2"
							:class="{ focus: player.currentTab == 8 }"
							@click="player.currentTab = 8"
							v-if="player.upgrades[39]"
						>
							乘法挑战
						</div>
					</template>
					<template v-if="player.firstResetBit & 0b100">
						<div class="menu1">指数</div>
						<div class="menu_line"></div>
						<div
							class="menu2"
							:class="{ focus: player.currentTab == 9 }"
							@click="player.currentTab = 9"
						>
							指数升级
						</div>
						<div
							class="menu2"
							:class="{ focus: player.currentTab == 10 }"
							@click="player.currentTab = 10"
						>
							棋盘
						</div>
						<div
							class="menu2"
							:class="{ focus: player.currentTab == 12}"
							@click="player.currentTab = 12"
							v-if="player.milestones.cb5"
						>
							对数运算
						</div>
					</template>
					<div class="menu1">杂项</div>
					<div class="menu_line"></div>
					<div
						class="menu2"
						:class="{ focus: player.currentTab == 1 }"
						@click="player.currentTab = 1"
					>
						设置
					</div>
					<div
						class="menu2"
						:class="{ focus: player.currentTab == 3 }"
						@click="player.currentTab = 3"
					>
						关于游戏
					</div>
					<div
						class="menu2"
						:class="{ focus: player.currentTab == 7 }"
						@click="player.currentTab = 7"
					>
						统计
					</div>
					<div
						class="menu2"
						:class="{ focus: player.currentTab == 11 }"
						@click="player.currentTab = 11"
					>
						成就
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
