import { defineComponent, type PropType } from 'vue';
import { changeSave, current_save, type readSaveDetail } from '.';
import { useI18n } from 'vue-i18n';

export default defineComponent({
	name: 'DetailsToHTML',
	props: {
		det: {
			type: Object as PropType<NonNullable<ReturnType<typeof readSaveDetail>>>,
			required: true,
		},
	},
	setup(props) {
		// {props.det?.isOrdinal}
		const $t = useI18n().t;
		return () => (
			<>
				<div
					style={{
						border: '1px solid',
						borderColor: current_save == props.det.id ? '#0f0' : 'red',
					}}
				>
					<div
						style={{
							border: '1px solid',
							borderColor: current_save == props.det.id ? '#0f0' : 'red',

							display: 'flex',
							justifyContent: 'space-around',
						}}
					>
						<div>
							{$t('detailstoHTML.version')}
							{props.det.version}
						</div>
						<div>
							{$t('detailstoHTML.chapter')}
							{props.det.chapter}
						</div>
					</div>
					<div>
						{$t('detailstoHTML.res')}
						<div
							innerHTML={props.det.number}
							style={{
								display: 'inline',
							}}
						/>
					</div>
					<button
						class={['clickable_button']}
						style={{
							margin: 'auto',
						}}
						onClick={() => {
							changeSave(props.det.id);
						}}
					>
						{$t('detailstoHTML.change')}
					</button>
					<div>
						{$t('detailstoHTML.last')}
						{props.det.lastSave}
					</div>
				</div>
			</>
		);
	},
});
