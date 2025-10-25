<script setup lang="ts">
import { player } from '@/core/save';
import { Logarithm } from '../../core/exponention/logarithm';
import { unlockedPlots, viewedPlotLength } from '@/core/plot';
import { isTester } from '@/core/save/testing';
import { RETRIBUTION } from '@/core/post-nonrec/retribution';
import SubMenuObject from './SubMenuObject.vue';
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
					<div style="font-size: 15px">Retribution / PT Gamma</div>
				</div>
			</div>
		</div>
		<div class="menu" id="menu">
			<div class="background" style="overflow: auto">
				<div class="main">
					<SubMenuObject :tab="1225" text="地下城" />

					<SubMenuObject
						:tab="167"
						text="自动机"
						v-if="
							player.timeshard.unlAuto && (player.firstResetBit & 0b10000) == 0b10000
						"
					/>
					<template v-if="player.singularity.stage < 11">
						<div class="menu1">后继</div>
						<div class="menu_line"></div>
						<SubMenuObject :tab="0" text="后继" />
					</template>
					<template v-if="player.upgrades[13] && player.singularity.stage < 10">
						<div class="menu1">加法</div>
						<div class="menu_line"></div>
						<SubMenuObject :tab="2" text="加法" />
					</template>
					<template v-if="player.upgrades[26] && player.singularity.stage < 9">
						<div class="menu1">乘法</div>
						<div class="menu_line"></div>
						<SubMenuObject :tab="4" text="乘法" />
						<SubMenuObject
							:tab="5"
							text="质因数"
							v-if="player.firstResetBit & 0b10 && player.singularity.stage < 7"
						/>

						<SubMenuObject
							:tab="6"
							text="数论研究"
							v-if="player.upgrades[35] && player.singularity.stage < 8"
						/>
						<SubMenuObject
							:tab="8"
							text="乘法挑战"
							v-if="player.singularity.stage < 6 && player.upgrades[39]"
						/>
					</template>
					<template v-if="player.firstResetBit & 0b100 && player.singularity.stage < 9">
						<div class="menu1">指数</div>
						<div class="menu_line"></div>
						<SubMenuObject :tab="9" text="指数升级" />
						<SubMenuObject :tab="10" text="棋盘" v-if="player.upgrades[47]" />
						<SubMenuObject :tab="12" text="对数运算" v-if="player.milestones.cb5" />
						<SubMenuObject
							:tab="13"
							text="对数膨胀"
							v-if="player.singularity.stage < 1 && player.milestones.log_G"
						/>
						<SubMenuObject
							:tab="14"
							text="奇点生成器"
							v-if="player.singularity.enabled || player.milestones.dil_7"
						/>
					</template>
					<template v-if="player.singularity.stage >= 4">
						<div class="menu1">
							<span v-if="player.singularity.stage == 4">???</span>
							<span v-else-if="player.singularity.stage <= 9">奇点</span>
							<span v-else>序数</span>
						</div>
						<div class="menu_line"></div>
						<SubMenuObject :tab="14" text="奇点生成器" />
						<SubMenuObject
							:tab="15"
							text="序数"
							v-if="player.firstResetBit & 0b1000 && player.retribution == 0"
						/>
						<SubMenuObject :tab="6" text="数论研究" v-if="player.upgrades[58]" />
						<SubMenuObject
							:tab="17"
							text="加速器"
							v-if="player.upgrades[59] && player.retribution == 0"
						/>
					</template>
					<template v-if="player.upgrades[517]">
						<div class="menu1">九头蛇</div>
						<div class="menu_line"></div>
						<SubMenuObject :tab="19" text="九头蛇引擎" />
						<SubMenuObject :tab="27" text="Y序列" v-if="player.retribution >= 1" />
						<SubMenuObject :tab="20" text="稀释" v-if="player.upgrades['69R']" />
						<SubMenuObject
							:tab="28"
							:text="RETRIBUTION.name()"
							v-if="player.upgrades['U6R18']"
						/>
					</template>
					<template v-if="(player.firstResetBit & 0b10000) == 0b10000">
						<div class="menu1">非递归</div>
						<div class="menu_line"></div>
						<SubMenuObject :tab="21" text="非递归里程碑" />
						<SubMenuObject :tab="23" text="能量因素" />
						<SubMenuObject :tab="24" text="非递归研究树" />
						<SubMenuObject :tab="22" text="非递归挑战" />
						<SubMenuObject
							:tab="25"
							text="非递归升级"
							v-if="player.milestones.nonrec_18"
						/>
						<SubMenuObject
							:tab="26"
							text="UNOCF"
							v-if="
								(player.firstResetBit & 0b10000) == 0b10000 &&
								player.milestones.nonrec_19
							"
						/>
					</template>
					<template
						v-if="player.retribution >= 1 && player.nonrecu.studies_bought.includes(30)"
					>
						<div class="menu1">证明论</div>
						<div class="menu_line"></div>
						<SubMenuObject :tab="29" text="解析" />
						<SubMenuObject :tab="30" text="解析里程碑" />
					</template>

					<div class="menu1">杂项</div>
					<div class="menu_line"></div>
					<SubMenuObject :tab="1" text="设置" />
					<SubMenuObject :tab="3" text="关于游戏" />
					<div
						class="menu2"
						:class="{ focus: player.currentTab == 200 }"
						@click="player.currentTab = 200"
					>
						剧情<span
							class="menu2-newcont"
							v-if="unlockedPlots() - viewedPlotLength() > 0"
							>+{{ unlockedPlots() - viewedPlotLength() }}</span
						>
					</div>
					<SubMenuObject :tab="7" text="统计" />
					<SubMenuObject :tab="11" text="成就" />

					<SubMenuObject :tab="16" text="帮助" v-if="player.firstResetBit & 0b1000" />
					<SubMenuObject :tab="18" text="时间碎片" />
				</div>
			</div>
		</div>
	</div>
</template>
