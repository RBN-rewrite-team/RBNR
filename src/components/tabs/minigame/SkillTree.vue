<script setup lang="ts">
import SingleMinigameSkill from '@/components/SingleMinigameSkill.vue';
</script>
<template>
	<div class="studies_row">
		<SingleMinigameSkill :study_id="0"></SingleMinigameSkill>
	</div>
	<div class="studies_row">
		<SingleMinigameSkill :study_id="1"></SingleMinigameSkill>
		<SingleMinigameSkill :study_id="2"></SingleMinigameSkill>
	</div>
	<div class="studies_row">
		<SingleMinigameSkill :study_id="3"></SingleMinigameSkill>
	</div>
	<div class="studies_row">
		<SingleMinigameSkill :study_id="4"></SingleMinigameSkill>
	</div>
</template>
