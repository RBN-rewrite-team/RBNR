import { defineComponent } from 'vue';

import './cardinal.css';
import { player } from '@/core/global';
import { worldPosChange } from '@/core/cardinal';

const buttonstyle = {
	position: 'absolute',
	border: '1px solid grey',
	width: '80px',
	height: '80px',
	textAlign: 'center',
	lineHeight: '80px',
} as const;
export default defineComponent({
	name: 'CardinalWorld',
	setup(props, ctx) {
		return () => (
			<>
				<div
					style={{
						position: 'absolute',
						width: '100%',
						height: '100%',
						top: 0,
						left: 0,
						'background-color': 'black',
						fontSize: '28px',
					}}
				>
					{player.cardinal.world_pos.join(',')}
					<div
						style={{
							color: 'red',
						}}
					>
						<div
							style={{
								position: 'absolute',
								left: '50%',
								top: 'calc(50% - 20px)',

								transform: 'translate(-50%, -50%)',
							}}
						>
							Cardinal
						</div>
						<div
							style={{
								position: 'absolute',
								left: '50%',
								top: 'calc(50% + 20px)',

								transform: 'translate(-50%, -50%)',
							}}
						>
							ℵ<sub>0</sub>
						</div>
					</div>

					<div>
						<div
							style={{
								left: '10px',
								top: 'calc(50%)',
								borderRadius: '40px',
								transform: 'translate(0%, -50%)',
								...buttonstyle,
							}}
							class={'cardinal-button'}
							onClick={() => worldPosChange('left')}
						>
							←
						</div>

						<div
							style={{
								right: '10px',
								top: 'calc(50%)',
								borderRadius: '40px',

								transform: 'translate(0%, -50%)',
								...buttonstyle,
							}}
							class={'cardinal-button'}
							onClick={() => worldPosChange('right')}
						>
							→
						</div>

						<div
							style={{
								left: 'calc(50%)',
								top: '10px',
								borderRadius: '40px',

								transform: 'translate(-50%, 0%)',
								...buttonstyle,
							}}
							class={'cardinal-button'}
							onClick={() => worldPosChange('up')}
						>
							↑
						</div>

						<div
							style={{
								left: 'calc(50%)',
								bottom: '10px',
								borderRadius: '40px',

								transform: 'translate(-50%, 0%)',
								...buttonstyle,
							}}
							class={'cardinal-button'}
							onClick={() => worldPosChange('down')}
						>
							↓
						</div>
					</div>
				</div>
			</>
		);
	},
});
