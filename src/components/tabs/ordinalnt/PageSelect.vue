<script setup lang="ts">
import { player } from '@/core/save';
import type { IntClosedRange } from 'type-fest';
</script>

<template>
	<div>
		<button
			class="clickable_button"
			style="display: inline-block"
			@click="
				player.numbertheory.well_ordering.pages[
					(player.numbertheory.well_ordering.selecting - 1) as IntClosedRange<0, 9>
				] = Math.max(
					player.numbertheory.well_ordering.pages[
						(player.numbertheory.well_ordering.selecting - 1) as IntClosedRange<0, 9>
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
				player.numbertheory.well_ordering.pages[
					(player.numbertheory.well_ordering.selecting - 1) as IntClosedRange<0, 9>
				]++
			"
		>
			+</button
		>({{
			$t('page', {
				page:
					player.numbertheory.well_ordering.pages[
						(player.numbertheory.well_ordering.selecting - 1) as IntClosedRange<0, 9>
					] + 1,
			})
		}})
	</div>
</template>
