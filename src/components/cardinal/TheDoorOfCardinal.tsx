import { player } from '@/core/global';
import { activateTheDoorOfCardinal } from '@/core/post-nonrec/cardinal/the-door-of-cardinal';
import { wordShift } from '@/core/word-shift';
import { useUpdate } from '@/lib/useUpdate';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'TheDoorOfCardinal',
	setup(props, ctx) {
		return () => (
			<>
				<div class={'main'}>
					<h1 class="corrupted_text">世界隧道</h1>
					<button
						class={{ clickable_button: true, corrupted_text: true }}
						onClick={() => activateTheDoorOfCardinal()}
						style={{
							margin: 'auto',
							'border-color': 'var(--background-color)',
							//'background-image': 'linear-gradient(to bottom, #000 0%, #f00 10%, #000 20%, #0f0 30%, #000 40%, #00f 50%, #000 60%, #0ff 70%, #000 80%, #fff 90%, #000 100%)',
							position: 'absolute',
							left: '50%',
							top: '50%',
							transform: 'translate(-50%, -50%)',
							width: '360px',
							height: '360px',
							'border-radius': '180px',
							'box-shadow': '2px 2px 3px 0px red, -2px -2px 3px 0px blue',
						}}
					>
						献祭一切，进入基数层级...
						<br />
						首次果报后可以启动。
						<br />
						开启奇点生成器将立即激活。
						<br />
					</button>
				</div>
			</>
		);
	},
});
