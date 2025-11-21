import { defineComponent, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'Resource',
	props: {
		show: {
			type: Boolean,
			default: true,
		},
		reskey: {
			type: String,
			required: true,
		},
		resdisplay: {
			required: true,
		},
		growingdisplay: {
			type: Function as PropType<() => any>,
		},
		softcap: {
			type: Object as PropType<{
				softcaps(): number;
			}>,
		},
		posleft: {
			type: String,
			required: true,
		},
		rescolor: {
			type: String,
			required: true,
		},
		rescolor2: {
			type: String,
			required: true,
		},
		rescolor3: {
			type: String,
		},
	},
	setup(props) {
		const $t = useI18n().t;
		return () =>
			(props.show ?? true) && (
				<div
					style={{
						marginLeft: `${props.posleft}px`,
					}}
					class="resource"
				>
					<div
						style={{
							fontWeight: 'bold',
							color: props.rescolor,
							textShadow: `${props.rescolor3 ?? props.rescolor2} 1px 1px 2px`,
						}}
					>
						{$t(props.reskey)}&nbsp;{props.resdisplay}
					</div>
					<div
						style={{
							fontSize: '17px',
							color: props.rescolor2,
						}}
					>
						{props.growingdisplay && (
							<>
								{props.growingdisplay()}
								<br />
							</>
						)}
						{props.softcap && props.softcap.softcaps() >= 1 && (
							<span>
								{$t('res.softcapped', {
									amount: props.softcap.softcaps().toString(),
								})}
							</span>
						)}
					</div>
				</div>
			);
	},
});
