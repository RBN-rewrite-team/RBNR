import { player } from '@/core/global';
import Decimal from 'break_eternity.js';
import { Garden } from '../garden';
import { Oracle } from './oracle';
import { MILESTONES, upgrades } from '@/core/mechanic';
import { NON_REC_BMS } from '../../nonrecu/nonrec-bms/index.ts';
export function initSINMiletones() {
	MILESTONES.create('sin_1', {
		requirement: new Decimal(1000),
		currency: 'karma',
		displayName: 'M-SIN-1',
		show: true,
		get canDone() {
			return player.oracle.originalsin.karma.gte(1000);
		},
	});
	MILESTONES.create('sin_2', {
		requirement: new Decimal(8000),
		currency: 'karma',
		displayName: 'M-SIN-2',
		show: true,
		get canDone() {
			return player.oracle.originalsin.karma.gte(8000);
		},
	});
	MILESTONES.create('sin_3', {
		requirement: new Decimal('e1.35e12'),
		currency: 'pt_power',
		displayName: 'M-SIN-3',
		show: true,
		get canDone() {
			return player.pt.power.gte('e1.35e12');
		},
	});
	MILESTONES.create('sin_4', {
		requirement: new Decimal('e1.45e12'),
		currency: 'pt_power',
		displayName: 'M-SIN-4',
		show: true,
		get canDone() {
			return player.pt.power.gte('e1.45e12');
		},
	});
	MILESTONES.create('sin_5', {
		requirement: new Decimal('e1.6e14'),
		currency: 'pt_power',
		displayName: 'M-SIN-5',
		show: true,
		get canDone() {
			return player.pt.power.gte('e1.6e14');
		},
	});
	MILESTONES.create('sin_6', {
		requirement: new Decimal('ee15'),
		currency: 'pt_power',
		displayName: 'M-SIN-6',
		show: true,
		get canDone() {
			return player.pt.power.gte('ee15');
		},
	});
	MILESTONES.create('sin_7', {
		requirement: new Decimal('e6e15'),
		currency: 'pt_power',
		displayName: 'M-SIN-7',
		show: true,
		get canDone() {
			return player.pt.power.gte('e6e15');
		},
	});
	MILESTONES.create('sin_8', {
		requirement: new Decimal('200000'),
		currency: 'karma',
		displayName: 'M-SIN-8',
		show: true,
		get canDone() {
			return player.oracle.originalsin.karma.gte(200000);
		},
	});
	MILESTONES.create('sin_9', {
		requirement: new Decimal('2000000'),
		currency: 'karma',
		displayName: 'M-SIN-9',
		show: true,
		get canDone() {
			return player.oracle.originalsin.karma.gte(2000000);
		},
	});
	MILESTONES.create('sin_10', {
		requirement: new Decimal('66666666'),
		currency: 'karma',
		displayName: 'M-SIN-10',
		show: true,
		get canDone() {
			return player.oracle.originalsin.karma.gte(66666666);
		},
	});
}
export const SIN = {
	playerData() {
		return {
			karma: new Decimal(0),
		};
	},
	getSinValue() {
		return player.oracle.totalBits
			.div(5)
			.sub(5)
			.clampMin(0)
			.pow(0.5)
			.mul(Garden.level().div(2).sub(7.5).clampMin(0).pow(3))
			.mul(player.pt.power.log10().pow(0.5).add(Math.E).ln())
			.mul(
				player.milestones['sin_7']
					? player.pt.power.add(1e10).log10().log10().log10().add(1).pow(3).max(1)
					: 1,
			)
			.mul(player.milestones['sin_10'] ? NON_REC_BMS.effects()[1] : 1);
	},
	isUnlocked() {
		return (
			Oracle.isUnlocked() &&
			(player.hydra.totalCompressedPower.gte('1f1022') ||
				player.oracle.originalsin.karma.gte(1))
		);
	},

	loop(diff: number) {
		let karmaGain = this.getSinValue().mul(2);
		if (player.milestones['sin_8']) karmaGain = karmaGain.pow(1.75);
		if (player.upgrades['U6R33']) karmaGain = karmaGain.mul(upgrades['U6R33'].effect());
		player.oracle.originalsin.karma = player.oracle.originalsin.karma.add(karmaGain.mul(diff));
	},
} as const;
