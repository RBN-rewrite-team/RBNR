<script lang="ts" setup>
import { player } from '@/core/save';
</script>
<template>
	<div class="main">
		<h1 v-if="player.pt.resetTimes.lt(1)">大数之路重制版</h1>
		<h1 v-else>大数之路<span style="color: red">放置版</span></h1>
		版本: Garden Gamma (v0.7.1 Gamma)<br />
		<br />
		<div style="position: relative; width: 100%">
			<div
				style="position: absolute; top: 0px; left: 0%; height: 100px; width: 25%"
				align="center"
			>
				<h2>开发群群主</h2>
				<br />
				LSO - The Reflection Arc
			</div>
			<div
				style="position: absolute; top: 0px; left: 25%; height: 100px; width: 50%"
				align="center"
			>
				<h2>原作者</h2>
				<br />
				静火Ω
			</div>
			<div
				style="position: absolute; top: 0px; left: 75%; height: 100px; width: 25%"
				align="center"
			>
				<h2>代码仓库管理员</h2>
				<br />
				Seanxlx
			</div>
			<div
				style="
					position: absolute;
					top: 100px;
					left: 0%;
					height: 100px;
					width: 25%;
					transform: scale(0.75);
				"
				align="center"
			>
				<h2>程序</h2>
				<br />
				0100000000a7<br />
				VeryrrDefine<br />
				Seanxlx<br />
				五年高考💯
			</div>
			<div
				style="
					position: absolute;
					top: 100px;
					left: 25%;
					height: 100px;
					width: 25%;
					transform: scale(0.75);
				"
				align="center"
			>
				<h2>策划</h2>
				<br />
				RAXH<br />
				Seanxlx<br />
				LSO - The Reflection Arc<br />
				6左爷6<br />
				EdenGameMaster<br />
			</div>
			<div
				style="
					position: absolute;
					top: 100px;
					left: 50%;
					height: 100px;
					width: 25%;
					transform: scale(0.75);
				"
				align="center"
			>
				<h2>平衡</h2>
				<br />
				EdenGameMaster<br />
				Seanxlx<br />
				VeryrrDefine
			</div>
			<div
				style="
					position: absolute;
					top: 100px;
					left: 75%;
					height: 100px;
					width: 25%;
					transform: scale(0.75);
				"
				align="center"
			>
				<h2>剧情设定</h2>
				<br />
				LSO - The Reflection Arc<br />
				独特雪花<br />
				Seanxlx<br />
				VeryrrDefine<br />
				0100000000a7<br />
			</div>
			<div
				style="
					position: absolute;
					top: 250px;
					left: 0%;
					height: 100px;
					width: 25%;
					transform: scale(0.75);
				"
				align="center"
			>
				<h2>机制设计</h2>
				<br />
				RAXH<br />
				6左爷6<br />
				Seanxlx<br />
			</div>
			<div
				style="
					position: absolute;
					top: 250px;
					left: 25%;
					height: 100px;
					width: 25%;
					transform: scale(0.75);
				"
				align="center"
			>
				<h2>数学建模</h2>
				<br />
				LSO - Reflection Arc<br />
				VeryrrDefine<br />
				Seanxlx
			</div>
			<div
				style="
					position: absolute;
					top: 250px;
					left: 50%;
					height: 100px;
					width: 25%;
					transform: scale(0.75);
				"
				align="center"
			>
				<h2>存档银行</h2>
				<br />
				VeryrrDefine<br />
				RAXH<br />
				0100000000a7
			</div>
			<div
				style="
					position: absolute;
					top: 250px;
					left: 75%;
					height: 100px;
					width: 25%;
					transform: scale(0.75);
				"
				align="center"
			>
				<h2>吉祥物</h2>
				<br />
				hard_shuati<br />
				Endless_e308<br />
			</div>
		</div>
		<div style="transform: translateY(400px)">
			本项目使用了<a href="https://cn.vuejs.org/"> Vue </a>、<a href="https://cn.vitejs.dev/">
				Vite </a
			>、<a href="https://nodeca.github.io/pako/"> pako.js </a>、<a
				href="https://github.com/Patashu/break_eternity.js"
			>
				break_eternity.js </a
			>，部分显示相关代码取自<a href="https://solarzone1010.github.io/bms-analyzer.html">
				BMS Analyzer </a
			>。 <br /><br /><a
				href="https://github.com/RBN-rewrite-team/RBNR/blob/develop/public/changelog.md"
			>
				查看更新记录
			</a>
		</div>
	</div>
</template>
