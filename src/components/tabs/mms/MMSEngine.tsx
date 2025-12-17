import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import MMSDeduction from './MMSDeduction';

export default defineComponent({
	name: 'MMSEngine',
	setup() {
		const $t = useI18n().t;
		return () => (
			<>
				<div class="main">
					<p style="color: grey; table-align: center">{$t('mms.t')}</p>
					<div
						style={{
							margin: 'auto',
						}}
					>
						<MMSDeduction />
					</div>
					<div
						style={{
							margin: 'auto',
						}}
					>
						<div class="rank_div">
							<b class="rank_text">Rank</b> 114,514
							<div class={'rank_button'}>
								Reset your MMS progression & 充能九头蛇能量, but Rank up. <br />
								<br />
								To Rank up, requires <br />
								xxxx 充能九头蛇能量
							</div>
						</div>
						<div class="rank_div">
							<b class="rank_text">Tier</b> 114,514
							<div class={'rank_button'}>
								Reset your Rank, MMS progression & 充能九头蛇能量, but Tier up.{' '}
								<br />
								<br />
								To Tier up, requires <br />
								xxxx Rank
							</div>
						</div>
					</div>
				</div>
			</>
		);
	},
});
