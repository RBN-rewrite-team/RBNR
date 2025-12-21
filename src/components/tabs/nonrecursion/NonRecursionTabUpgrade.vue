<script lang="ts" setup>
import { player } from '@/core/save';

import Upgrades from '@/components/upg/Upgrades';
import type { buyables, upgrades } from '@/core/mechanic';
import { useUpdate } from '@/lib/useUpdate';

const upgids = useUpdate(function () {
	const upgs = [['u71', 'u72', 'u73', 'u74']] as (
		| `u${keyof typeof upgrades}`
		| `b${keyof typeof buyables}`
	)[][];

	if (player.milestones.nonrec_26) {
		upgs.push(['u75', 'u76', 'u77', 'u78']);
	}
	return upgs;
});
</script>

<template>
	<div class="main">
		<Upgrades :upgids="upgids" />
	</div>
</template>
