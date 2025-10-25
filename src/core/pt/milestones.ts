import Decimal from 'break_eternity.js';
import { MILESTONES } from '../mechanic';
import { player } from '../save';
export function totalAnalysisTimes() {
	return player.pt.analysis.reduce((a, b) => a + b);
}
export function initPTMilestones() {
	MILESTONES.create('pt_1', {
		requirement: new Decimal(1),
		currency: '证明论解析次数',
		displayName: 'M-7-1',
		show: true,
		description: '在时间碎片页面解锁nonrec包升级',
		get canDone() {
			return totalAnalysisTimes() >= 1;
		},
	});
	MILESTONES.create('pt_2', {
		requirement: new Decimal(2),
		currency: '证明论解析次数',
		displayName: 'M-7-2',
		show: true,
		description: '在每次证明论重置，每成功解析一次，获得50个时间碎片',
		get canDone() {
			return totalAnalysisTimes() >= 2;
		},
	});
	MILESTONES.create('pt_3', {
		requirement: new Decimal(3),
		currency: '证明论解析次数',
		displayName: 'M-7-3',
		show: true,
		description: '在每次证明论重置之后，获得1生活质量水晶',
		get canDone() {
			return totalAnalysisTimes() >= 3;
		},
	});
	MILESTONES.create('pt_4', {
		requirement: new Decimal(4),
		currency: '证明论解析次数',
		displayName: 'M-7-4',
		show: true,
		description: '在每次证明论重置之后，拥有2非递归重置次数',
		get canDone() {
			return totalAnalysisTimes() >= 4;
		},
	});
	MILESTONES.create('pt_5', {
		requirement: new Decimal(6),
		currency: '证明论解析次数',
		displayName: 'M-7-5',
		show: true,
		description: '在每次证明论重置之后，拥有4非递归重置次数',
		get canDone() {
			return totalAnalysisTimes() >= 6;
		},
	});
}
