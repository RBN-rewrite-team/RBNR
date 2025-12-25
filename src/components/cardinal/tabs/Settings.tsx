import { openSetLangModel } from '@/components/i18nUI';
import fontUI from '@/core/save/fontUI';
import { UIHardReset } from '@/core/save/saveui';
import ModalService from '@/utils/Modal';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import type { $t } from '@/utils/types';
export default defineComponent({
	name: 'Settings',
	setup(props, ctx) {
		const $t = useI18n().t;
		return () => (
			<>
				<div>
					<div
						style={{
							left: 'calc(50%)',
							top: 'calc(50%)',
							transform: 'translate(-50%, -50%)',
							position: 'absolute',
							border: '1px solid grey',
							width: '120px',
							height: '120px',
							textAlign: 'center',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						class={'cardinal-button'}
					>
						Beta测试
					</div>
					<div
						style={{
							left: 'calc(50% - 140px)',
							top: 'calc(50%)',
							transform: 'translate(-50%, -50%)',
							position: 'absolute',
							border: '1px solid grey',
							width: '120px',
							height: '120px',
							textAlign: 'center',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						class={'cardinal-button'}
						onClick={() => UIHardReset()}
					>
						硬重置
					</div>
					<div
						style={{
							left: 'calc(50% - 140px)',
							top: 'calc(50% + 140px)',
							transform: 'translate(-50%, -50%)',
							position: 'absolute',
							border: '1px solid grey',
							width: '120px',
							height: '120px',
							textAlign: 'center',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						class={'cardinal-button'}
					>
						存档槽位(????)
					</div>
					<div
						style={{
							left: 'calc(50%)',
							top: 'calc(50% + 140px)',
							transform: 'translate(-50%, -50%)',
							position: 'absolute',
							border: '1px solid grey',
							width: '120px',
							height: '120px',
							textAlign: 'center',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						class={'cardinal-button'}
					>
						离线时间
					</div>
					<div
						style={{
							left: 'calc(50% + 140px)',
							top: 'calc(50% + 140px)',
							transform: 'translate(-50%, -50%)',
							position: 'absolute',
							border: '1px solid grey',
							width: '120px',
							height: '120px',
							textAlign: 'center',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						class={'cardinal-button'}
						onClick={() =>
							ModalService.show(
								($t: $t) => ({
									title: $t('modal.font2'),
									component: fontUI,
								}),
								$t,
							)
						}
					>
						设置字体
					</div>
					<div
						style={{
							left: 'calc(50% + 140px)',
							top: 'calc(50%)',
							transform: 'translate(-50%, -50%)',
							position: 'absolute',
							border: '1px solid grey',
							width: '120px',
							height: '120px',
							textAlign: 'center',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						class={'cardinal-button'}
					>
						Gamma测试
					</div>
					<div
						style={{
							left: 'calc(50% + 280px)',
							top: 'calc(50%)',
							transform: 'translate(-50%, -50%)',
							position: 'absolute',
							border: '1px solid grey',
							width: '120px',
							height: '120px',
							textAlign: 'center',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
						class={'cardinal-button'}
						onClick={() => openSetLangModel($t)}
					>
						语言
					</div>
				</div>
			</>
		);
	},
});
