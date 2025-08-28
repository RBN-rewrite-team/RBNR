<script lang="ts" setup>
import { player } from '@/core/save';
import { isDeveloper } from '@/core/save/testing';
import ObjectNode from './ObjectNode';
</script>

<template>
	<div v-if="isDeveloper()" style="text-align: left">
		开发者模式<br />
		<button @click="player.currentTab=1225">进入小游戏</button>
		<ObjectNode :goal="{ player }"></ObjectNode>
	</div>
</template>
