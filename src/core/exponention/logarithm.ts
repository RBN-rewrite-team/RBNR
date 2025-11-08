import Decimal from 'break_eternity.js';
import { buyables, MILESTONES, upgrades } from '../mechanic';
import { player } from '../save';
import { format } from '@/utils/format';
import { diff } from '../game-loop';
import { Buyable } from '../buyable';
import { Currencies } from '../currencies';
import { NUMTHEORY } from '../multiplication/numbertheory.ts';
import { wheatGrain } from './chessboard.ts';
export interface IAstronomer {
	life: number;
	boost: Decimal;
}
export const Logarithm = {
	get logarithm() {
		return player.exponention.logarithm;
	},
	get astronomers() {
		return this.logarithm.astronomers;
	},
	dilated(text: string, dilated: string, id: keyof typeof upgrades): () => string {
		return function () {
			return (
				text +
				(Logarithm.logarithm.upgrades_in_dilated.includes(id)
					? "<span style='color: rgb(127, 127, 255)'><br>" + dilated + '</span>'
					: '')
			);
		};
	},
	buyables: {
		lgr_emp: new (class extends Buyable<Decimal> {
			name = 'B-LG-EMP';
			currency: Currencies = Currencies.EXPONENTION_POWER;
			cost(x: Decimal): Decimal {
				let base = new Decimal(10);
				if (player.milestones.log_law3)
					base = base.sub(
						Logarithm.logarithm.calculate_datas.max(1).log10().pow(0.7).min(4),
					);
				return Decimal.pow(
					base,
					Decimal.pow(x.add(2), 2).sub(
						Logarithm.logarithm.calculate_datas.max(1).log10().pow(0.7).min(4),
					),
				);
			}
			postBuy(): void {
				const life = Logarithm.astronomerLife();
				Logarithm.astronomers.push({
					life: life[0],
					boost: life[1],
				});
			}
			capped(): boolean {
				return player.buyables.lgr_emp.gte(50);
			}
			effectDescription(x: Decimal) {
				return `+${format(this.effect(x))}`;
			}
			effect(x: Decimal) {
				return x;
			}
		})(),
		lgr_impr: new (class extends Buyable<Decimal> {
			name = 'B-LG-TAB';
			description: string = '改进对数表，提高运算速度和天文学家寿命';
			currency: Currencies = Currencies.EXPONENTION_POWER;
			cost(x: Decimal): Decimal {
				let base = new Decimal(10);
				if (player.milestones.log_law3)
					base = base.sub(
						Logarithm.logarithm.calculate_datas.max(1).log10().pow(0.7).min(4),
					);
				return Decimal.pow(
					10,
					Decimal.pow(x.add(2), x.add(1).min(5)).sub(
						Logarithm.logarithm.calculate_datas.max(1).log10().pow(0.7).min(4),
					),
				);
			}
			effectDescription(x: Decimal) {
				return `×${format(this.effect(x))}`;
			}
			effect(x: Decimal) {
				if (x.eq(0)) return new Decimal(1);
				return x.root(10).pow_base(x).div(10).add(1);
			}
		})(),
	} as const,
	initMechanics() {
		MILESTONES.create('log_law1', {
			displayName: 'M-LAW-1',
			get description() {
				return "Actually, this milestone is hidden, you shouldn't see it";
			},
			requirement: new Decimal(2000),
			get canDone() {
				return Logarithm.logarithm.calculate_datas.gte(this.requirement);
			},
			show: true,
			currency: '麦粒',
		});
		MILESTONES.create('log_law2', {
			displayName: 'M-LAW-2',
			get description() {
				return "Actually, this milestone is hidden, you shouldn't see it";
			},
			requirement: new Decimal(40000),
			get canDone() {
				return Logarithm.logarithm.calculate_datas.gte(this.requirement);
			},
			show: true,
			currency: '麦粒',
		});
		MILESTONES.create('log_law3', {
			displayName: 'M-LAW-3',
			get description() {
				return "Actually, this milestone is hidden, you shouldn't see it";
			},
			requirement: new Decimal(3e6),
			get canDone() {
				return Logarithm.logarithm.calculate_datas.gte(this.requirement);
			},
			show: true,
			currency: '麦粒',
		});
		MILESTONES.create('log_G', {
			displayName: 'M-LAW-G',
			get description() {
				return "Actually, this milestone is hidden, you shouldn't see it";
			},
			requirement: new Decimal(5e6),
			get canDone() {
				return Logarithm.logarithm.calculate_datas.gte(this.requirement);
			},
			show: true,
			currency: '麦粒',
		});

		MILESTONES.create('dil_1', {
			displayName: 'M-Dil-1',
			description: '最大化和自动化指数购买项',
			requirement: new Decimal(1000),
			get canDone() {
				return player.exponention.logarithm.highest_dilate.gte(this.requirement);
			},
			show: true,
			currency: '膨胀中数值',
		});
		MILESTONES.create('dil_2', {
			displayName: 'M-Dil-2',
			description: '最大化和自动化棋盘格子购买项',
			requirement: new Decimal(1e8),
			get canDone() {
				return player.exponention.logarithm.highest_dilate.gte(this.requirement);
			},
			show: true,
			currency: '膨胀中数值',
		});
		MILESTONES.create('dil_3', {
			displayName: 'M-Dil-3',
			description: '最大化和自动化数论研究2购买项',
			requirement: new Decimal(1e10),
			get canDone() {
				return player.exponention.logarithm.highest_dilate.gte(this.requirement);
			},
			show: true,
			currency: '膨胀中数值',
		});
		MILESTONES.create('dil_4', {
			displayName: 'M-Dil-4',
			description: '每秒额外获取1000%重置时将获得的指数能量',
			requirement: new Decimal(5e21),
			get canDone() {
				return player.exponention.logarithm.highest_dilate.gte(this.requirement);
			},
			show: true,
			currency: '膨胀中数值',
		});
		MILESTONES.create('dil_5', {
			displayName: 'M-Dil-5',
			get description() {
				return (
					'基于计算数据生产观测数据<br>效果：+' +
					format(player.exponention.logarithm.calculate_datas.add(1).log10().pow(2)) +
					'/s'
				);
			},
			requirement: new Decimal(1e26),
			get canDone() {
				return player.exponention.logarithm.highest_dilate.gte(this.requirement);
			},
			show: true,
			currency: '膨胀中数值',
		});
		MILESTONES.create('dil_6', {
			displayName: 'M-Dil-6',
			get description() {
				return (
					'基于麦粒数量增加指数能量获取<br>效果：^' +
					format(wheatGrain().log10().add(1).log10().add(1).pow(0.15))
				);
			},
			requirement: new Decimal(1e26),
			get canDone() {
				return player.exponention.logarithm.highest_dilate.gte(this.requirement);
			},
			show: true,
			currency: '膨胀中数值',
		});
		MILESTONES.create('dil_7', {
			displayName: 'M-Dil-7',
			get description() {
				return '解锁<b>奇点生成器</b>';
			},
			requirement: new Decimal(2).pow(8192),
			get canDone() {
				return (
					player.exponention.logarithm.in_dilate &&
					player.multiplication.mulpower.gte(this.requirement)
				);
			},
			show: true,
			currency: '膨胀中乘法能量',
		});
	},
	astronomerSpeed(): number {
		let base = 1;
		base *= player.milestones.cb17 ? 200 : 1;
		return base;
	},
	astronomerLife(): [number, Decimal] {
		let life = new Decimal(100);
		let boost = new Decimal(1); //计算生命溢出的
		const eff = buyables.lgr_impr.effect(player.buyables.lgr_impr);
		life = life.mul(eff);
		life = life.mul(player.milestones.cb15 ? 10 : 1);
		life = life.mul(player.milestones.cb17 ? 2 : 1);

		const temp_life = life.add(1).sub(1);
		if (life.gt(137e8)) {
			life = new Decimal(137e8);
			boost = boost.mul(temp_life.div(137e8));
		}
		return [life.toNumber() - 40, boost];
	},
	astronomerProduce(i: number) {
		let b = new Decimal(1.5);
		if (player.milestones.cb13) b = b.add(0.5);
		return new Decimal(5)

			.mul(Decimal.pow(b.mul(this.astronomers[i].boost), i))
			.mul(player.milestones.log_law1 ? 5 : 1)
			.mul(this.observeDataConvert())
			.mul(player.milestones.cb13 ? 2 : 1)
			.mul(player.milestones.cb15 ? 10 : 1);
	},
	observeDataConvert() {
		let convertgain = new Decimal(5);
		convertgain = convertgain.mul(player.milestones.log_law1 ? 10 : 1);
		convertgain = convertgain.mul(buyables.lgr_impr.effect(player.buyables.lgr_impr));
		return convertgain;
	},
	astronomerUpdate() {
		const speed = this.astronomerSpeed();
		player.buyables.lgr_emp = new Decimal(0);
		for (let i = 0; i < this.astronomers.length; i++) {
			this.astronomers[i].life = this.astronomers[i].life - (diff / 1000) * speed;
			let actualtime = (diff / 1000) * speed;
			if (this.astronomers[i].life < 0) {
				actualtime = this.astronomers[i].life + actualtime;
			}
			this.logarithm.calculate_datas = this.logarithm.calculate_datas.add(
				this.astronomerProduce(i).mul(actualtime),
			);
			if (this.astronomers[i].life <= 0) {
				this.astronomers.splice(i, 1);
				i--;
			} else player.buyables.lgr_emp = player.buyables.lgr_emp.add(1);
		}
		if (this.logarithm.in_dilate) {
			this.logarithm.highest_dilate = this.logarithm.highest_dilate.max(player.number);
		}
	},
	observe() {
		this.logarithm.observe_datas = this.logarithm.observe_datas.add(1);
	},
	observeConvert() {
		if (this.logarithm.observe_datas.lte(0)) return;
		this.logarithm.calculate_datas = this.logarithm.calculate_datas.add(
			this.observeDataConvert().mul(this.logarithm.observe_datas),
		);
		this.logarithm.observe_datas = new Decimal(0);
	},

	dilateEffect(): [num: Decimal, expo: Decimal] {
		return [
			this.logarithm.highest_dilate.pow(
				player.exponention.logarithm.upgrades_in_dilated.includes('39') ? 0.75 : 0.5,
			),
			this.logarithm.highest_dilate.pow(
				player.exponention.logarithm.upgrades_in_dilated.includes('39') ? 1.25 : 0.75,
			),
		];
	},
	dilateNerf(): Decimal {
		let base = new Decimal(2);
		if (this.logarithm.upgrades_in_dilated.includes('35'))
			base = base.sub(NUMTHEORY.tau1DilateEff());
		if (player.upgrades['44R']) base = base.sub(upgrades['44R'].effect());
		return base;
	},
};
