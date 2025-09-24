<script setup lang="ts">
import SingleMinigameSkill from '@/components/group-2/SingleMinigameSkill.vue';
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
		<SingleMinigameSkill :study_id="5"></SingleMinigameSkill>
		<SingleMinigameSkill :study_id="6"></SingleMinigameSkill>
	</div>
	<div class="studies_row">
		<SingleMinigameSkill :study_id="7"></SingleMinigameSkill>
		<SingleMinigameSkill :study_id="8"></SingleMinigameSkill>
	</div>
</template>
