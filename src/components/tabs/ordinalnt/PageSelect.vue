<script setup lang="ts">
import { player } from '@/core/save';
</script>

<template>
	<div>
		<button
			class="clickable_button"
			style="display: inline-block"
			@click="
				player.numbertheory.well_ordering.pages[player.numbertheory.well_ordering.selecting - 1] =
					Math.max(
						player.numbertheory.well_ordering.pages[
							player.numbertheory.well_ordering.selecting - 1
						] - 1,
						0,
					)
			"
		>
			-
		</button>
		<button
			class="clickable_button"
			style="display: inline-block"
			@click="
				player.numbertheory.well_ordering.pages[player.numbertheory.well_ordering.selecting - 1]++
			"
		>
			+</button
		>(第{{
			player.numbertheory.well_ordering.pages[player.numbertheory.well_ordering.selecting - 1] + 1
		}}页)
	</div>
</template>
