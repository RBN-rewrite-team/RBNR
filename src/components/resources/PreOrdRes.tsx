import { defineComponent } from 'vue';
import Resource from '../resources/Resource';
import { feature, player } from '@/core/global';
import { useUpdate } from '@/lib/useUpdate';
import { formatGain, formatWhole } from '@/utils/format';
import { useI18n } from 'vue-i18n';
import Decimal from 'break_eternity.js';
import { DC } from '@/core/constants';
import { Ordinal } from '@/lib/ordinal';

export default defineComponent({
	setup(props, ctx) {
		const showNumber = useUpdate(() => !(player.firstResetBit & 0b1000));
		const showAP = useUpdate(
			() =>
				(player.upgrades[13] || player.exponention.logarithm.in_dilate) &&
				player.singularity.stage < 10,
		);
		const showMP = useUpdate(
			() =>
				(player.upgrades[26] || player.exponention.logarithm.in_dilate) &&
				player.singularity.stage < 9,
		);
		const showEP = useUpdate(
			() => player.singularity.stage < 4 && player.stat.highestMulpower.gte(DC.D_2P1024),
		);
		const numberValue = useUpdate(() => {
			return player.singularity.t > 2000 / 3 ? 'ω' : formatWhole(player.number);
		});
		const apValue = useUpdate(() => {
			return formatWhole(player.addpower);
		});
		const mpValue = useUpdate(() => {
			return formatWhole(player.multiplication.mulpower);
		});
		const epValue = useUpdate(() => {
			return formatWhole(player.exponention.exppower);
		});
		const $t = useI18n().t;
		return () => (
			<>
				<Resource
					show={showNumber.value}
					reskey="res.number"
					resdisplay={numberValue.value}
					posleft="15"
					rescolor="var(--suptitle-color)"
					rescolor2="var(--title-color)"
					growingdisplay={function () {
						if (player.singularity.stage >= 11) {
							return '';
						}
						return feature.SUCCESSOR.autoSuccessPerSecond().eq(0)
							? $t('res.number.required')
							: formatGain(player.number, feature.resourceGain.number().value, '');
					}}
					softcap={{
						softcaps() {
							return feature.resourceGain.number().softcaps;
						},
					}}
				/>
				<Resource
					show={showAP.value}
					reskey="res.addpower"
					resdisplay={apValue.value}
					posleft="265"
					rescolor="#009dd9"
					rescolor2="#5acaff"
					growingdisplay={function () {
						return (
							<>
								{feature.resourceGain.addpower().passive.eq(0) ? (
									<>
										(+
										{formatWhole(feature.resourceGain.addpower().value)})
									</>
								) : (
									<>
										<span
											innerHTML={formatGain(
												player.addpower,
												feature.resourceGain
													.addpower()
													.passive.mul(
														feature.resourceGain.addpower().value,
													),
											)}
										/>
									</>
								)}
								(!{formatWhole(player.totalAddpower)})
							</>
						);
					}}
					softcap={{
						softcaps() {
							return feature.resourceGain.addpower().softcaps;
						},
					}}
				/>
				<Resource
					show={showMP.value}
					reskey="res.mulpower"
					resdisplay={mpValue.value}
					posleft="515"
					rescolor="#cc33ff"
					rescolor2="#dd77dd"
					growingdisplay={function () {
						return (
							<>
								{feature.resourceGain.mulpower().passive.eq(0) ? (
									<>
										(+
										{formatWhole(feature.resourceGain.mulpower().value)})
									</>
								) : (
									<>
										<span
											innerHTML={formatGain(
												player.multiplication.mulpower,
												feature.resourceGain
													.mulpower()
													.passive.mul(
														feature.resourceGain.mulpower().value,
													),
											)}
										/>
									</>
								)}
								(!{formatWhole(player.multiplication.totalMulpower)})
							</>
						);
					}}
					softcap={{
						softcaps() {
							return feature.resourceGain.mulpower().softcaps;
						},
					}}
				/>
				<Resource
					show={showEP.value}
					reskey="res.exppower"
					resdisplay={epValue.value}
					posleft="755"
					rescolor="rgb(127, 127, 255)"
					rescolor2="rgb(63, 63, 127)"
					rescolor3="rgb(0, 20, 127)"
					growingdisplay={function () {
						return (
							<>
								{feature.resourceGain.exppower().passive.eq(0) ? (
									<>
										(+
										{formatWhole(feature.resourceGain.exppower().value)})
									</>
								) : (
									<>
										<span
											innerHTML={formatGain(
												player.exponention.exppower,
												feature.resourceGain
													.exppower()
													.passive.mul(
														feature.resourceGain.exppower().value,
													),
											)}
										/>
									</>
								)}
								(!{formatWhole(player.exponention.totalExppower)})
							</>
						);
					}}
				/>
			</>
		);
	},
});
