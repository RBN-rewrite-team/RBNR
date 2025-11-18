import { defineComponent, type CSSProperties, type PropType, type Ref } from 'vue';
import { getNodeStyle } from './node';
import { extractAttributesFromProps, propsEvents } from '@/utils/htmlEvents';
import { vHold, type HoldDirectiveValue, type HoldHandlers } from '@/utils/vHold';

export default defineComponent({
	name: 'GardenNode',
	props: {
		x: {
			type: Number as PropType<number>,
			required: true,
		},
		y: {
			type: Number as PropType<number>,
			required: true,
		},
		canvasRef: {
			type: Object as PropType<Ref<HTMLDivElement | null>>,
			required: true,
		},
		nodestyle: {
			type: Object as PropType<CSSProperties>,
		},

		mini: {
			type: Boolean as PropType<boolean>,
			default: false,
		},
		hold: {
			type: Object as PropType<HoldDirectiveValue>,
			default: {},
		},
		...propsEvents,
	},
	setup(props, ctx) {
		return () => (
			<>
				<div
					class="node"
					style={{
						...getNodeStyle(props.x, props.y, props.canvasRef, props.mini),
						...props.nodestyle,
					}}
					{...extractAttributesFromProps(props)}
					v-hold={props['hold']}
				>
					<span class="node_desc">{ctx.slots.default ? ctx.slots.default() : ''}</span>
				</div>
			</>
		);
	},
});
