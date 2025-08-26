import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		/**
		 * 0-100之间的数
		 */
		progress: {
			type: Number,
			required: true,
		},
		content: {
			type: String,
		},
	},
	setup(props) {
		return () => (
			<>
				<div class="progress-container">
					<div class="progress-bar">
						<div class="progress-inner" style={{ width: props.progress + '%' }}>
							{props.content ?? ''}
						</div>
					</div>
					<div class="progress-text">{props.progress.toFixed(2)}%</div>
				</div>
			</>
		);
	},
});
