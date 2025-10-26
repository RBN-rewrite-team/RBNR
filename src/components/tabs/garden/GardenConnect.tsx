import { defineComponent, type CSSProperties, type PropType, type Ref } from 'vue';
import { getConnectStyle } from './node';

export default defineComponent({
	name: 'GardenConnect',
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
		rotate: {
			type: Number as PropType<number>,
		},
		length: {
			type: Number as PropType<number>,
			required: true,
		},
	},
	setup(props, ctx) {
		return () => (
			<>
				<div
					class="node_conn"
					style={{
						width: props.length + 'px',
						transform: 'translate(-50%, -50%) rotate(' + props.rotate + 'deg)',
						...getConnectStyle(props.x, props.y, props.canvasRef),
						...props.nodestyle,
					}}
				/>
			</>
		);
	},
});
