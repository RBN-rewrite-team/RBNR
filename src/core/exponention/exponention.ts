import Decimal from 'break_eternity.js';
import { buyables, BUYABLES, upgrades, UPGRADES, type singleReq } from '../mechanic';
import { player } from '../save';
import ModalService from '@/utils/Modal';
import { format, formatWhole } from '@/utils/format';
import { Multiplication } from '../multiplication/multiplication.ts';
import {CHALLENGE} from '../challenge.ts';
const D179E308 = Decimal.pow(2, 1024);

export const Exponention = {
	initMechanics() {
		
	},
	reset(force = false) {/*
		if(this.gain().gt(0) || force) {
			player.exponention.exppower = player.exponention.exppower.add(this.gain());
			player.exponention.totalExppower = player.exponention.totalExppower.add(this.gain());
			player.stat.totalExppower = player.stat.totalExppower.add(this.gain());
		}*/
	},
	UIreset() {
		const gain = this.gain;
		if (player.firstResetBit & 0b100) return void Exponention.reset();
		ModalService.show({
			title: '指数重置',
			content:
				'你真的要重置吗？这将重置你之前大部分内容。<br>你将获得 ' +
				formatWhole(gain()) +
				' 指数能量和 ' + formatWhole(new Decimal(3)) + ' 生活质量点。',
			onConfirm() {
				Exponention.reset();
				//player.firstResetBit |= 0b100;
			},
		});
	},
	gain() {
		if(player.multiplication.totalMulpower.lt(D179E308)) return new Decimal(0);
		let base = player.multiplication.totalMulpower.log(2).root(2).div(32);
		return base;
	},
};