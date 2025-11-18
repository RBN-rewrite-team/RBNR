<script setup lang="ts">
import { POST_NONREC } from '@/core/post-nonrec';
import { Y_SEQ } from '@/core/post-nonrec/y-seq';
import { formatWhole, format } from '@/utils/format';
import { player } from '@/core/save';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
	seq_id: 0 | 1 | 2 | 3;
}>();

function isFast() {
	const a = (props.seq_id + 1) as 1 | 2 | 3 | 4;
	if (a !== 4) return POST_NONREC.Y_SEQ.dimensionEffect(a).gte(10);
	else if (a === 4) return Y_SEQ.u627effect().gte(10);
}
const $t = useI18n().t;
function dimensionTitle() {
	return $t('yeng.dim.' + props.seq_id + '.title');
}
function dimensionText() {
	return $t('yeng.dim.' + props.seq_id + '.effect', {
		effect: format(POST_NONREC.Y_SEQ.dimensionEffect(0)),
	});
}
function className() {
	return `dim${props.seq_id + 1}_progress_bar`;
}
</script>

<template>
	<div class="dim-single" :class="{ fast: isFast(), [className()]: true }">
		<div style="text-align: left">
			<span
				>{{ dimensionTitle() }}({{
					formatWhole(player.postnonrec.yseq.dimensions[0][0])
				}}+{{ formatWhole(player.postnonrec.yseq.dimensions[1][0]) }})</span
			><br />
			×{{ format(Y_SEQ.dimensionBoost(0)) }}
		</div>
		<span>{{ dimensionText() }}</span>
		<div class="buy" @click="() => POST_NONREC.Y_SEQ.buyDimensions(props.seq_id)">
			{{ $t('yeng.dim.buymax') }}<br />{{ $t('yeng.dim.require') }}
			{{ formatWhole(POST_NONREC.Y_SEQ.dimensionsCost(props.seq_id))
			}}{{ $t('res.compress') }}
		</div>
	</div>
</template>
