<script setup lang="ts">
import { RETRIBUTION } from '@/core/post-nonrec/retribution';
import { player } from '@/core/save';
import TDUpgrade from '@/components/group-2/TDUpgrade.vue';
import { useI18n } from 'vue-i18n';

const $t = useI18n().t;
function retributionText() {
	if (player.retribution < 1) {
		return player.hydra.deduceOrdinal[0].lt('eeee10') ? '...' : $t('retri.2');
	}
	return '......';
}
// player.options.ui.theme = themes.DARK;
</script>

<template>
	<div class="baseRetribution">
		<h1>{{ $t('tab.retribution') }}</h1>
		<br />
		<h3 v-html="$t('retri.text')"></h3>
		<br />
		<button class="retribution" @click="RETRIBUTION.resetUI">
			{{ retributionText() }}
		</button>
		<table align="center">
			<tr>
				<TDUpgrade upgid="U6R18" />
			</tr>
		</table>
	</div>
</template>

<style>
.baseRetribution {
	width: 100%;
	height: 100%;
	animation: baseRetributionA 0.25s infinite;
	background-image: linear-gradient(rgb(18, 0, 0) 0%, rgb(192, 0, 0) 100%);
	overflow: auto;
	background-image: url('../Retribution.png');
	background-repeat: no-repeat;
	background-position: center center;
}

@keyframes baseRetributionA {
	0%,
	15% {
		text-shadow:
			1px 1px 0px red,
			1px -1px 0px blue,
			1px -3px 0px green;
	}
	25%,
	40% {
		text-shadow:
			-1px -2px 0px red,
			-1px 0px 0px blue,
			-1px 2px 0px green;
	}
	50%,
	65% {
		text-shadow:
			-2px -2px 0px red,
			0px -1px 0px blue,
			2px 0px 0px green;
	}
	75%,
	90% {
		text-shadow:
			3px 2px 0px red,
			2px 2px 0px blue,
			1px 2px 0px green;
	}
}

@keyframes baseRetributionAbox {
	0%,
	15% {
		box-shadow:
			1px 1px 0px red,
			1px -1px 0px blue,
			1px -3px 0px green;
	}
	25%,
	40% {
		box-shadow:
			-1px -2px 0px red,
			-1px 0px 0px blue,
			-1px 2px 0px green;
	}
	50%,
	65% {
		box-shadow:
			-2px -2px 0px red,
			0px -1px 0px blue,
			2px 0px 0px green;
	}
	75%,
	90% {
		box-shadow:
			3px 2px 0px red,
			2px 2px 0px blue,
			1px 2px 0px green;
	}
}

.retribution {
	height: 250px;
	width: 50%;
	border: 2px solid red;
	animation: baseRetributionAbox 0.25s infinite;
	background-color: var(--background-color);
	color: var(--color);
}
@keyframes baseAbox {
	0%,
	15% {
		box-shadow:
			1px 1px 0px red,
			1px -1px 0px blue,
			1px -3px 0px green;
	}
	25%,
	40% {
		box-shadow:
			-1px -2px 0px red,
			-1px 0px 0px blue,
			-1px 2px 0px green;
	}
	50%,
	65% {
		box-shadow:
			-2px -2px 0px red,
			0px -1px 0px blue,
			2px 0px 0px green;
	}
	75%,
	90% {
		box-shadow:
			3px 2px 0px red,
			2px 2px 0px blue,
			1px 2px 0px green;
	}
}

.retribution {
	height: 250px;
	width: 50%;
	border: 2px solid red;
	animation: baseAbox 0.25s infinite;
	background-color: var(--background-color);
	color: var(--color);
}
</style>
