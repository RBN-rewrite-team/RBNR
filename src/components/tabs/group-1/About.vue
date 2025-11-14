<script lang="ts" setup>
import { player } from '@/core/save';
import { i18n } from '@/utils/i18n';
</script>
<template>
	<div class="main">
		<h1 v-if="player.pt.resetTimes.lt(1)">{{ $t('title.rewritten') }}</h1>
		<h1 v-else>大数之路<span style="color: red">放置版</span></h1>
		{{ $t('about.version') }}<br />
		<br />
		<div style="position: relative; width: 100%">
			<div
				style="position: absolute; top: 0px; left: 0%; height: 100px; width: 25%"
				align="center"
			>
				<h2>{{ $t('about.themasterofthedevelopgroup') }}</h2>
				<br />
				LSO - The Reflection Arc
			</div>
			<div
				style="position: absolute; top: 0px; left: 25%; height: 100px; width: 50%"
				align="center"
			>
				<h2>{{ $t('about.originalauthor') }}</h2>
				<br />
				{{ $t('about.jinghuoomega') }}
			</div>
			<div
				style="position: absolute; top: 0px; left: 75%; height: 100px; width: 25%"
				align="center"
			>
				<h2>{{ $t('about.coderepositorymanager') }}</h2>
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
				<h2>{{ $t('about.programming') }}</h2>
				<br />
				0100000000a7<br />
				VeryrrDefine<br />
				Seanxlx<br />
				{{ $t('about.fiveyeargaokao') }}
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
				<h2>{{ $t('about.planning') }}</h2>
				<br />
				RAXH<br />
				Seanxlx<br />
				LSO - The Reflection Arc<br />
				{{ $t('about.dlsdl') }}<br />
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
				<h2>{{ $t('about.balancing') }}</h2>
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
				<h2>{{ $t('about.plot') }}</h2>
				<br />
				LSO - The Reflection Arc<br />
				{{ $t('about.dutexuehua') }}<br />
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
				<h2>{{ $t('about.mechanismdesign') }}</h2>
				<br />
				RAXH<br />
				{{ $t('about.dlsdl') }}<br />
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
				<h2>{{ $t('about.mathemodeling') }}</h2>
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
				<h2>{{ $t('about.savebank') }}</h2>
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
				<h2>{{ $t('about.heyiwei') }}</h2>
				<br />
				hard_shuati<br />
				Endless_e308<br />
			</div>
		</div>
		<div style="transform: translateY(400px)" class="selectable">
			<template v-if="i18n.global.locale == 'zh-CN'"
				>本项目使用了<a href="https://cn.vuejs.org/"> Vue </a>、<a
					href="https://cn.vitejs.dev/"
				>
					Vite </a
				>、<a href="https://nodeca.github.io/pako/"> pako.js </a>、<a
					href="https://github.com/Patashu/break_eternity.js"
				>
					break_eternity.js </a
				>，部分显示相关代码取自<a href="https://solarzone1010.github.io/bms-analyzer.html">
					Solarzone1010的BMS Analyzer </a
				>。 <br /><br /><a
					href="https://github.com/RBN-rewrite-team/RBNR/blob/develop/public/changelog.md"
				>
					查看更新记录
				</a></template
			>
			<template v-else>
				This project uses <a href="https://vuejs.org/"> Vue</a>,
				<a href="https://vitejs.dev/">Vite</a>,
				<a href="https://nodeca.github.io/pako/">pako.js</a>,
				<a href="https://github.com/Patashu/break_eternity.js">break_eternity.js</a>,
				<br />partly displaying code chooses from
				<a href="https://solarzone1010.github.io/bms-analyzer.html">
					Solarzone1010's BMS Analyzer </a
				>. <br /><br /><a
					href="https://github.com/RBN-rewrite-team/RBNR/blob/develop/public/changelog.md"
				>
					Check changelog
				</a>
			</template>
		</div>
	</div>
</template>
