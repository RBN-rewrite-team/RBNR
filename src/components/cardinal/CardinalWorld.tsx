import { defineComponent } from 'vue';

import './cardinal.css';
import { player } from '@/core/global';
import { posis, worldPosChange } from '@/core/cardinal';
import { useI18n } from 'vue-i18n';
import { AWAKEN_BEACONS, RESPAWN_BEACONS } from '@/core/cardinal/beacons';
import Settings from './tabs/Settings';

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
		const $t = useI18n().t;
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
					<button>Map</button>
					{player.cardinal.world_pos.join(',')}

					{AWAKEN_BEACONS.map((v) => {
						if (posis(v[0], v[1]))
							return (
								<>
									<div
										style={{
											position: 'absolute',
											left: '50%',
											top: 'calc(50% )',

											transform: 'translate(-50%, -50%)',
										}}
									>
										复苏信标
									</div>
								</>
							);
					})}
					{RESPAWN_BEACONS.map((v) => {
						if (posis(v[0], v[1]))
							return (
								<>
									<div
										style={{
											position: 'absolute',
											left: '50%',
											top: 'calc(50% )',

											transform: 'translate(-50%, -50%)',
										}}
									>
										重生信标
									</div>
								</>
							);
					})}

					{posis(0, 0) && (
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
					)}
					{posis(1, 0) && <Settings />}

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
