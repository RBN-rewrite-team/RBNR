import Decimal from 'break_eternity.js';
import { MILESTONES } from '../mechanic';

export function initPTMilestones() {
	MILESTONES.create('pt_1', {
		requirement: new Decimal(114514),
		currency: '证明论解析次数',
		displayName: '何意味',
		show: true,
		description: '何意味',
		get canDone() {
			return false;
		},
	});
}
