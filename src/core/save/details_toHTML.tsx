import { defineComponent, type PropType } from 'vue';
import { changeSave, current_save, type readSaveDetail } from '.';

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
						<div>版本:{props.det.version}</div>
						<div>章节{props.det.chapter}</div>
					</div>
					<div>
						资源：
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
						切换到此槽位
					</button>
					<div>上次保存：{props.det.lastSave}</div>
				</div>
			</>
		);
	},
});
