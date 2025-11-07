import { dilated } from '@/core/exponention/dilated-function';
import { player } from '@/core/save';
import { VueLatex } from 'vatex';

export default {
	'title.rewritten': 'RBNR',
	'title.version': 'Garden Gamma',
	'tab.dungeon': 'Dungeon',
	'tab.successor': 'Successor',
	'tab.options': 'Options',
	'tab.settings': 'Settings',
	'tab.aboutgame': 'About',
	'tab.plot': 'Plot',
	'tab.stat': 'Statistics',
	'tab.achievements': 'Achievements',
	'tab.timeshard': 'Time shard',
	'tab.addition': 'Addition',
	'tab.multipl': 'Multiplication',
	'tab.primefactor': 'Prime factor',
	'tab.numbertheory': 'Number theory',
	'res.number': 'Number',
	'res.ordinal': 'Ordinal',
	'res.addpower': 'Addition power',
	'res.mulpower': 'Multiplication power',
	'res.number.required': '(Doing successor)',
	'about.themasterofthedevelopgroup': 'Dev group leader',
	'about.originalauthor': 'Original author',
	'about.coderepositorymanager': 'Code repo. manager',
	'about.programming': 'Programing',
	'about.planning': 'Planning',
	'about.balancing': 'Balancing',
	'about.plot': 'Plot',
	'about.mechanismdesign': 'Mechanism designing',
	'about.mathemodeling': 'Mathematicial modeling',
	'about.savebank': 'Save bank',
	'about.heyiwei': 'Mascot',

	'set.title.saveset': 'Save settings',
	'set.title.notations': 'Notations',
	'set.title.theme': 'Themes',
	'set.title.ui': 'UI',
	'set.save': 'Save game',
	'set.import': 'Import save file',
	'set.export': 'Export save file',
	'set.hardreset': 'RESET THE GAME',
	'set.saveslot': 'Change save slot',
	'set.beta': 'Enter Beta test',
	'set.gamma': 'Enter Gamma Test',
	'set.offline': 'Offline Progress',
	'set.savebank': 'Enter save bank',
	'set.setlang': 'Set language',
	'set.status': '{label}: {status}',
	'set.status.on': 'ON',
	'set.status.off': 'OFF',
	'set.enteredbeta': 'You have entered Beta test',
	'set.enteredgamma': 'You have entered Gamma test',
	'set.colorinverse': 'Color inversion',
	'set.grey': 'All grey',
	'set.blur': 'Blur',
	'set.oldalbum': 'Old album',
	'set.notation.0': 'Scientific notation',
	'set.notation.1': 'Engineering notation',
	'set.notation.2': 'Logarithmic notation',
	'set.notation.3': 'Standard notation',
	'set.notation.4': 'Hyper-E',
	'set.notation.5': 'Letter notation',
	'set.notation.6': 'Blank notation',
	'set.notation.7': 'Base-2 notation',
	'set.notation.8': 'Base-3 notation',
	'set.notation.9': 'Base-4 notation',
	'set.notation.10': 'Base-6 notation',
	'set.notation.11': 'Base-8 notation',
	'set.notation.12': 'Base-12 notation',
	'set.notation.13': 'Base-16 notation',
	'set.notation.14': 'Base-36 notation',
	'set.notation.15': 'Base-62 notation',
	'set.notation.16': 'Balanced ternary notation',
	'set.notation.17': 'Binary decimal notation',
	'set.notation.18': 'Base-1.5 notation',
	'set.notation.19': 'Base-Φ notation',
	'set.notation.20': 'Base-e notation',
	'set.notation.21': 'Base-π notation',
	'set.notation.22': 'Fast growing hierarchy',
	'set.notation.23': 'Hardy growing hierarchy',
	'set.notation.24': 'Omega notation',
	'set.notation.25': '1 to the power of',
	'set.notation.26': 'Slow growing hierarchy',
	'succ.successor': 'Do successor',
	'succ.addition': 'Add. ',
	'succ.automation': '(Auto. +{speed}/s)',
	'upg.locked': 'Locked',
	'upg.effect': 'Currently: {effect}', // 符合IMR显示效果currently习惯
	'upg.effect.byl': 'Currently: {effect}; Next: {next}',
	'upg.effectdbl.byl': 'Currently: {effect},{effect2}; Next: {next},{next2}',
	'upg.keep': 'Hold',
	'upg.automatoruseid': 'Automator using id: {id}',
	'req.res': 'Need {cost} {currency}',
	'req.upg': 'Need {upg}',
	'upg.cost': 'Cost: {cost} {currency}',
	'res.softcapped': '({amount} softcaps)',
	'currency.number': 'Number',
	'currency.addition': 'Addition power',
	'currency.multipl': 'Mult. power',
	'upgs.11': dilated('Unlock B0-1', 'Change the limit of buy counts of B0-1 to 1000', '11'),
	'upgs.12': dilated(
		'The successor button will +1 when a U0 upgrade is bought',
		'The successor button power will +*1.1 when a U0 upgrade is bought',
		'12',
	),
	'upgs.13': dilated('Unlock Addition Layer', 'Gain exponent +0.1 to addition power', '13'),
	'upgs.byl.11': 'Do successor per one second',
	'upgs.21': dilated(
		'U1 upgrades apply to the effect of U0-2',
		'U0-2 effect is raised by 1.5',
		'21',
	),

	'upgs.22': dilated('Successor gain multiplies by 4', 'Successor exponent +0.2', '22'),
	'upgs.23': 'The starting cost of B0-1 is 0, cap of bought amounts of B0-1 +50',
	'upgs.24': dilated('Unlock B1-1', '使B1-1加成b0-1 效果^(1+log（b1-1）/3）', '24'),
	'upgs.25': dilated(
		'Upgrade successor to addition, Keep U0 upgrades after addition reset',
		'挑战1效果不再有上限，但在1以上有软上限',
		'25',
	),
	'upgs.26': 'Unlock Multiplication Layer',
	'upgs.byl.21': 'Get free B0-1 after addition reset(In cap)',
	'upgs.31': function () {
		let counts = '1';
		let pronoun = 'its';
		if (player.upgrades['400q']) {
			counts = "<span style='font-size: 19px;'><b>2</b></span>";
			pronoun = 'their';
		}
		const text = dilated(
			'You can choose ' +
				counts +
				' U1 upgrades, make ' +
				pronoun +
				' cost decrease to 1. Do multiplication reset when selections are changed.',
			'后继运算指数+3',
			'31',
		)();
		return text;
	},
	'upgs.32': 'Hold successor upgrades',
	'upgs.33': 'U1 upgrades count^2 apply to the effect of U0-2',
	'upgs.34': 'Keep B1-1 after multiplication reset',
	'upgs.35': dilated('Unlock Number Theory', 'τ<sub>1</sub>减弱膨胀强度', '35'),
	'upgs.36': dilated(
		'每2个Prime Factor p<sub>n</sub>免费赠送一个p<sub>n-1</sub>',
		'每4个p<sub>n</sub>免费赠送1个p<sub>n+1</sub>',
		'36',
	),
	'upgs.37': dilated('乘法重置保留加法升级', '膨胀中保持B0-1', '37'),
	'upgs.38': dilated(
		'Get 1% of addition power in reset passively.',
		'每秒自动获取重置获取指数能量的1%',
		'38',
	),
	'upgs.39': dilated(
		'Unlock Multiplication Challenge, Buy max successor and addition buyables automatically, You can buy max multiplication buyables.',
		'膨胀中获得最高数值的效果变得更好',
		'39',
	),
	'upgs.310': 'Multiplication power gain ^1.1',
	'upgs.byl.31': 'Increase addition power gain',
	'upgs.byl.32': 'Mulplication power gain *2 per buy',
	'upgs.byl.33': 'Prime Factor effect will grow faster',
	'mul.effect': 'Total multiplication power gives {effect} to Number gain.',
	'mul.buypf': 'Need Prime Factor {pf}',
	'mul.byl33req': 'Need 10000 Factor power',
	'mul.youhavefp': 'You have {fp} Factor power',
	'mul.keep': function () {
		const counts = player.upgrades['400q'] ? '2 upgrades' : '1 upgrade';
		const pronoun = player.upgrades['400q'] ? 'their' : 'its';
		return (
			'You can choose ' +
			counts +
			' in U1-2, U1-3, U1-4, U1-5, make ' +
			pronoun +
			' cost decrease to 1. Do multiplication reset when selections are changed.'
		);
	},
	'mul.fpeffect':
		'Based on the duration of this multiplication, it provides {effect} Number and Addition power gains.',
	'upgs.byl.pf2': 'Factor power ×2',
	'upgs.byl.pf3': 'Factor power ×3',
	'upgs.byl.pf5': 'Factor power ×5',
	'upgs.byl.pf7': 'Factor power ×7',
	'upgs.byl.pf11': 'Factor power ×11',
	'upgs.byl.pf13': 'Factor power ×13',
	'upgs.byl.pf17': 'Factor power ×17',
	'upgs.byl.pf19': 'Factor power ×19',
	'upgs.byl.pf2.name': 'Prime Factor 2',
	'upgs.byl.pf3.name': 'Prime Factor 3',
	'upgs.byl.pf5.name': 'Prime Factor 5',
	'upgs.byl.pf7.name': 'Prime Factor 7',
	'upgs.byl.pf11.name': 'Prime Factor 11',
	'upgs.byl.pf13.name': 'Prime Factor 13',
	'upgs.byl.pf17.name': 'Prime Factor 17',
	'upgs.byl.pf19.name': 'Prime Factor 19',

	'nt.order': 'Number theory #{i}',
	'nt.euler': 'Euler function',
	'nt.euler.effect': '#1 Effect：Addition effect×',
};
