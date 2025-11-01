import { extractAttributesFromProps, propsEvents } from '@/utils/htmlEvents';
import { defineComponent, type CSSProperties, type PropType } from 'vue';

export default defineComponent({
	name: 'PrimaryButton',
	props: {
		...propsEvents,
		style: {
			type: Object as PropType<CSSProperties>,
		},
	},
	setup(props, { slots }) {
		return () => (
			<>
				<button
					class={['clickable_button', 'margin_center']}
					{...extractAttributesFromProps(props)}
					style={{ ...props.style }}
				>
					{slots.default ? slots.default() : ''}
				</button>
			</>
		);
	},
});
