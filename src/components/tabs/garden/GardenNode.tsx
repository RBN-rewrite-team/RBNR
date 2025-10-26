import { defineComponent, type CSSProperties, type PropType, type Ref } from 'vue';
import { getNodeStyle } from './node';

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
		onClick: {
			type: Function as PropType<(e: Event) => any>,
		},
		mini: {
			type: Boolean as PropType<boolean>,
		},
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
					onClick={props.onClick}
				>
					<span class="node_desc">{ctx.slots.default ? ctx.slots.default() : ''}</span>
				</div>
			</>
		);
	},
});
