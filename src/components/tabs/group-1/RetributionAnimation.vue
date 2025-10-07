<script setup lang="ts">
import { temp } from '@/core/temp-data.ts';
</script>

<template>
	<div v-if="temp.retribution == 1">
		<div class="background">
			<div class="beam beam-1"></div>
			<div class="beam beam-2"></div>
			<div class="beam beam-3"></div>
			<div class="beam beam-4"></div>
			<div class="beam beam-5"></div>
			<div class="beam beam-6"></div>
			<div class="beam beam-7"></div>
			<div class="beam beam-8"></div>
		</div>
		<div class="main" />
	</div>
</template>

<style scoped>
.background {
	position: absolute;
	top: 50%;
	left: 50%;
	background-color: white;
	background-image: url('');
	z-index: 7;

	width: 100%;
	height: 100%;
	transform: translate(-50%, -50%);

	overflow: hidden;

	animation:
		background 15s 1,
		baseRetributionAbox 0.25s infinite;
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

@keyframes background {
	0% {
		background-color: rgba(255, 0, 0, 0);
	}
	25% {
		background-color: rgba(255, 0, 0, 0.3);
	}
	75% {
		background-color: rgba(255, 255, 255, 0.3);
	}
	90% {
		background-color: rgba(255, 255, 255, 1);
	}
}

.main {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%) perspective(400px) rotate3d(1, -1, 0, 8deg);

	width: 250px;
	height: 250px;
	border-radius: 125px;
	border: 2px solid red;
	background: radial-gradient(circle, rgba(0, 0, 0, 1) 50%, rgba(255, 0, 0, 1) 100%);
	z-index: 7;

	animation:
		phase1 20s 1,
		phase2 20s 1,
		baseRetributionAbox 0.25s infinite;
}

@keyframes phase1 {
	0% {
		width: 0px;
		height: 0px;
	}
	3% {
		width: 250px;
		height: 250px;
	}
	100% {
	}
}

@keyframes phase2 {
	0% {
		box-shadow:
			0px 0px 20px 10px red,
			0px 0px 80px 10px red,
			0px 0px 120px 10px red;
	}
	50% {
		box-shadow:
			0px 0px 20px 10px red,
			0px 0px 80px 10px red,
			0px 0px 120px 10px red;
	}
	60% {
	}
	100% {
	}
}

.beam {
	position: absolute;
	top: 0;
	left: 0;
	width: 4000px;
	height: 5px;
	background: linear-gradient(
		to bottom,
		rgba(255, 0, 0, 0) 0%,
		rgba(255, 0, 0, 1) 50%,
		rgba(255, 0, 0, 0) 100%
	);
	transform-origin: center top;
	animation:
		converge 3s forwards,
		rotate 5s linear infinite,
		baseRetributionAbox 0.25s infinite;
}

@keyframes converge {
	0% {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(5) rotate(0deg);
		opacity: 0;
	}
	25% {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(1) rotate(0deg);
		opacity: 1;
		background: linear-gradient(
			to bottom,
			rgba(255, 0, 0, 0) 0%,
			rgba(255, 0, 0, 1) 50%,
			rgba(255, 0, 0, 0) 100%
		);
	}
	100% {
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%) scale(1) rotate(0deg);
		opacity: 1;
		background: linear-gradient(
			to bottom,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 1) 50%,
			rgba(255, 255, 255, 0) 100%
		);
	}
}

@keyframes rotate {
	0% {
		transform: translate(-50%, -50%) rotate(0deg);
	}
	100% {
		transform: translate(-50%, -50%) rotate(360deg);
	}
}

.beam-1 {
	animation-delay: 0s, 0s;
	animation-duration: 13s, 3.5s;
}
.beam-2 {
	animation-delay: 0.1s, 0.1s;
	animation-duration: 13s, 5.2s;
}
.beam-3 {
	animation-delay: 0.4s, 0.4s;
	animation-duration: 13s, 5.6s;
}
.beam-4 {
	animation-delay: 0.6s, 0.6s;
	animation-duration: 13s, 6.5s;
}
.beam-5 {
	animation-delay: 0.9s, 0.9s;
	animation-duration: 13s, 4.4s;
}
.beam-6 {
	animation-delay: 1s, 1s;
	animation-duration: 13s, 3.8s;
}
.beam-7 {
	animation-delay: 1.1s, 1.1s;
	animation-duration: 13s, 2.7s;
}
.beam-8 {
	animation-delay: 1.3s, 1.3s;
	animation-duration: 13s, 2.2s;
}
</style>
