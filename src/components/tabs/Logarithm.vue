<script setup lang="ts">
import { Logarithm } from '@/core/exponention/logarithm';
import TDBuyable from '../TDBuyable.vue';
import { format, formatGain, formatTime } from '@/utils/format';
import { player } from '@/core/save';
import ObserveButton from '../ObserveButton.vue';
</script>

<template>
	<div class="main">
		<p style="color: grey; table-align: center">
			对数的发现，因其节省劳力而延长了天文学家的寿命。——拉普拉斯
		</p>
		<p>
			你有
			<b style="color: rgb(127, 127, 255); font-size: 25px">
				{{ format(Logarithm.logarithm.observe_datas) }}
			</b>
			观测数据，
		</p>
		<p>
			你有
			<b style="color: rgb(127, 127, 255); font-size: 25px">
				{{ format(Logarithm.logarithm.calculate_datas) }}
			</b>
			计算数据，
		</p>
		<div>
			<p v-for="astr in Object.entries(player.exponention.logarithm.astronomers)">
				天文学家 {{ astr[0] }}: 工作时长 {{ formatTime(astr[1].life) }}
				{{
					formatGain(
						Logarithm.logarithm.calculate_datas,
						Logarithm.astronomerProduce(Number(astr[0])),
						'计算数据',
					)
				}}
			</p>
		</div>
		<p>1 观测数据 -> {{ format(Logarithm.observeDataConvert()) }} 计算数据</p>
		<table align="center">
			<tbody>
				<tr>
					<TDBuyable bylid="lgr_emp" />
					<TDBuyable bylid="lgr_impr" />
				</tr>
			</tbody>
		</table>
		<div align="center" style="margin-top: 100px">
			<div @click="Logarithm.observe"><ObserveButton>观测</ObserveButton></div>
			<div @click="Logarithm.observeConvert">
				<ObserveButton style="font-size: 15px">使用对数表进行计算</ObserveButton>
			</div>
		</div>
		<div class="phys_law">
			<h1>定律 1</h1>
			行星绕太阳运行的轨道是椭圆，太阳位于椭圆的一个焦点上。
			<div class="requirement">需求： 2000 计算数据</div>
			<div class="effect">
				提升10x运算速度及5x观测速度，并减少天文学家、对数表价格底数、指数4（最多减少到1）
			</div>
			<h1>定律 2</h1>
			{{
				player.milestones.log_law2
					? '行星与太阳的连线在相等时间内扫过相等的面积。'
					: '行星与太阳的连线在？？？？内？？？？？？？。'
			}}
			<div class="requirement">需求： 40000 计算数据</div>
			<div class="effect">指数能量获取基于计算数据提升</div>
			<h1>定律 3</h1>
			{{
				player.milestones.log_law3
					? '行星轨道半长轴的三次方与公转周期的平方成正比。'
					: '行星轨道？？？？？？？与公转周期的？？？？？。'
			}}
			<div class="requirement">需求： 3000000 计算数据</div>
			<div class="effect">对数表、天文学家价格底数、指数基于计算数据降低</div>
			<h1>{{ player.milestones.log_G ? '万有引力' : '？？？？' }}定律</h1>
			{{ player.milestones.log_G ? '！！！' : '？？？' }}
			<div class="requirement">需求： 5000000 计算数据</div>
			<div class="effect">解锁对数膨胀</div>
		</div>
	</div>
</template>

<style scoped>
.phys_law {
	border: 2px solid blue;
	border-radius: 36px;
	width: 500px;
	height: 650px;
	padding-left: 70px;
	padding-top: 30px;
	padding-right: 70px;
	margin: auto;
	margin-bottom: 100px;
}
.requirement {
	margin: auto;
	width: fit-content;
	border: 2px solid rgb(0, 119, 255);
	border-radius: 4px;
	padding: 5px;
}
.effect {
	margin: auto;
	max-width: 80%;
	border: 2px solid rgb(0, 255, 115);
	border-radius: 4px;
	padding: 5px;
}
</style>
