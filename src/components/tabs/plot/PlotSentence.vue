<script lang="ts" setup>
const props = defineProps<{
	name: string;
	image: string;
	text: string;
}>();
</script>

<template>
	<tr><td><div align="center" style="position: relative; width: 100%">
		<div class="chara_pic" :style="{ 'background-image': image }">
		</div>
		<span class="chara_name" v-html="name" />
		<div class="main" v-html="text" />
	</div></td></tr>
</template>

<style scoped>
.main {
	background-color: rgba(127, 127, 127, 0);
	color: var(--color);
	padding: 10px;
	border: 2px solid var(--suptitle-color);
	transition: 0.2s;
	width: 275px;
	height: 60px;
	font-size: 14px;
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
}
.main:hover {
	background-color: rgb(127, 127, 127, 1);
	box-shadow: 0px 0px 10px 10px var(--suptitle-color);
}
.chara_pic {
	background-image: url(./plot_image/placeholder.png);
	background-size: cover;
	color: var(--color);
	font-size: 24px;
	position: absolute;
	width: 80px;
	height: 80px;
	left: 50%;
	transform: translateX(-50%) translateX(-200px);
	transition: all 0.25s ease 0s;
}
.chara_name {
	color: var(--color);
	font-size: 24px;
	position: absolute;
	left: 50%;
	transform: translateX(-50%) translateX(-200px) translateY(80px);
	font-size: 12px;
}
</style>