import {player, feature} from '@/core/global';
import {format, formatWhole} from '@/utils/format';
import Decimal from 'break_eternity.js';

export function dayOfWeek(): [number, string]{
	const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
	let date = new Date();
	let dayOfWeek = date.getDay();
	return [dayOfWeek, weekdays[dayOfWeek]];
}

export const Analysis = {
	systems: ['PA'
	, 'KP'
	, 'Π<sub>1</sub>-CA<sub>0</sub>'
	, 'Π<sub>2</sub>-CA<sub>0</sub>'
	, 'Z<sub>2</sub>'
	, 'Z<sub>ω</sub>'
	, 'ZFC'],
	
	analysisUnlocked(id) {
		if(dayOfWeek()[0] == id) return true;
		if(dayOfWeek()[0] == 0) return true;
		return false;
	},
	
	singleAnalysis() {
		let d = dayOfWeek()[0];
		if(player.pt.analysis[d] >= 11) return;
		if(Math.random() <= 0.05 || player.pt.analysisFailed[d] >= 19)
		{
			player.pt.analysis[d]++;
			player.pt.analysisFailed[d] = 0;
		}
		else
		{
			player.pt.analysisFailed[d]++;
		}
	},
	
	playerData() {
		return {
			power: new Decimal(0),
			totalPower: new Decimal(0),
			resetTimes: new Decimal(0),
			analysis: [0, 0, 0, 0, 0, 0, 0],
			analysisFailed: [0, 0, 0, 0, 0, 0, 0],
		};
	},
}