<script lang="ts" setup>
import { player } from '@/core/global.ts';
import helpNavigator from './help-navigator';
import HelpContent from './HelpContent';

//window.nextPage = nextPage
</script>

<template>
	<div class="main">
		<helpNavigator />
		<div>
			<HelpContent />
		</div>
	</div>
</template>
