//English Localization
import { Currencies, getCurrency } from '@/core/currencies';
import { dilated } from '@/core/exponention/dilated-function';
import { getTotalTheories, secInThisReset52717273 } from '@/core/nonrecu/total-theories';
import { player } from '@/core/save';
import { wordShift } from '@/core/word-shift';
import { format, formatWhole } from '@/utils/format';
import Decimal from 'break_eternity.js';

import prssdefinition from '@/components/tabs/ordinalnt/ordinalnt5-content-en/prss-definition.txt?raw';
import prss1 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/prss-page-1-Pdef.txt?raw';
import prss2 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/prss-page-1.txt?raw';
import prss3 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/prss-page-2-1.txt?raw';
import prss4 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/prss-page-2-2.txt?raw';
import prss5 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/prss-page-2.txt?raw';
import prss6 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/prss-page-3-1.txt?raw';
import prss7 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/prss-page-4-1.txt?raw';
import prss8 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/prss-page-4-2.txt?raw';
import prss9 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/prss-page-4-3.txt?raw';
import prss10 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/prss-page-4-4.txt?raw';
import prss11 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/prss-page-5-1.txt?raw';
import prss12 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/prss-page-5-2.txt?raw';
import prss13 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/prss-page-6-1.txt?raw';
import prss14 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/prss-page-6-2.txt?raw';
import prss15 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/prss-page-7-1.txt?raw';
import prss16 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/prss-page-7-2.txt?raw';
import bmsdefinition from '@/components/tabs/ordinalnt/ordinalnt5-content-en/bms-definition.txt?raw';
import bmswellorder1 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/bms-wellorder-1.txt?raw';
import bmswellorder2 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/bms-wellorder-2.txt?raw';
import bmswellorder3 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/bms-wellorder-3.txt?raw';
import bmswellorder4 from '@/components/tabs/ordinalnt/ordinalnt5-content-en/bms-wellorder-4.txt?raw';
import bmswellorder from '@/components/tabs/ordinalnt/ordinalnt5-content-en/bms-wellorder.txt?raw';
import bmswellorder1prove from '@/components/tabs/ordinalnt/ordinalnt5-content-en/bms-wellorder-1-prove.txt?raw';
import bmswellorder2prove from '@/components/tabs/ordinalnt/ordinalnt5-content-en/bms-wellorder-2-prove.txt?raw';
import bmswellorder3prove from '@/components/tabs/ordinalnt/ordinalnt5-content-en/bms-wellorder-3-prove.txt?raw';
import bmswellorder4prove from '@/components/tabs/ordinalnt/ordinalnt5-content-en/bms-wellorder-4-prove.txt?raw';

export default {
	'title.rewritten': 'Road of Big Number Rewritten',
	'title.idlen': 'Road of Big Number (Special Idle Version)',
	'title.version': 'Fate Gamma/2nd Retribution Alpha',
	'tab.dungeon': 'Dungeon',
	'tab.successor': 'Successor',
	'tab.options': 'Options',
	'tab.settings': 'Settings',
	'tab.aboutgame': 'About',
	'tab.plot': 'Plot',
	'tab.stat': 'Statistics',
	'tab.achievements': 'Achievements',
	'tab.timeshard': 'Time Shards',
	'tab.addition': 'Addition',
	'tab.multipl': 'Multiplication',
	'tab.primefactor': 'Prime Factors',
	'tab.numbertheory': 'Number Theories',
	'tab.multipchal': 'Multi. Challenges',
	'tab.log_c': 'Log. Calculation',
	'tab.log_d': 'Log. Dilation',
	'tab.singularity': 'Sing. Generator',
	'tab.singularitytab': 'Singularity',
	'tab.ordinal': 'Ordinal',
	'tab.booster': 'Booster',
	'tab.hydra': 'Hydra',
	'tab.hydra_engine': 'Hydra Engine',
	'tab.y': 'Y Sequence',
	'tab.dilute': 'Dilution',
	'tab.nonrec': 'Non Recu.',
	'res.number': 'Number',
	'res.ordinal': 'Ordinal',
	'res.addpower': 'Addition Power',
	'res.mulpower': 'Multiplication Power',
	'res.number.required': 'Successor operation required',
	'res.ooms': ' OoMs',
	'res.oomsp': ' OoMs<sup>{level}</sup>',
	'res.oomspooms': ' OoMs<sup>OoMs</sup>',
	'about.themasterofthedevelopgroup': 'Dev group leader',
	'about.originalauthor': 'Original author',
	'about.coderepositorymanager': 'Code repo. manager',
	'about.programming': 'Programing',
	'about.planning': 'Planning',
	'about.balancing': 'Balancing',
	'about.plot': 'Plot',
	'about.mechanismdesign': 'Mechanism designing',
	'about.mathemodeling': 'Mathematical modeling',
	'about.savebank': 'Save bank',
	'about.heyiwei': 'Mascot',
	'about.fiveyeargaokao': 'FiveYearGaokao💯',
	'about.dlsdl': 'dlsdl',
	'about.dutexuehua': 'Dutexuehua',
	'about.jinghuoomega': 'GoldenApple125',

	'about.version': 'Version: Fate Gamma/2nd Retribution Alpha (v0.7.3 Gamma)',

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
	'set.colorinverse': 'Invert Color',
	'set.grey': 'Monotonic',
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
	'set.notation.23': 'Hardy hierarchy',
	'set.notation.24': 'Omega notation',
	'set.notation.25': 'Powers of 1',
	'set.notation.26': 'Slow growing hierarchy (base 10000)',
	'set.theme.0': 'Classic',
	'set.theme.1': 'Dark',
	'set.theme.2': 'Sun',
	'set.theme.3': 'Ocean',
	'set.setfont': 'Set font',
	'set.news': 'News bar',
	'set.title': 'Title bar',
	'set.guogao': 'Guogao Layer',
	'set.music': 'Music',
	'set.musicurl': 'Set Music URL',

	'stat.highest': 'Your highest {currency} is {amount}.',
	'stat.produced': 'You produced {amount} {currency}.',
	'stat.youhaveplayed': 'You have played for {time}.',
	'stat.moon':
		'(Northern Hemisphere) Moon phase: {phase}, <br>Age percentage: {age}%, <br>Earth-Moon distance: {distance} meters',

	'succ.successor': 'Do a successor operation',
	'succ.addition': 'Add. ',
	'succ.automation': '(Auto: +{speed}/s)',
	'upg.locked': 'Locked',
	'upg.effect': 'Currently: {effect}',
	'upg.effect.byl': 'Currently: {effect}; Next: {next}',
	'upg.effectdbl.byl': 'Currently: {effect},{effect2}; Next: {next},{next2}',
	'upg.keep': 'Keep ',
	'upg.automatoruseid': 'ID for automator usage: {id}',
	'req.res': 'Requires {cost} {currency}',
	'req.upg': 'Requires {upg}',
	'upg.cost': 'Cost: {cost} {currency}',
	'res.softcapped': '(softcapped^{amount})',
	'currency.number': 'Number',
	'currency.addition': 'Addition power',
	'currency.multipl': 'Mult. power',
	'currency.exponent': 'Exponentiation Power',
	'currency.qol': 'QoL Points',
	'currency.deduce_energy': 'Deduction Energy',
	'upgs.11': dilated(
		'Unlock B0-1',
		'Change the limit of available purchases of B0-1 to 1000',
		'11',
	),
	'upgs.12': dilated(
		'Increase successor effect by +1 per U0 upgrade bought',
		'The successor button power +*1.1 per U0 upgrade bought',
		'12',
	),
	'upgs.13': dilated('Unlock Addition Layer', "Addition power's gain exponent +0.1", '13'),
	'upgs.byl.11': 'Do a successor operation per second.',
	'upgs.21': dilated(
		'U1 upgrades apply to the effect of U0-2',
		'U0-2 effect is raised by 1.5',
		'21',
	),

	'upgs.22': dilated('Successor gain is multiplied by 4', 'Successor effect exponent +0.2', '22'),
	'upgs.23': 'The starting cost of B0-1 is 0, the max buyable purchases of B0-1 +50',
	'upgs.24': dilated(
		'Unlock B1-1',
		'Make B1-1 enhance B0-1 effect by a factor of ^(1+log(b1-1)/3)',
		'24',
	),
	'upgs.25': dilated(
		'Upgrade Succession to Addition, Keep U0 upgrades after Addition reset',
		"C1 effect's cap is changed to a soft cap.",
		'25',
	),
	'upgs.26': 'Unlock Multiplication Layer',
	'upgs.byl.21': 'Get free B0-1 purchases after addition reset (Within the limit)',
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
			"Successor's effect exponent +3",
			'31',
		)();
		return text;
	},
	'upgs.32': 'Keep all  successor upgrades ',
	'upgs.33': 'U1 purchases^2 apply to the effect of U0-2',
	'upgs.34': 'Keep B1-1 after multiplication reset',
	'upgs.35': dilated('Unlock Number Theories', 'τ<sub>1</sub> Reduce dilate strength', '35'),
	'upgs.36': dilated(
		'Get a free p<sub>n-1</sub> per 2 Prime Factor p<sub>n</sub> purchase quantity',
		'Get a free p<sub>n+1</sub> per 4 Prime Factor p<sub>n</sub> purchase quantity',
		'36',
	),
	'upgs.37': dilated(
		'Keep addition upgrades in multiplication reset',
		'Keep B0-1  in dilate',
		'37',
	),
	'upgs.38': dilated(
		'Get 1% of pending addition power/s passively.',
		'Get 1% of pending exponentiation power/s passively.',
		'38',
	),
	'upgs.39': dilated(
		'Unlock Multiplication Challenges, Buy max successor and automate addition buyables, You can buy max multiplication buyables.',
		'The effect of the highest number reached in dilation has improved.',
		'39',
	),
	'upgs.310': 'Multiplication powers gain ^1.1',
	'upgs.byl.31': 'Increase addition power gain',
	'upgs.byl.32': 'Mulplication power gain *2 per purchase',
	'upgs.byl.33': "Prime Factor's effect will grow faster",
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
			' cost decrease to 1. Will do a multiplication reset when any options are changed.'
		);
	},
	'mul.fpeffect':
		'Based on time passed inside this multiplication reset, {effect} number and addition power gain.',
	'mul.33': 'Instantly reach the limit',
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

	'upgs.byl.35R': 's<sub>1</sub>→s<sub>1</sub>+1',
	'upgs.byl.36R': 'x<sub>1</sub> exponent+0.085',
	'upgs.byl.37R': 'y<sub>1</sub> exponent+0.085',
	'upgs.byl.38R': 'B2-R1-1~4 Effect+2.5%(stack multiplication)',
	'upgs.byl.31R': 'x<sub>1</sub>→x<sub>1</sub>+1',
	'upgs.byl.32R': 'x<sub>2</sub>→x<sub>2</sub>+1',
	'upgs.byl.33R': 'y<sub>1</sub>→y<sub>1</sub>+1',
	'upgs.byl.34R': 'z<sub>1</sub>→z<sub>1</sub>+1',

	'upgs.31R': 'Add u<sub>1</sub> to x to obtain the velocity formula.',
	'upgs.32R': 'x<sub>1</sub> Exponent +0.3',
	'upgs.33R': 'y<sub>1</sub> Exponent +0.3',
	'upgs.34R': 'z<sub>1</sub> Exponent +0.3',

	'upgs.ts01': () =>
		player.stat.chapter == 0
			? 'x1.5 successor gain'
			: '<span style="color: red; font-weight: bold">(In Chapter 0)</span>',

	'upgs.ts02': 'x1.5 successor gain',
	'upgs.ts03': () =>
		player.stat.chapter == 0
			? 'x2 successor gain'
			: '<span style="color: red; font-weight: bold">(In Chapter 0)</span>',
	'upgs.ts11': () =>
		player.stat.chapter == 1
			? 'x1.5 addition power'
			: '<span style="color: red; font-weight: bold">(In Chapter 1)</span>',
	'upgs.ts12': 'x1.5 addition power',
	'upgs.ts13': () =>
		player.stat.chapter == 1
			? 'x2 addition power'
			: '<span style="color: red; font-weight: bold">(In Chapter 1)</span>',
	'upgs.ts21': () =>
		player.stat.chapter == 2
			? 'x2 multiplication power'
			: '<span style="color: red; font-weight: bold">(In Chapter 2)</span>',
	'upgs.ts22': 'x2 multiplication power',
	'upgs.ts23': () =>
		player.stat.chapter == 2
			? 'x3 multiplication power'
			: '<span style="color: red; font-weight: bold">(In Chapter 2)</span>',
	'currency.ts': 'Time shard',

	'nt.order': 'Number theory #{i}',
	'nt.euler': "Euler's totient function",
	'nt.euler.effect': 'Effect: Addition effect×',

	'chal.0.0': 'Challenge',
	'chal.0.0.description': 'No effect',
	'chal.0.0.effect': 'Addition operation exponent +{effect}',
	'chal.0.1': 'Division',
	'chal.0.1.description':
		'Number values and addition power acquisition undergo division; Factor effects diminish over time.',
	'chal.0.1.effect':
		'Based on Addition Power and the highest Number reached inside this challenge, increase Number gain. Currently: ×{effect}',
	'chal.0.2': 'Burning',
	'chal.0.2.description': 'The growth rate of number will be  divided by the existing value',
	'chal.0.2.effect': 'Number gain×{effect}',
	'chal.0.3': 'Reversal',
	'chal.0.3.description': `All pre-multiplication resources might be multiplied by -1 with a 50% chance/tick.q The multiplication reset's requirement is much higher (1.79e308 AP). B2-2 is disabled and you're trapped in challenge 3 too.`,
	'chal.0.3.effect': `First multiplication reset inside this challenge unlocks exponentiation Layer(1.79e308 Multi. Power outside challenge)<br>Multiplication Power×{effect}`,

	'chal.tip': "Click to start challenge{'|'}exit challenge",
	'modal.font': 'Enter and set font: ',
	'modal.font2': 'Set font',
	'modal.testcode': 'Enter test code',
	'modal.psdcode': 'test code',
	'modal.changesave1': 'Change save',
	'modal.changesave2': 'Slot #',
	'modal.yourcurrentslotis': 'Your current slot number is ',
	'detailstoHTML.version': 'Version:',
	'detailstoHTML.chapter': 'Chap. ',
	'detailstoHTML.res': 'Res:',
	'detailstoHTML.change': 'Change to this slot',
	'detailstoHTML.last': 'Last saved: ',
	plot: {
		[-1]: 'Please select an option',
		0: 'Prologue',
		1: 'Prologue 2',
		2: 'Chapter 1',
		3: 'Chapter 2',
		4: 'Multiplication Challenge',
		5: 'Chapter 3',
		6: 'Astronomer',
		7: 'Logarithm dilate',
		8: 'Singularity Generator',
		9: 'Chapter 4',
		10: 'Chapter 5',
		11: 'Dilute',
		12: 'Prion Virus',
		13: 'Chapter 6',
		14: 'Complete first NRC1',
		15: 'Milestone M-6-24',
		16: 'NRC7',
		17: 'Reach the limit of BMS',
		18: 'Retribution',
	},
	'plot.narrator': 'Narrator',
	'plot.title': 'Plot',
	'plot.select': 'Select a plot option',
	'plot.enter': 'Enter plot',
	'plot.search': 'Search options...',
	'plot.couldntfound': "Couldn't find options",
	plotcontent: [
		[
			'Big cardinals floating in the Ordinal Tower supports the Set theory Universe.',
			'And then, Numerorum woke up in the edge of the  "World of Googology".',
			'Numerorum\t...',
			'Numerorum\tFinally...I wake up.',
			'Numerorum looked at this world that feels both familiar and strange',
			'Numerorum\tThe world has changed a lot.',
			'Numerorum\tBut my mission is not yet completed...',
			'The Ordinal Tower looms faintly in the distance.',
			'Numerorum\tWhere should I start my mission?',
			'Numerorum\tThe negative numbers are far away, and they serve no purpose.',
			'Numerorum\tI shall start from Zero.',
		],
		[
			'As the first successor operation was done, Numerorum feels a familiar scent.',
			'Numerorum\tThis familiar feeling.',
			'Numerorum\tThese numbers strung together may be my only companions on this journey.',
			'Numerorum\tThough the road ahead is long, a good start is already, half the battle..',
			'Numerorum\tCome on?',
			'Where is the path? The path lies beneath your feet.',
		],
		[
			'Numerorum\tThis power has a soothing effect.',
			'Numerorum\tSpending that much number is worth it.',
			'Numerorum\tWait. Why do I feel like someone is watching me?',
			'Numerorum gazed up at the Ordinal Tower in the sky.',
			'The tower soars high into the clouds, its top lost from sight.',
			'Numerorum\tThe gaze emanates from the top of the tower.',
			"Those who can ascend to the pinnacle of the tower remain beyond Numerorum's current reach.",
			'Numerorum\tWho exactly built such a tall structure?',
			'Numerorum\tUnfortunately, I am still too weak to climb this tower.',
			'Numerorum\tI shall set a small goal:',
			'Numerorum\tFirst, I shall reach the level of the TRANSFINITE ordinals. Then, the path remains unknown...',
		],
		[
			'Numerorum\tFinally. My power feels more refined.',
			"Numerorum\tThe path I've chosen holds no error.",
			'Numerorum\tYet that gaze emanating from the Ordinal Tower grows ever more intense.',
		],
		[
			'Numerorum\tHmph... Time to take on something more challenging.',
			'Numerorum\tI hope to gain some experience from it.',
		],
		[
			"Numerorum\tI can feel it... I'm getting close.",
			'Numerorum\tJust a little more effort.',
			'Numerorum\tOnce I reach the tower, ',
			"Numerorum\tI'll likely draw some attention.",
			'The gaze from the tower hasnt faded—it grows stronger the closer Numerorum get.',
			'???\tHydra\t……',
			'Numerorum\tWhat was that?',
			'A mysterious voice flickers by.',
			"Numerorum\tThis is not good. I think I've been detected.",
		],
		[
			"Numerorum arrived at the astronomer's shop, perched on the cliff beside the tower.",
			'Numerorum\tYou are the astronomer? I need some help from you right now.',
			"Astronomer\tHello, I'm the leader of the astronomers. Do you need us to provide data, to help you with your calculations?",
			'Numerorum\tYes, I need this data now.',
		],
		[
			"Numerorum\tI've pretty much studied all these things. It's time to set off.",
			'Numerorum\tBut... the closer I get to Ordinal Tower, the stronger the suppression feels here.',
			"Numerorum\tI've gained new insights...",
		],
		[
			"Numerorum\tNice, sure enough, that's exactly how it is.",
			'Numerorum\tThe energy emitted by this object is so powerful, that it can SHATTER the barrier surrounding the tower.',
			'Numerorum\tHowever, I may have to pay a lot, or even everything, to activate it.',
		],
		[
			'Numerorum\tSo I reached ω.',
			'Numerorum\tIs this the interior of Ordinal Tower?',
			'Numerorum\tSuccessor, Addition, Multiplication, and exponentiation,',
			'Numerorum\tAll has been sacrificed, but I can continue in this area.',
		],
		[
			"Numerorum\tThere're... Wait!",
			'A voice suddenly filled this level of the tower.',
			"???\tHydra\tI'm truly impressed that you managed to get here.",
			'Numerorum\tWhere are you? Come out!',
			"???\tHydra\tHehehe, you're NOT worthy of seeing me.",
			'Numerorum\t...',
			"???\tHydra\tDon't be surprised—although you may never see me ever again.",
			"Numerorum\tDamn it, don't look down on me! ",
			"Numerorum\tEven if you're at the top of the tower, I will find you sooner or later!",
			`No matter what Numerorum said, the mysterious voice didn't respond.`,
		],
		[
			"Numerorum\tOh no, it's blocked up ahead.",
			'Numerorum\tWhat is this thing? Why does touching it make me feel dizzy...',
			'Numerorum felt as though all the strength had been drained from his body.',
			"Numerorum\tOh no, I've been ambushed! This thing is draining all my energy. I can't let this happen—I have to find a way to get past it.",
		],
		[
			"Numerorum\tAlright, I've finally figured out how this thing works... There are no traps whatsoever. I can keep drawing power from it endlessly.",
			'Numerorum\tNo need to pretend to be afraid of this prion virus anymore.',
		],
		[
			"Numerorum\tThis kind of energy is stronger than anything I've ever came across.",
			"Non-recursive energy's massive powers echoes within this floor of the tower.",
			'Numerorum\tThe potential when I fully uncover the powers within it... Would be massive.',
			'Numerorum\tMaybe I should start researching it.',
			'Numerorum tried using various methods to modify the non-recursive energy, and it ultimately forged into non-recursive theorems.',
			`Numerorum\tThis seems to be really useful. However, I think I should use them carefully. They don't come with ease.`,
			'Suddenly, Numerorum sees a familiar figure in front of him.',
			`Numerorum\tIt's you!You, surprisingly, went up the tower. How?`,
			'天文学家\tHehe, as an astronomer, naturally, I must stand up high.',
			'天文学家\tYou might not know how the non-recursive theorems work...',
			'天文学家\tWell, I have a few difficult challenges here……It may help you with your journey.',
			'The astronomer told Numerorum some challenges',
			'天文学家\tAs I had stayed in the towers for long, you may ask me some questions regarding it.',
			'Numerorum\tJust exactly how high is the tower?',
			`天文学家\tSo high that with your current power, you'll never reach the top.`,
			'天文学家\tWell, and there are two tyrants up in the towers, they will do everything and anything to limit others from strengthening.',
			'Numerorum suddenly thought of the mysterious voices heard before.',
			'天文学家\tFurthermore, please keep in mind that: When you gaze to the stars, the stars gaze back.',
			`Numerorum\tWhat you're saying is... The skies are conscious???`,
			'天文学家\tYes. Our astronomers are 100% confident om this topic. The entire sky shares the same mind.',
			`Numerorum\t(If it's like this, maybe my destiny could be fulfil……)`,
			`天文学家\tWell, it's almost just like that. Just keep continuing. There's many climbers in this tower, and some are trying to break through the barriers of the tyrants above.`,
			`天文学家\tFor example, there's a person called VeryRDefie, when he was climbing, \\(\\log_{\\alpha}(0)\\)he had been infected by the ω-virus, and he's nearly dying.`,
		],
		[
			'Numerorum finally completed one challenge.',
			`天文学家\tIt seems like you're closer to reaching the top of the tower.`,
			'The astronomer left.',
			'Numerorum\tIt seems like in here, prions would not only not give me help, but land me closer to death.',
			'There seems to be another person climbing nearby too, and he seems really nervous.',
			'Numerorum\tWho the heck are you?',
			'???\tVeryRDefie\tMy name is VeryRDefie.',
			`Numerorum\tHmm? So you're that person that the astronomer mentioned...`,
			`VeryRDefie\tYeah. If it wasn't for my intelligence, I'd have died in that stupid trap.`,
			'VeryRDefie\tAlso, who the heck are you?',
			`Numerorum\tCall me Numerorum. Also, what's the fuss about those traps?`,
			'VeryRDefie\tThe hydra has scattered a lot of traps within this part of the tower, some being \\(\\frac{1}{0}\\) while some being \\(\\ln(-x)\\), you need to be extra EXTRA careful.',
			`VeryRDefie\tEspecially the ω-virus. It's the most dangerous of them all. If you're infected with it, you're basically dead.`,
			'Numerorum\tI also saw some words being written on the walls……Are those……',
			'The text written on the walls, it identifies to be a tragedy occurring to a climber right here...',
			'VeryRDefie stared at it for a while, and thought deeply.',
			`VeryRDefie\tIt's that this person's Hydra Energy suddenly became negative. In this case, theres no way for that player to... reboot himself out of this state...`,
			'VeryRDefie\tJust a while ago, the Hydra has set up ω-virus traps in non-recursive challenge 1 and the exponentiation power (before you even reached the transfinite numbers!)',
			`Numerorum\tEhh! It's THAT dangerous! And it even spread beyond the Ordinal Tower?`,
			'VeryRDefie\tMe and my companions has already purged most of them towards oblivion already. However, I recommend to still be careful.',
			`VeryRDefie\tAlso, prions in challenges will never help you. You'll need to think of other solutions for those challenges...`,
			`VeryRDefie\t However, once you use yourselves' power to break through the challenges, you will have much stronger researches.`,
			'VeryRDefie shows new non-recursive researches.',
			'Numerorum\tThose seem really nice.',
			'Numerorum\tAlso... You said you have a companion... Exactly who?',
			`VeryRDefie\tThey're in other places. You might see them later.`,
		],
		[
			'Numerorum\tWoo! Those UNOCF milestones fell really great!',
			`???\tHydra\tDon't be so cocky. You haven't even passed Small Hydra Ordinal.`,
			'Numerorum\t...Time will prove your unworthiness one day.',
			"???\tHydra\tYou don't know the 'time' length. It may very long....",
		],
		[
			`Numerorum\tUNOCF is so powerful! But I somehow still couldn't reach (0)(1³)(2³)(3³)...`,
			'VeryRDefie\tActually, you can do this...',
			'VeryRDefie shows some new and ever-stronger non-recursive researches.(coming s∞n).',
			'Numerorum\tWell, I do agree.',
			'???\tHydra\t...',
			'VeryRDefie\tHm? That mysterious sound appeared again. He is so <$bx>, but the one who spreads the ω-virus is him too.',
			'???\tHydra\tYOU TWO, WILL FACE---',
		],
		[
			"Numerorum\tThis (Bashicu) matrix system basically is like that! Finished! What's next then?",
			`Numerorum's mind flashes.`,
			'Numerorum\tMaybe I can use my own inspirations to find/invent stronger systems. I even try and use all my powers to do this act...', // yòũ wìlļ façe retřibŭţiõn...
		],
		[
			'Numerorum\tStay calm.',
			'Numerorum\tThis seems to be the end of the non-recursive era.',
			'Numerorum\tI need to re-evaluate.',
			`Numerorum\tMaybe I've chosen the wrong path...?`,
			`Numerorum\tIf I can't continue from here, how did the tyrants even get beyond us?...`,
			`Numerorum\tWait, what's that?`,
			'A giant stone status appeared in front of his eyes.',
			'???\tColossus\tIs that... A visitor?',
			`???\tColossus\tIt's been long since I've seen anyone get here. Probably more than 67 decades.`,
			'Numerorum\tHuh? So the companions of mine...',
			'???\tColossus\tThe last visitor to ever stumble here is VeryRDefie. And long, long ago... There had also been another visitor - Alpha VII.',
			'Numerorum\tThen, have you seen an astronomer?',
			`???\tColossus\tNever. I'm Colossus, who are you then?`,
			'Numerorum\tNumerorum.',
			'Colossus\tOkay. I know you now.',
			'Colossus\tYou have reached the top of the so-called non-recursive analysis.',
			"Colossus\tThe road beyond this... Would be more challenging than what you've experienced so far.",
			'Numerorum\tThen, what should I do?',
			'Colossus\tHa...Have you ever heard of...',
			'Colossus\tthe Hydra?',
			'Numerorum\tHuh? That tyrant?',
			'Colossus\tYes. Only with the power of the Hydra could you get over the insanities beyond.',
			'Numerorum\tBut...',
			`Colossus\tDon't forget. You already have the Hydra's power, partially.`,
			'Colossus\tMaybe you should re-feel them again...',
			'Numerorum\tThe power of the hydra...',
			`Colossus\tRight. The so-called "limit" you've just reached, is just the tip of the iceberg of the hydra's power.`,
			'Colossus\tThe road of the upgrades are already, very clear.',
			'Numerorum\tAlong the path of the hydra?',
			'Colossus\tWell, yeah. Cum. Let me give you some inspiration...',
			'Colossus gave Numerorum some inspiration.',
			'Numerorum\tThanks. I seem to know how to continue from here.',
			"Numerorum\tBut this structure is vastly different from what I've been dealing with before...",
			`Colossus\tWell, then start again! It doesn't take much effort.`,
			'Colossus\tHaha, when the Hydra passed here, it brought me some surprises...',
			'Colossus\tHis goal then was to defeat the old king - Array.',
			'Colossus\tOh! The ones who strive to defeat the dragons, will become the dragon himself.',
			'Colossus\tInterestingly, after then, all attempts to exterminate the tyrant goes on the same path of the Hydra...',
			'Colossus\tMaybe except one guy who brought up with BEEF, but he was sent to ill-defined HELL.',
			'Colossus\t这是因循的果报.',
			'Colossus\t这是宿命的轮回.',
			`Numerorum\tPoof... I'm ready.`,
			'Colossus\tThen, come.',
			'Colossus\tWhat awaits you is a new era.',
		],
	],

	'tab.exponentation': 'Exponentiation',
	'tab.expupg': 'Exp. Upgrades',
	'tab.cb': 'Chess Board',

	'exp.effect.0': 'Cumulative exponentiation power provide {effect} Number gain.',
	'exp.effect.1': 'Loots provides {effect} Number gain.',

	'exp.normalupgs': 'Normal upgrades',
	'exp.qolupgs': 'QoL Points upgrades',
	'exp.youhaveqol': 'You have {amount} QoL Point(s)',

	'upgs.41': 'Add. Power and Mul. Power gain *10',
	'upgs.42': 'Succ./Add. operation exponent+0.1',
	'upgs.43': 'Number second soft cap is delayed by ^2',
	'upgs.44': 'Add. Power second soft cap is delayed by ^2',
	'upgs.45': 'Unlock Number Theory #2',
	'upgs.46':
		'Gain 1% of pending multi. power passively. Produce Challenge 4 completions based on mul. power',
	'upgs.47': 'Unlock the Chess Board',
	'upgs.48': 'Improve exponentiation power gain formula.',
	'upgs.49': 'Remove Challenge 4 Effect cap',

	'upgs.410': 'Factor power improves Add. Power and Mul. Power gain.',
	'upgs.411': 'Improve exponentiation power gain formula again',

	'upgs.byl.41': 'Factor power ^1.05',
	'upgs.byl.42': 'Number ^1.05',
	'upgs.byl.43': 'Addition power^1.03',
	'upgs.byl.44': 'Multi. power^1.01',

	'upgs.400q': "*2 U2-1's effect, and unlock a new upgrade in Number theory #1",
	'upgs.411q': 'Keep all successor upgrades and U2-2 .',
	'upgs.412q': 'The purchases of B0-1 will always be at least 1.',
	'upgs.413q': "Exp. Reset doesn't reset the reward of Challenge 1",
	'upgs.414q': "Exp. Reset doesn't reset U2-R1-1.",
	'upgs.415q': 'Automate buying prime factors 2, 3, 5 and 7.',
	'upgs.421q': 'Keep all addition upgrades',
	'upgs.422q': 'The number of B0-1 will always be greater than 10.',
	'upgs.423q': "Exp. Reset doesn't reset the reward of Challenge 2",
	'upgs.424q': "Exp. Reset doesn't reset B2-R1-1.",
	'upgs.425q': 'Automate buying prime factors 11, 13, 17 and 19',
	'upgs.431q': "Exp. Reset doesn't reset U2-3 and U2-4.",
	'upgs.432q': 'B1-1 effect will be enabled instantly',
	'upgs.433q': "Exp. Reset doesn't reset Challenge 3",
	'upgs.434q': "Exp. Reset doesn't reset B2-R1-2.",
	'upgs.435q': "Mul. Reset doesn't reset Prime Factor Time",
	'upgs.441q': 'Get 1% of add. power in reset passively.',
	'upgs.442q': 'Keep 100 purchases of B0-1.',
	'upgs.443q': 'Challenge 4 amount will not be less than (total MP)^0.001.',
	'upgs.444q': 'Automate ALL Buyables of Number theory #1',
	'upgs.445q': "Exp. Reset doesn't reset Prime Factor Time",
	'upgs.451q': 'Keep Multi. upgrades ',
	'upgs.452q': 'Automate B2-1 and B2-2.',
	'upgs.453q': 'C1, C2, C3 amounts are set to the highest number reached in this Expo. Reset.',
	'upgs.454q': 'Keep NT1 upgrades.',
	'upgs.455q': 'Keep 99 purchases of B2-3',

	'ach.0.0': 'Dao↓Li↑Sheng Yi',
	'ach.0.0.desc': 'Number reach 1',
	'ach.0.1': 'It took you NaN seconds to beat the game',
	'ach.0.1.desc': 'Started get numbers passively',
	'ach.0.2': 'SuccSuccSucc... = Addition',
	'ach.0.2.desc': 'Do an addition reset',
	'ach.0.3': 'Only work on reset',
	'ach.0.3.desc': 'Buy B1-1',
	'ach.0.4': '--->SuccSuccSucc... = Addition<---',
	'ach.0.4.desc': 'Buy U1-5',
	'ach.0.5': 'AddAddAdd... = Multiplication',
	'ach.0.5.desc': 'Do a multiplication reset',
	'ach.0.6': "It's free and not free.",
	'ach.0.6.desc': 'Buy U2-1',
	'ach.0.7': 'half',
	'ach.0.7.desc': 'Buy 50 U1-1',
	'ach.1.0': 'hole',
	'ach.1.0.desc': 'Buy 100 U1-1',
	'ach.1.1': 'P×r<sup>2</sup>×i×m×e×f×a×c×t×o',
	'ach.1.1.desc': 'Buy Prime factors',
	'ach.1.2': '100,000,000 is micro',
	'ach.1.2.desc': 'Get 100,000,000 numbers',
	'ach.1.3': 'Euler function',
	'ach.1.3.desc': 'Unlock number theory',
	'ach.1.4': 'payment not needed',
	'ach.1.4.desc': 'Buy U2-6',
	'ach.1.5': 'Auto buyers',
	'ach.1.5.desc': 'Buy U2-7',
	'ach.1.6': 'TS181, Prestige Layer #2, same as AD.',
	'ach.1.6.desc': 'Buy U2-8',
	'ach.1.7': 'Is there 23?',
	'ach.1.7.desc': 'Buy Prime factor 19',
	'ach.2.0': 'Softcap Era',
	'ach.2.0.desc': 'Trigger softcap',
	'ach.2.1': 'Challenging Era',
	'ach.2.1.desc': 'Buy U2-9',
	'ach.2.2': '(d^2/dx^2) x',
	'ach.2.2.desc': 'Buy B2-R1-3',
	'ach.2.3': 'MulMulMul... = exponentiation',
	'ach.2.3.desc': 'Do an exponentiation reset',
	'ach.2.4': '2 ExpPower',
	'ach.2.4.desc': 'Get 1e1233 MP',
	'ach.2.5': "That's fast",
	'ach.2.5.desc': 'Do an exponentiation reset on 1 mins',
	'ach.2.6': 'Four rows',
	'ach.2.6.desc': 'Buy 1st, 2nd, 3rd and 4th rows(not include 4-QOL-00)',
	'ach.2.7': 'Ceeeee vite',
	'ach.2.7.desc': 'Do an exponentiation reset on 1 secs',
	'ach.3.0': 'Auto MP Gain',
	'ach.3.0.desc': 'Buy U3-22',
	'ach.3.1': '√2 not in Q',
	'ach.3.1.desc': 'Unlock Number theory #2',
	'ach.3.2': 'Chessboardlogy comes a [REDACTED]',
	'ach.3.2.desc': 'Unlock Chessboard',
	'ach.3.3': 'The computer needs 1MiB to storage this number, But we use denary, NOT binary',
	'ach.3.3.desc': 'Get e1,048,575 Number',
	'ach.3.4': 'Double❌Triple✅👈😡',
	'ach.3.4.desc': 'Get Milestone M-CB-1',
	'ach.3.5': 'Bashicu Sudden Sudden Sudden Sudden Sudden Matrix System',
	'ach.3.5.desc': 'Buy U3-24',
	'ach.3.6': 'Fire an astronomer(delete)',
	'ach.3.6.desc': 'Hire an astronomer',
	'ach.3.7': 'EExxppoonneennttaattiioonn Era',
	'ach.3.7.desc': 'Get e6.871e10 Number',
	'ach.4.0': "Powerful Pushing...Also it's not very powerful",
	'ach.4.0.desc': "Buy U3-33(Translator tip: There's a time wall >15min, between 32-33)",
	'ach.4.1': 'Dilate',
	'ach.4.1.desc': 'Unlock Log. Dilation...shall be normal...?',
	'ach.4.2': 'Restart',
	'ach.4.2.desc': 'Enter dilation',
	'ach.4.3': 'DMiUlLaTte',
	'ach.4.3.desc': 'Buy U1-6 in Dilation',
	'ach.4.4': 'DCiHlAaLte',
	'ach.4.4.desc': 'Buy U2-9 in Dilation',
	'ach.4.5': '1/x',
	'ach.4.5.desc':
		"Unlock the singularity generator. It's almost the end. Now sacrifice to the blood god...",
	'ach.4.6': '10^^4',
	'ach.4.6.desc': 'Get ee1.000e10 number',
	'ach.4.7': '10^^100',
	'ach.4.7.desc': 'Get 1.000F100 number',
	'ach.5.0': 'Beyond Infinite',
	'ach.5.0.desc': 'Get ω Number',
	'ach.5.1': 'Linear Array Ordinal',
	'ach.5.1.desc': 'Get ω^ω Ordinal',
	'ach.6.0': 'Googology Theory',
	'ach.6.0.desc': 'See Number theory #9 before unlocked',
	'ach.6.1': 'Literal',
	'ach.6.1.desc': 'Just literal',
	'ach.6.2': "I'll happily smith some temporary runes for you.",
	'ach.6.2.desc': 'Get 2 days speeding time',
	'ach.6.3': 'ψ(Ω<sup>ψ(Ω<sup>7</sup>)</sup>)',
	'ach.6.3.desc': 'Get 10 days speeding time',
	'ach.6.4': 'Stack overflow',
	'ach.6.4.desc': 'Produce "Range error maximum call stack exceeded" in Automator',
	'ach.6.5': 'EIXIAB',
	'ach.6.5.desc': 'Click an "Baixie" Emoji when turn on color inversion',
	'ach.6.6': 'Did I see that wrong?',
	'ach.6.6.desc': 'Click the NRS button to the right of 112 when turn on blur.',
	'ach.7.0': 'Limited-time Achievement 1',
	'ach.7.0.desc': 'Get 1e6 number before first addition reset',
	'ach.7.1': 'Limited-time Achievement 2',
	'ach.7.1.desc': 'Get 1e6 addition power before first multiplication reset',
	'ach.7.2': 'Limited-time Achievement 3',
	'ach.7.2.desc': 'Enter HARD MODE, also 67',

	'upgs.byl.41R': 'x<sub>2,1</sub> += Level',
	'upgs.byl.42R': 'x<sub>2,2</sub>→x<sub>2,2</sub>+0.2',
	'upgs.byl.43R': 'y<sub>2,1</sub> += Level',
	'upgs.byl.44R': 'y<sub>2,2</sub>→y<sub>2,2</sub>+0.2',

	'upgs.41R': 'Join y into m, but exponent is set to 1/2',
	'upgs.42R': "Set y's exponent to 3/4",
	'upgs.43R': 'm affects Wheat grain base',
	'upgs.44R': 'm nerfs the tetrational nerf brought by logarithmic dilation.',

	'nt.rationalapprox': 'Rational approximation',
	'nt.ration.effect.1': 'Effect: Prime factor effect^',
	'nt.ration.effect.2': ', Prime factor speed×',
	'nt.ration.n': 'Increase n',
	'nt.ration.m': 'Increase m',

	'exp.cb.eff':
		'You have {a} wheat grain, Number^{b}, AP×{c} and ^{d},<br /> MP^{e}, MP overflow effect×{f}',
	'exp.cb.base': 'Square base: {base}',

	'currency.wheatgrain': 'Wheat grain',
	'upgs.byl.cb1': 'Add a square',
	'exp.cb.pre':
		' In ancient times, there was a king who wished to reward a wise minister for inventing chess... ',

	'exp.log.pre':
		'The discovery of logarithms, by saving labor, has prolonged the life of the astronomer. — Laplace',
	'exp.log.obsd': 'You have {amount} bytes of observation data,',
	'exp.log.cald': 'You have {amount} bytes of computational data.',
	'exp.log.conv': '1 Observation data -> {res} Comp. data',

	'upgs.byl.lgr_emp': 'Employ an astronomer',

	'upgs.byl.lgr_impr':
		'Improve logarithmic tables to enhance computational speed and extend the lifespan of astronomers.',

	'timeshard.t': 'You have {amount} time shards. Convert it for 3x global time speed.',
	'timeshard.t2': 'You have {amount} of potent time accelerants.',

	'timeshard.u1': 'Get 1000 TS, But enter HARD MODE',
	'set.status.locked': '(Locked)',
	'set.status.unlocked': '(Disabled)',
	'timeshard.gen': 'Time shard generator {tier}',
	'timeshard.conv': 'Time shard converter {tier}',
	'timeshard.conv.desc': 'Convert {amount} TS',
	'timeshard.conv.desc2': 'More {amount}% Times',
	'timeshard.gen.1': 'Cooldown: 1 hr<br>Prod: 10~50',
	'timeshard.gen.2': 'Cooldown: 24 hrs<br>Prod: 80~400',
	'timeshard.gen.3': 'Cooldown: 168 hrs<br>Prod: 1000~5000',
	'timeshard.gen.avaliable': 'Available',
	'timeshard.gen.waituntil': 'Please wait until',
	'plot.astronomer': 'Astronomer',
	'exp.log.observe': 'Obs.',
	'exp.log.calc': 'Use LT to calculate',

	'exp.log.tip': '3 laws need to reach computational data to active effect',
	'exp.log.law.req': 'Need {amount} Comp. Datas',
	'exp.log.law.1': 'Law 1',
	'exp.log.law.2': 'Law 2',
	'exp.log.law.3': 'Law 3',
	'exp.log.law.1.desc':
		'The orbits of planets around the Sun are elliptical, with the Sun located at one of the foci of the ellipse.',
	'exp.log.law.1.eff':
		'Boost computational speed by 10x and observation speed by 5x, reduce astronomers, LT cost base and exponent ( >=1 )',
	'exp.log.law.2.desc':
		'The line connecting a planet and the Sun sweeps out equal areas in equal intervals of time.',
	'exp.log.law.2.eff': 'EP acquisition enhanced by Computational Data',
	'exp.log.law.3.desc':
		"The cube of a planet's semi-major axis is proportional to the square of its orbital period.",
	'exp.log.law.3.eff':
		"Logarithmic tables, astronomers' base prices' exponents are reduced based on computational data.",

	'exp.log.law.g': 'Law of Universal Gravitation',
	'exp.log.law.yg': 'Yes, Law of Universal Gravitation',
	'exp.log.law.g.eff': 'Unlock Logarithm Dilation',

	'currency.膨胀中数值': 'Number reached in Dilation',
	'set.status.enter': 'Enter',
	'set.status.exit': 'Exit',
	'exp.log.law.dil': 'Dilate',
	'exp.log.law.dil.xx':
		'Number Exponential Tower reduced by {a} tiers. MP Exponential Tower reduced by {b} tiers. <br>Simultaneously, most QoL upgrades have been disabled, and certain buffs have been weakened.',
	'exp.log.law.dil.6':
		'Purchasing upgrades and buyables in Dilate will permanently enhance their effects.',
	'currency.膨胀中乘法能量': 'Mul. power  in Dilated',
	'nt.euler.effect.dil': ', dilate layer -',

	sing: 'Unlock Singularity Generator',

	'exp.log.law.dil.xx2':
		'The highest value of number({a}) obtained within the logarithm dilation will increase the gain of number (^{b}) and EP (*{c}).',

	'sing.curnum': 'Current Number:',
	sing1: 'THE END......HAS FINALLY DESCENDED......',
	sing2: 'DESTRUCTION......IS IMMINENT......',
	sing3: 'YOU CANNOT TURN BACK......',
	sing4: 'THE SINGULARITY IS BREAKING THE WORLD......',
	sing5: 'PREPARE FOR... A NEW WELCOME...',
	sing6: 'WELCOME TO THE WORLD OF ORDINALS. HAVE FUN.',

	'currency.ordinal': 'Ordinal',
	'sing.fin': `The Singularity Generator stops after crossing the edge of the finite and the transfinite.<br />
    When will The Singularity Generator be activated again?<br />
                At the end of all destruction, a more BRILLIANT REBIRTH shall dawn.<br />
                The World of Ordinals, Welcomes you.<br />`,
	'upgs.51': 'Increase Ordinal by 1 per second.',
	'upgs.52': 'Decrease base by 1',
	'upgs.53': 'Decrease base by 1',
	'upgs.54': 'Decrease base by 1',
	'upgs.55': "The ordinal's base ω-exponent boosts the speed of the ordinal.",
	'upgs.56':
		'The ordinal exponent multiplies the ordinal enhancement rate with a diminishing effect.',
	'upgs.57': 'The ordinal multiplies the ordinal enhancement rate with a diminishing effect.',
	'upgs.58': 'Unlock Number theory #3',
	'upgs.59': 'Unlock Booster',
	'upgs.510': "Ordinal's exponent with deduced effects increases ordinal speed",
	'upgs.511': 'Make U4-10 Effect Squared',
	'upgs.512': 'Number Theory #3 SGH base number increases by 1 per Second',
	'upgs.513': 'Decrease base number by 1',
	'upgs.514': 'Ordinal growth^1.53',
	'upgs.515': 'Improve NT3 formula',
	'upgs.516': 'Decrease base number by 1',
	'ord.1':
		'The ordinal base number is {amount}. It determines at which term of the fundamental sequence a carry occurs.',
	'nt.wait':
		"Huh? What kind of research is this? How come I haven't heard about it? Has anyone been here before?",

	'upgs.byl.51R': 'x<sub>3,1</sub>=x<sub>3,1</sub>+1',
	'upgs.byl.52R': 'Increase the SGH base number by 1',
	'upgs.byl.53R': 'Decrease the HH base number by 1',
	'upgs.byl.54R': 'Increase the growth rate of x_3 by +0.05 per second',
	'upgs.byl.55R': 'Increase x_3 by an exponential rate of +0.05 per second',
	'upgs.byl.61R': 'a = a + 1',
	'upgs.byl.62R': 'BMS progression speed ×2',

	'upgs.byl.51A': 'Booster multiplier increases speed by +0.01',
	'upgs.byl.52A': 'Accelerator Maximum Multiplier ×2',
	'upgs.byl.53A': 'Accelerator effect exponent +0.05',

	'upgs.51R': 'Decrease ordinal base by 1',
	'upgs.52R': 'Multiply ordinal by singularity energy',

	'nt.growhier.title': 'Growing Hierarchy',
	'nt.growhier.desc': 'Increases ordinal speed by τ<sub>1</sub>',
	'res.exppower': 'Exponentiation Power',

	'sing.gain': `You gain (SE+1){exponent}/{division} Singularity Energy per second.`,

	'sing.g.1': `You have <b style="color: var(--sing-color); font-size: 25px">{se}</b> Singularity Energy. This makes Number, Addition Power and Multiplication Power gain <b style="color: var(--sing-color)">^{exp}</b>`,
	'sing.g.2': `You have <b style="color: var(--sing-color); font-size: 25px">{se}</b> Singularity Energy. This makes Number and Addition Power, gain <b style="color: var(--sing-color)">^{exp}</b>`,
	'sing.g.3': `You have <b style="color: var(--sing-color); font-size: 25px">{se}</b> Singularity Energy. This makes Number gain<b style="color: var(--sing-color)">^{exp}</b>`,
	'sing.g.4': `You have <b style="color: var(--sing-color); font-size: 25px">{se}</b> Singularity Energy. Singularity Energy generates <b style="color: var(--sing-color)">{exp}</b> Number per second`,
	'sing.g.5': `You have <b style="color: var(--sing-color); font-size: 25px">{se}</b> Singularity Energy`,

	'sing.t.1': [
		'Number',
		'Addition Power',
		'Multiplication Power',
		'Exponentiation Power',
		'Singularity Energy',
	],
	'sing.t.2': ['Number', 'Addition Power', 'Multiplication Power', 'Singularity Energy'],
	'sing.t.3': ['Nu[]er', 'Add[]ion Power', 'Mul[]plicatio[]Power', 'Sing[]arity Energy'],
	'sing.t.4': ['EVERYTHING DESTRUCTS', 'EVERYTHING DECAYS', 'EVERYTHING FREEZES'],

	'sing.h.1':
		'There are too many {words}...I need to sacrifice my logarithm dilation and notation settings to go further...',
	'sing.h.2':
		'There are too many {words}...I need to sacrifice my logarithm calculation and softcaps to go further...',
	'sing.h.3': 'There are too many {words}...I need to sacrifice my chess board to go further...',
	'sing.h.4':
		'There are too many {words}...I need to sacrifice my Exponentiation Layer to go further...',
	'sing.h.5':
		'There are too many {words}...I need to sacrifice my Multiplication Challenge to go further...',
	'sing.h.6': 'There are too [][] {words}...I need to sacrifice my Prim[]Factor to go further...',
	'sing.h.7':
		'There are too [][] {words}...I need to sacrifice my Nu[]er Theo[]y to go further...',
	'sing.h.8': 'Before {words}, I need to sacrifice my Multiplication Layer...',
	'sing.h.9': 'Before {words}, I need to sacrifice my Addition Layer...<br />',
	'sing.h.10':
		'Before {words}, I need to sacrifice my Successor Layer...<br />THIS IS THE LAST WARNING......',

	'dung.hp': 'HP: ',
	'dung.atk': 'ATK: ',
	'dung.def': 'DEF: ',
	'dung.lv': 'LV: ',
	'dung.wlv': '(World LV:{lv})',
	'dung.xp': 'XP:',
	'dung.ore': 'Ore: ',
	'dung.ore.1': '(+{effect}% Global speed)',

	'upgs.51A': 'Accelerator Maximum Multiplier and speed increase based on Ordinal',

	'ord.acc': `Booster(Accelerator) multiplier to ordinal is ×{eff}({q}, Maximum: {c})`,
	'tab.help': 'Help',

	'currency.hydra': 'Hydra Energy',
	'hydra.milestonenotget': 'NOT ACHIEVED',
	'hydra.youhavededuced': 'Progressed through BMS {deduce} times',

	'res.hydra': 'Hydra Energy',
	'hydra.reset': 'RESET.',
	'hydra.currentresetmakesmu': "Current reset's effect +{effect}",

	'hydra.prestiges.1.lock': 'Unlocked at ≥2 basic multiplier',
	'hydra.prestiges.2.lock': 'Unlocked at Prestige Effect≥20x',
	'hydra.prestiges.3.lock': 'Unlocked at Ascension Effect≥+1',
	'hydra.prestiges.4.lock': 'Unlocked at Transcension Effect≥*1e10',
	'hydra.prestiges.1.auto': 'First Transcension unlocks this automation.',
	'hydra.prestiges.2.auto': 'First Recursion unlocks this automation.',
	'hydra.prestiges.auto': 'Automation not available yet.',

	'dung.ore.2': 'Activate Gemstone effect.',
	'dung.boxes.collect': 'Chests collected: ',
	'dung.core': 'Core',
	'dung.core.equip': 'Equip!',
	'dung.core.storeequipments': 'Equipment in storage',
	'dung.core.levels.0': 'Normal',
	'dung.core.levels.1': 'Rare',
	'dung.core.levels.2': 'Epic',
	'dung.core.levels.3': 'Legendary',
	'dung.core.levels.4': 'Mythical',
	'dung.core.levels.5': 'Undying',

	'upgs.61':
		'<span style="font-size: 14px">Activate BMS Progression, with a base speed of 0.1/s, and the ordinal reached in BMS directly boosts the ordinal.<br>\t\t\t  <span style="color: red">SACRIFICES SOME BUYABLES AND UPGRADES.</span></span>',
	'upgs.62':
		'Based on total Hydra Energy, gain a certain percentage of potent Hydra Energy and Multiplier on reset.',
	'upgs.63':
		'Prestiging and Ascending no longer resets Hydra Energy, and Prestiging no longer resets multiplier.',
	'upgs.64':
		'Transcension no longer resets Hydra Energy, Ascension no longer resets multiplier, and Prestiging no longer resets ANYTHING.',
	'upgs.65':
		'All types of resets no longer reset anything, and unlock <b><i>Number Theory 4</b></i>.',
	'upgs.66': 'Set the thresholds for Auto Prestiging and Ascending to +0 and x1.',
	'upgs.611': 'Total Hydra Energy boosts BMS progression speed.',
	'upgs.612': 'x2 BMS Progression speed.',
	'upgs.613': 'Improve the effect of Ascension.',
	'upgs.614': 'Current Hydra Energy increases the gain of Multiplier.',
	'upgs.615': 'Gain an extra B5-1-2 every 5 purchases of B5-1-3 beyond 40 purchases of B5-1-2.',
	'upgs.616': 'Increase the effect of U5-1-1 by ^+0.01 per B5-1-3 bought.',
	'upgs.617': 'Increase the base of B5-1-2 based on Hydra Energy.',
	'upgs.618': "Recursion's effect nerfs the 1st softcap of Prestiging and Ascending.",
	'upgs.619': "Recursion's effect nerfs the 1st softcap of Hydra Energy.",
	'upgs.6110': "Recursion's effect lower the cost of B5-1-2~4.",
	'upgs.6111':
		'Remove the 1st softcap of Hydra Energy gain. U5-1-8 boosts the gain of Hydra Energy.',
	'upgs.6112': 'Remove the softcap of B5-1-2.',
	'upgs.6113':
		"Remove the 1st softcap of Prestiging and Ascending. B5-1-4's effect boosts the effect of Recursion.",
	'upgs.6114': "Synergize ascension's effect and the effect of B5-1-2.",

	'res.infinite': '5 update hours',
	'res.uni': 'universe age',
	'res.century': 'century',
	'res.year': 'year',
	'res.day': 'day',
	'res.hour': 'hour',
	'res.minute': 'min',
	'res.second': 'sec',

	'upgs.ts01.name': 'CHAPTER 0 ACCELERATION PACK',
	'upgs.ts02.name': 'CHAPTER 0 PERMANENT PACK',
	'upgs.ts03.name': 'CHAPTER 0 HYPER PACK',
	'upgs.ts11.name': 'CHAPTER 1 ACCELERATION PACK',
	'upgs.ts12.name': 'CHAPTER 1 PERMANENT PACK',
	'upgs.ts13.name': 'CHAPTER 1 HYPER PACK',
	'upgs.ts21.name': 'CHAPTER 2 ACCELERATION PACK',
	'upgs.ts22.name': 'CHAPTER 2 PERMANENT PACK',
	'upgs.ts23.name': 'CHAPTER 2 HYPER PACK',
	'hydra.prestiges.1': 'Prestige',
	'hydra.prestiges.2': 'Ascension',
	'hydra.prestiges.3': 'Transcension',
	'hydra.prestiges.4': 'Recursion',
	'hydra.autoreset': '<span style="writing-mode: vertical-lr">Auto Reset: {status}</span>',

	'upgs.mil.cb1': 'Wheat Grains multi. base 2 → 3',
	'upgs.mil.cb2': 'The formula for the cost of the chessboard tiles is improved.',
	'upgs.mil.cb3': 'Increase Wheat Grains multi. base based on tiles in the chessboard.',
	'upgs.mil.cb4': 'Exponentiation Power gain x10.',
	'upgs.mil.cb5': 'UNLOCK THE LOGARITHMIC OPERATION.',
	'upgs.mil.cb6':
		'Based on exponentiation power,chessboard multi. base×{effect},and nerf the overflows of the number and addition power.',
	'upgs.mil.cb7': 'Double the effect of milestone 6.',
	'upgs.mil.cb8': 'Unlock τ<sub>2B</sub>',
	'upgs.mil.cb9':
		'Every tile in the chessboard increases observation data gain by x+0.01, and nerf the softcaps of all effects of Wheat Grains.',
	'upgs.mil.cb10': 'Each law increases rice gain by ^1.05.',
	'upgs.mil.cb11': 'Increase the base Wheat Grains multi. from 3 to 4',
	'upgs.mil.cb12': "Divide chessboard tiles'\ buyables'\ costs by (Calculation data)<sup>2</sup>",
	'upgs.mil.cb13': "Double calculation speed, and increase astronomer's base from 1.5 to 2",
	'upgs.mil.cb14': 'Number gain exponent ^1.125,and nerf the 5th softcap of number gain.',
	'upgs.mil.cb15': 'x10 the lifespan and the calculation speed of the astronomers.',
	'upgs.mil.cb16': 'Remove the softcap of current effects of wheat grains.',
	'upgs.mil.cb17': 'Astronomer lifespan ×2,But multiply the timespeed of astronomers by 200.',
	'upgs.mil.cb18': "Based on observation data, chessboard tiles'.s base ×{effect}",
	'upgs.mil.cb19':
		'Boost the 5th effect of wheat grains and remove its softcap, and exponentiate the exponent of multiplication power by {effect}.',
	'upgs.mil.cb20':
		"You can buy fractional amounts of chessboard tiles, chessboard tiles'\ purchasable amount is increased based on exponentiation energy.<br>Effect: ×{effect}",
	'upgs.mil.cb21': "Square M-CB-20's effect.",
	'upgs.mil.cb22': "Square M-CB-20's effect, again",
	'upgs.mil.cb23': "^1.1 M-CB-20's effect.",
	'upgs.mil.cb24': "^pi M-CB-20's effect.",
	'upgs.mil.log_law1': "Actually, this milestone is hidden, you shouldn't see it",
	'upgs.mil.log_law2': "Actually, this milestone is hidden, you shouldn't see it",
	'upgs.mil.log_law3': "Actually, this milestone is hidden, you shouldn't see it",
	'upgs.mil.log_G': "Actually, this milestone is hidden, you shouldn't see it",
	'upgs.mil.dil_1': 'Automatically buy max exponentiation buyables.',
	'upgs.mil.dil_2': "Automatically buy max chessboard tiles' buyables.",
	'upgs.mil.dil_3': "Automatically buy max Number Theory 2's buyables.",
	'upgs.mil.dil_4': 'Gain 1000% of pending exponentiation power per second.',
	'upgs.mil.dil_5': 'Produce observation data based on calculation data.<br>Effect: +{effect}/s',
	'upgs.mil.dil_6': 'Increase EP gain based on Wheat Grains.<br>Effect: ^{effect}',
	'upgs.mil.dil_7': 'UNLOCK<b><i>SINGULARITY GENERATOR</i></b>',
	'upgs.mil.dut1': 'Keep U5-1-1,and improve its formula.',

	'upgs.mil.dut2': 'Automatically buy max all U5-x upgrades.',
	'upgs.mil.dut3':
		'Prestiging no longer resets anything, and permanently unlock its automation. Only in Solvent VII, Show all upgrades at the beginning.',
	'upgs.mil.dut4':
		'Ascension no longer resets anything and permanently unlock its automation. Keep U5-2',

	//这里溶剂翻译成Solvent, 溶液翻译成Solution,稀释翻译成Dilute

	'upgs.mil.dut5':
		'Based on the highest hydra energy reached within Solvent 7 level 1 and Solvent 6 level, massively boost BMS progression speed. Effect: ^{effect}({cur})`',
	'upgs.mil.dut6':
		'Boost BMS progression speed based on Solution beyond 2,050,000. <br>Effect: ^{effect}',
	'upgs.mil.dut7':
		"(DOESN'T RESET ON DILUTION) Total hydra energy boosts BMS progression speed. <br>Effect: ^{effect}",
	'upgs.mil.dut8': 'Nerf the 2nd softcap of Hydra energy gain.',
	'upgs.mil.dut9':
		'Automatically buy max B5-1-x buyables, and you can buy an non-integer amount of them.',
	'upgs.mil.dut10':
		"Keep U5-1-2~4 forever, and buying dilution upgrades doesn't cost solution anymore.",
	'upgs.mil.dut11': "Solvent VI's scale interval is now 0.25.",
	'upgs.mil.dut12': 'Nerf the 2nd softcap of Hydra Energy.',
	'upgs.mil.dut13': "You can gain the boost of U5-S-7 even if Solvent III's level isn't 10.",
	'upgs.mil.dut14': "+1000% U5-2's effect.",
	'upgs.mil.dut15':
		"M-Dilute-5's effect doesn't base on Solvent 6's level anymore, and instead the effect calculation acts like Solvent 6's level being 10.",
	'upgs.mil.dut16':
		"The number of prions boost BMS progression speed. Dilution doesn't reset Prions anymore. <br>Effect: {operation}{effect}",
	'upgs.mil.dut17':
		'Total Hydra Energy accelerates the replication speed of Prions. <br>Current: *{effect}<br>',
	'upgs.mil.dut18': "M-Dilute-5's effect boosts M-Dilute-17 and M-Dilute-16's effects.",
	'upgs.mil.nonrec_1':
		"1. Every non-recursive reset, *7.5 and +^0.01 Multiplier. <br> 2. Prestige/Ascension/Transcension/Recursion's Automation will be unlocked when the corresponding reset is done within a reset. <br> 3. BMS Progression speed *3.",
	'upgs.mil.nonrec_2':
		'All resets within the Hydra Energy tab no longer resets anything, and their thresholds are set to +0 and *1. <br>Keep U5-2, and its effect will never go below 100%.',
	'upgs.mil.nonrec_3':
		"1. Based on non-recursive resets, increase the base effects for prestige and transcension.<br>2. Remove the 1st softcap of Hydra Energy, and nerf the 2nd softcap of Hydra energy by /+0.01 every reset.<br>3. Global speed doesn't alter the speed of the timer of Solvent III. Prions don't doing anything before purchasing U-S-9, and Solvent IV only bans Number Theories.",
	'upgs.mil.nonrec_4':
		"1. Every non-recursive reset increases the time limit of Solvent III by 1 second.<br>2. Total Solvents' nerf onto BMS progression speed is weakened. <br>3. The base of BMS progression speed is set to 1/s.<br>4. U5-2's effect is at least 200%.",
	'upgs.mil.nonrec_5': 'Keep U5-5, U5-1-5, U5-R1-5, U5-S-5 unlocked. ',
	'upgs.mil.nonrec_6':
		"Increase U5-1-2 (100%→1000%)，U5-1-5，U5-R1-2(^1.125→^1.25)，U5-2，U5-S-9(×2/s→×10/s)'s effects.",
	'upgs.mil.nonrec_7':
		"You start with yourselves being immune to prions, and you can increase M-Dilute-5's effect anywhere, and the first 5 dilution milestones are always unlocked.",
	'upgs.mil.nonrec_8':
		"Start by keeping U5-1-1~4, keep Number Theory 4's upgrades and automate Number Theory 4's buyables.",
	'upgs.mil.nonrec_9':
		'Start with all Hydra Engine upgrades&buyables and dilution upgrades unlocked, and keep M-Dilute-15.',
	'upgs.mil.nonrec_10':
		'Automate all Hydra Engine upgrades and buyables, keep M-Dilute-10, and automatically buy all dilution upgrades.',
	'upgs.mil.nonrec_11': "Add a prion factor to the non-recursive energy gain's calculation.",
	'upgs.mil.nonrec_12': 'Keep 1% of solution after a non-recursive reset.',
	'upgs.mil.nonrec_13': 'Start with 1e150,000,000 Prions in <i>normal</i> non-recursive resets.',
	'upgs.mil.nonrec_14': 'Non-recursive resets no longer resets solution.',
	'upgs.mil.nonrec_15': 'Non-recursive resets no longer reset the effect of U5-S-15.',

	'upgs.mil.nonrec_16':
		"Remove B5-1-2's hardcap and Ascension's 3rd and 4th softcap. Ascension's effect accelerates the replication speed of prions, if you're not in a non-recursive challenge.",
	'upgs.mil.nonrec_17': 'Gain (NRC5 completions) non-recursive resets per second, passively.',
	'upgs.mil.nonrec_18': "Unlock <i>non-recursive upgrades. The first one's at e230. </i>.",
	'upgs.mil.nonrec_19': 'Unlocks <b>UNOCF</b>',
	'upgs.mil.nonrec_20': 'UNOCF progression speed *1,000.',
	'upgs.mil.nonrec_21': 'Dilate Hydra Energy gain by 1.2...',
	'upgs.mil.nonrec_22':
		'Prion gain speed (double exponent)*1.3, Only applies in NRC6 or not being in any challenge. (milestones after this will requires 2.25NRC6 challenge amount)',
	'upgs.mil.nonrec_23': 'Buff the 4th effect of UNOCF, and UNOCF progression speed ^1.75.',
	'upgs.mil.nonrec_24': 'BMS progressing speed (double exponent)^2',
	'upgs.mil.nonrec_25': 'Solution Gain^20',
	'upgs.mil.nonrec_26':
		'UNLOCKS <b>NUMBER THEORY 5 - WELL-ORDEREDNESS</b> and a new row of upgrades.',
	'upgs.mil.pt_1': 'Unlock the non-recursive pack in the time shards tab.',
	'upgs.mil.pt_2': 'Get 50 TS per analyse successfully',
	'upgs.mil.pt_3': 'Gain 1 QoL Crystal after every Proof Theory reset.',
	'upgs.mil.pt_4': 'Keep 2 non-recursive resets after each Proof Theory reset.',
	'upgs.mil.pt_5': 'Keep 4 non-recursive resets after each Proof Theory reset.',
	'upgs.mil.pt_6': 'Unlocks <i>Garden</i><br>(actually just a replica of C2S)',
	'upgs.mil.pt_7':
		'Unlock the reset command in the Proof Theory pack in the automator, in the time shards tab.',

	'studies.dung.0': '+2 additional health per level',
	'studies.dung.1': 'Base Attack +1',
	'studies.dung.2': 'Base HP + 5',
	'studies.dung.3': 'HP*1.5',
	'studies.dung.4': 'ATK*1.2',
	'studies.dung.5': 'Base HP+15',
	'studies.dung.6': 'HP*1.5',
	'studies.dung.7': '+2 additional atk per level',
	'studies.dung.8': '+3 additional health per level',

	'hydra.prestiges.1.desc':
		'Additional Multipliers and Progression Speed<br />x{from}→{to}(Effect×{aft} after reset)',
	'hydra.prestiges.2.desc': 'Additional exponentiation<br />+{from}→{to}',
	'hydra.prestiges.3.desc': 'Multiplier gain<br />×{from}→{to}',
	'hydra.prestiges.4.desc': 'The exponent of the Prestiging and transcension<br />×{from}→{to}',
	'hydra.prestiges.auto.interval': 'Automatic Reset Threshold: +{add} & x{mul}',

	'upgs.byl.611': 'BMS progressing speed ×+1',
	'upgs.byl.612': 'Basic exponent+0.01',
	'upgs.byl.613': 'Multiplier obtain speed×1.1',
	'upgs.byl.614': 'Hydra energy softcap effect ^0.9',

	'nt.growingmode': 'Growing mode ',
	'nt.growingmode.eff': 'τ<sub>4</sub> effects the speed of BMS progressing and U5-2',
	'nt.growingmode.eff2': 'τ<sub>4</sub> reduces the speed of BMS progressing and U5-2',
	'nt.growingmode.en': "The effect of the \\textit{'{'}nth{'}'} hydra reset.",
	'nt.growingmode.c':
		'The upgrades and buyables will not cost anything if the resource of the UPGS & BYLS is x<sub>4</sub>, τ<sub>4</sub>',

	'upgs.61R': 'Improve the formula of f(x) to log<sub>2</sub> x',
	'upgs.62R': 'U5-1-1 effect ^1.125',
	'upgs.63R': "f(x) get an exponent effect based on the prestiging's effect",
	'upgs.64R': "τ<sub>4</sub>'s effect is raised to 10",
	'upgs.65R': "Hydra energy bonus the recursion's effect",
	'upgs.66R': 'Set the logarithmic base of g(x) to 5',
	'upgs.67R': 'Set the logarithmic base of g(x) to 2',
	'upgs.68R': function () {
		return (
			'The U5-R1-5 buff applies a reduced effect to Ascension.' +
			(player.retribution == 1 ? '<br>THE RETRIBUTION bonuses this upgrade.' : '')
		);
	},
	'upgs.69R': 'UNLOCK <b>DILUTION</b>',
	'upgs.621R': 'x<sub>4</sub> bonus compressed hydra energy',
	'upgs.622R': 'τ<sub>4</sub> bonus U5-2-2 effect',
	'upgs.61S': 'Solution significantly boost the effect of U5-1-1.',
	'upgs.62S': 'Solution boosts Progressing speed',
	'upgs.63S':
		'Total Hydra Energy boosts Progressing speed(This upgrade will be reduced in dilution).',
	'upgs.64S': 'Solution (unspend) boosts Progressing speed',
	'upgs.65S': 'Total Solution boosts multiplier gain.',
	'upgs.66S': 'Unlock 4 upgrade in Hydra Engine',
	'upgs.67S': 'M-Dilute-5 effect ^1,35 if The level of Solvent III is 10.',
	'upgs.68S': 'Reduce softcap^2 of Hydra Energy gain',
	'upgs.69S':
		'The prion virus will not destruct the dilution. The prion virus boosts Progressing speed. You can obtain the prion virus at anytime(×2/s)',
	'upgs.610S': "Total Solution boosts the base of the Prion Virus' speed",
	'upgs.611S': 'Enable B5-1-2 in Dilution',
	'upgs.612S':
		'Significantly reduce softcap^2 of Hydra Energy gain, Improve the effect of M-Dilute-7',
	'upgs.613S': 'Hydra energy will reduce softcap^2 of Hydra Energy gain.',
	'upgs.614S':
		"Remove the 2nd softcap of Ascension and Recursion. Solvent III's debuff is nullified.",
	'upgs.615S':
		'Highest BMS progression reached within APOCALYPSE will massively boost BMS progression speed. <br><i>the end is near...</i>',

	'upgs.616S': 'UNLOCK <b>NON RECURSION-RECURSION</b>(need ψ(Ω<sub>ω</sub>) Ordinal)',

	'dil.res1': 'You have {res}{res2}Solution<br />Makes BMS Progressing speed×{effect}',
	'dil.res1.a': '({res} in this dilution)',
	'dil.prion': 'You have {res}{res2} Prion',
	'dil.selfdes': 'The Solvent will {result}(after enable dilution)',
	'dil.selfdes.possible': 'may self-destruct',
	'dil.selfdes.aftertime': 'self-destruct after {time}',
	'dil.selfdes.impossible': 'not self-destruct',

	'dil.limitsol1': 'Certain solvent types will restrict the minimum grade of Solvent I',
	'dil.solutioncap':
		'The maximum number of solutions obtainable for the current solvent configuration: {cap}',
	'dil.least1': 'Select at least one solvent and upgrade its level to enable dilution.',
	'dil.left': `When enable dilution, you will restart the progress of the 5th layer and suffer the consequences of your own choices.<br />

As a reward, you can obtain solution.<br />
The selected dilution level significantly impacts the amount of Solution obtained, while the dilution progress has a minor effect on the amount of Solution obtained.<br />
You progressed through BMS {b} times in {a}. You obtain {c}({d}) Solution because of this.
`,
	'dil.solvdebuff':
		'The progressing speed is divided by {a} because of the sum of the level of solvents.',

	'dil.1': 'SOLVENT I: TEMPORAL BLACK HOLE',
	'dil.1.desc':
		'"Though it\'s unfortunate, at least you can take comfort in the fact that you\'ve lived longer than others."',
	'dil.1.eff': 'The progressing speed and multiplier-collecting speed are divided by {eff}.',
	'dil.2': 'SOLVENT II: u said i have dementia? u said i have dementia? u said i have dementia?',
	'dil.2.desc': '"You\'re becoming more and more forgetful..."',
	'dil.2.eff': 'The cost of the upgrades and buyables are raised by {eff} (^{eff})',

	'dil.3': 'SOLVENT III: IMPLOSION',
	'dil.3.desc':
		'"Earth is about to explode, and to make matters worse, you don\'t have a spaceship..."',

	'dil.3.eff':
		'The dilution which selected this solvent, will self-destruct(exit this dilution force) in {time}.',

	'dil.4': 'SOLVENT IV: NUMBER THEORY HELL',
	'dil.4.desc':
		'"The infinite descending chain of the parented predecessor sequence closed the gates of hell, but there\'re much hell......"',

	'dil.4.eff': 'The effect of number theory #4 is reversed.',

	'dil.5': 'SOLVENT V: Your best nightmare about prion virus',
	'dil.5.desc': '\"P¤1-t2~u~ér.2-_/io~/5é &-cnh-\"',
	'dil.5.eff': `This solvent will produce prion virus continuously if you progressed BMS at least once. <br />The prion virus gain is {gen}^(Time in the dilution)-1. <br />
The dilution will self-destruct if the number of the prion virus is greater than total progress count.`,

	'dil.6': 'SOLVENT VI: T₂O',
	'dil.6.desc': '"He stroked his daughter\'s SECOND HEAD and said, Seafood is certainly edible."',
	'dil.6.eff': 'The progressing speed is ^{eff}(Before other multipliers reduce the effect)',

	'dil.7': 'SOLVENT VII: OCCUPIED HEAVENS',
	'dil.7.desc':
		'"You realize those dark spots in the sky aren\'t rain. They\'re the HUMANS that are FALLING."',

	'dil.7.eff': 'B5-1-2, The prestiging, Ascention, Transcension and recursion are disabled.',
	'dil.8': 'SOLVENT VIII: FALL',
	'dil.8.desc':
		'"The googologits who tried to analyze PPS. But they met their doom, their hell."',
	'dil.8.eff': 'You will not able to get any Hydra energy in 5 seconds after enable dilution.',

	'dil.9': 'SOLVENT IX: APOCALYPSE',
	'dil.9.desc': 'FAREWELL.',
	'dil.9.eff': 'ALL SOLVENTS ARE MAXIMIZED. GLOBAL SPEED /1000.',

	'upgs.mil.dut1.reqdesc': 'Reach ψ(Ω<sub>2</sub>Ω) in dilution',
	'upgs.mil.dut2.reqdesc':
		'Reach ψ(Ω<sub>2</sub><sup>ψ<sub>1</sub>(Ω<sub>2</sub><sup>2</sup>)</sup>) in Dilution',
	'upgs.mil.dut3.reqdesc':
		'Reach 0.135 Recursion effect and in Level 10 Solvent II, and 19000 total Solution.',
	'upgs.mil.dut5.reqdesc': 'Reach 1e55 Hydra energy in Level 1 Solvent VII',
	'upgs.mil.dut6.reqdesc': '2,070,000 Solution',
	'upgs.mil.dut7.reqdesc': '2,095,000 Solution & 1e3500 Hydra Energy',
	'upgs.mil.dut8.reqdesc': '^1.25 M-Dilute-5 Effect',
	'upgs.mil.dut9.reqdesc': '2,151,250 Solution',
	'upgs.mil.dut10.reqdesc': '2,175,000 Solution',
	'upgs.mil.dut11.reqdesc': '2,201,250 Solution',
	'upgs.mil.dut12.reqdesc': '^1.46 M-Dilute-5 Effect',
	'upgs.mil.dut13.reqdesc': '1e6100 Hydra Energy',
	'upgs.mil.dut14.reqdesc': '2,261,250 Solution',
	'upgs.mil.dut15.reqdesc': '2.45 M-Dilute-5 Effect',
	'upgs.mil.dut16.reqdesc': '1e18,915 Hydra Energy',
	'upgs.mil.dut17.reqdesc': 'e5.0000e103/s Progressing Speed',
	'upgs.mil.dut18.reqdesc': 'e1.0000e121/s Progressing Speed',
	'tab.nonrecmils': 'NR. Milestones',
	'tab.energyfactor': 'Energy Factor',
	'tab.nrs': 'NR. Study Tree',
	'tab.nrc': 'NR. Challenges',
	'tab.nrupg': 'NR. Upgrades',
	'tab.unocf': 'UNOCF',

	'currency.nonrec': 'Non Rec. Energy',
	'currency.nrt': 'Non Rec. Theory',
	'currency.solution': 'Solution',
	'currency.非递归重置次数': 'Non Rec. Reset times',
	'currency.非递归能量': 'Non Rec. Energy',
	'currency.NRC5次数': 'NRC5 times',
	'currency.UNOCF推演次数': 'UNOCF progression count',
	'currency.UNOCF推演次数和2.25NRC6挑战次数': 'UNOCF progression count & 2.25 NRC6 times',
	'currency.NRC6挑战次数 & M6-24': 'NRC6 times & M6-24',
	'currency.NRC7挑战次数': 'NRC7 times',

	'dung.boxes.0': 'Copper Box',
	'dung.boxes.1': 'Silver Box',
	'dung.boxes.2': 'Golden Box',

	'dung.guard': 'Guard',
	'dung.ore.3': 'Gemstone',
	'dung.teleport': 'Teleporter',
	'dung.healthrec': 'HP+{percent}%',
	'dung.door': 'Door',
	'dung.switch': 'Switch: {status}',
	'dung.moveablebox': 'Box',
	'dung.pwddoor': 'Password Door',
	'dung.key': 'Key',
	'dung.unableto': 'Unable to kill',
	'dung.guard2': 'Senior Guard',
	'dung.guard3': 'Heavy Guard',
	'dung.guard4': 'Wizard',
	'dung.a': 'Skill Point',

	'dung.movement.complete': 'Move completed',
	'dung.movement.unable': 'Unable to move',
	'dung.movement.moving': 'Moving... {a}/{b}',
	'dung.battle.win': 'Battle complete',
	'dung.battle.get': 'Get',
	'dung.boxes.res': 'You opened the box, You get {res} Time shard.',
	'dung.guard.boss': 'Guard Leader',
	'dung.guard.apostle': 'Apostle',
	'dung.boxes.restrict': 'You have to kill the monsters around(7x7) box to open this box.',
	'dung.key.get': 'You get the key',
	'dung.healthrec.e': 'You recover HP',
	'dung.moveablebox.t': 'You can click this box to pick the box up.',
	'dung.death': 'Death',
	'dung.death.det':
		'You were killed by {a} and returned to the spawn point, resetting your level. You gained {b} skill points.',

	'dung.moveablebox.pick': 'Picked Box (You can only put box around player)',
	'dung.moveablebox.put': 'Put Box',

	'dung.gemstone.t': 'You gained gem stone, Global speed+0.25%',

	'nonrec.youhavereset': 'You have done non-recursion resets for {times} times.',
	'nonrec.youhavenrt': 'You have a total of {t} Non Rec. Theories, with {b} remaining.',
	'nonrec.nrtbuy': 'Get one Non Rec. Theory',
	'nonrec.respec': 'Reset Study tree, but do a Non Rec. Reset',

	'studies.nonrec.0':
		'Get 20 Hydra Energy and 20 Solution after non recursion reset or buy this upgrade.',
	'studies.nonrec.1': 'Global speed before cardinal x2',
	'studies.nonrec.2': "Change the solution's cap to the softcap",
	'studies.nonrec.3': function () {
		return `Solution significantly delays Hydra Energy softcap^2<br>Effect : ^${format(Decimal.log10(player.hydra.dilute.solution.add(10)))}`;
	},
	'studies.nonrec.4': 'Hydra Energy gain ×100000 & ^1.05',

	'studies.nonrec.5': function () {
		return (
			'Non Recursion Challenge 1\t' +
			format(new Decimal(326649).pow(player.challenges[1][0].add(1)).pow10()) +
			' Hydra Energy '
		);
	},
	'studies.nonrec.6': 'Non Rec. Power ×10',
	'studies.nonrec.7': 'Get one of the requirements of 112(need complete NRC1 2 times)',
	'studies.nonrec.8': 'Hydra Energy Gain×35, Hydra Energy Gain exponent^1.25',
	'studies.nonrec.9': function () {
		return `Get additional Non Rec. Theories based on current Non Rec. Power(+floor(${format(
			player.nonrecu.power
				.add(1)
				.ln()
				.add(1)
				.ln()
				.mul(
					player.nonrecu.studies_bought.includes(17)
						? secInThisReset52717273().add(1).log10()
						: 1,
				)
				.sub(5),
		)}) after Buy)`;
	},
	'studies.nonrec.10': 'Change the base of Solvent I from 5 to 3',
	'studies.nonrec.11': function () {
		return (
			'Non Recursion Challenge 2\t' +
			format(player.challenges[1][1].pow_base(10).mul(4e6)) +
			'Solution'
		);
	},
	'studies.nonrec.12': function () {
		return (
			'Non Recursion Challenge 3\t' +
			formatWhole(255000000 * 5 ** player.challenges[1][2].toNumber()) +
			' Solution'
		);
	},
	'studies.nonrec.13': 'Remove the cap of Hydra Energy & BMS progressing',
	'studies.nonrec.14': function () {
		return `Each unspent NRT makes progressing speed dilate +0.01<br>Effect: +${format(getCurrency(Currencies.NRT).mul(0.01).add(1))}`;
	},
	'studies.nonrec.15': 'Solution gain x1.2, ^1.01',
	'studies.nonrec.16': function () {
		return `Time spent in this Non Rec. reset increases Non Rec. Power gain<br>Effect: ×${format(
			secInThisReset52717273().add(1).mul(10).pow(2).sub(99).root(2).pow(0.75).div(2).add(1),
		)}`;
	},
	'studies.nonrec.17': function () {
		return `Time spent in this Non Rec. reset increases NRS 52 effect<br>Effect:((x+5)×${format(secInThisReset52717273().add(1).log10())})-5`;
	},
	'studies.nonrec.18': function () {
		return `Time spent in this Non Rec. reset increases Solution gain<br>Effect:×${format(secInThisReset52717273().add(1).ln().mul(0.2).add(1))}`;
	},
	'studies.nonrec.19': 'You can buy any two NRS in 5~7 row. Unlock a new column in 5~7 row.',
	'studies.nonrec.20': 'Solution^1.025',
	'studies.nonrec.21': 'Hydra energy gain dilate 1.1',
	'studies.nonrec.22': 'Get 1% of pending non Rec. Power/s passively.',
	'studies.nonrec.23': function () {
		return (
			'Non Rec. Challenge 4\t' +
			format(
				new Decimal(6 + player.challenges[1][3].toNumber()).pow_base(2).pow_base(2).pow10(),
			) +
			'Hydra Energy'
		);
	},
	'studies.nonrec.24': 'Non Rec. Challenge 5\tChallenge amount is the highest progression times',
	'studies.nonrec.25': 'Non Rec. Challenge 6\tChallenge amount is log10 log10 prion',
	'studies.nonrec.26': function () {
		return `Total NRT increases UNOCF progressing speed. This study need M6-25, 42 & 101<br>Effect: ×${format(getTotalTheories().add(1))}`;
	},
	'studies.nonrec.27': function () {
		return `Recursion Effect&Solution^x,x based on progressing times<br>Effect:  ^${format(
			player.hydra.deduceOrdinal[0]
				.clampMin(1e10)
				.log10()
				.log10()
				.log10()
				.pow(0.1)
				.mul(0.2)
				.add(1),
		)}`;
	},
	'studies.nonrec.28': function () {
		return 'Non Rec. Challenge 7\t' + 'See Challenge Page';
	},
	'studies.nonrec.29': function () {
		if (player.retribution == 0)
			return wordShift.wordCycle(
				[
					'You need Retribution',
					'You need Compressed Hydra Energy',
					'You need Retribution',
					'You need Y Sequence',
				],
				false,
				undefined,
				false,
			);
		return 'Remove Compressed Hydra Energy cap';
	},
	'studies.nonrec.30': function () {
		if (player.retribution == 0)
			return wordShift.wordCycle(
				[
					'You need Retribution',
					'You need Compressed Hydra Energy',
					'You need Retribution',
					'You need Y Sequence',
				],
				false,
				undefined,
				false,
			);
		return 'Unlock <b>Proof Theory</b>';
	},
	'chal.goal': 'Goal: {goal}',

	'set.musicurl.title': 'Input Music URL',
	'set.musicurl.cont': 'Please Enter the URL of the music',
	'set.musicurl.place': 'URL',
	'set.musicurl.test': 'the URL of the music',
	'set.musicurl.unable': 'Cannot play music',
	'set.musicurl.content':
		'The browser has denied the request to play music. You can click the confirmation button to play the music again.',

	'chal.1.0': 'MUTATION',

	'chal.1.0.description': function () {
		return (
			"You are trapped in Solvent [10,0.4667+Completions,10,10,10,9,true,false,false], Solvent II now affects Solution Upgrades.<br> Keep U5-S-9, but you're no longer immune to Prions, Prion's boost is inverted and will multiply by 100*10^(completions)/s after your first BMS progression. If your Prions exceed your BMS progression count, Prions will be reverted back to 1 and you will do a dilution reset.<br>Reward: Prion growth speed outside challenge 1 x" +
			format(player.challenges[1][0].pow_base(4)) +
			', , First complete makes Hydra Energy gain &ln(prion)^0.5'
		);
	},
	'chal.1.1': 'Energy Reduction',
	'chal.1.1.description': function () {
		return 'Hydra Energy exponent maximum value is log10(NRE+1), addition multiplier maximum value is 10^(NRE^1/3)，progressing multiplier maximum value is10^(NRE^1/3)，Hydra Energy maximum value is (NRE+1)<br><span style="color: red">Enter this challenge will reset Solution</span><br>Reward: First complete, Hydra Energy softcap^2 effect ×80%. Each challenge complete make Hydra Energy exponent ^1.1(after softcap^2)';
	},
	'chal.1.2': 'DILUTE PRO MAX',
	'chal.1.2.description': function () {
		return 'Solvent I base is 20, Divide Solvent III threshold time by 5. Disable U5-S-14 the last effect. Disable MD15. The level of the solvents must be an integer. Change Solvent VI effect to ^1-(challenge amount*0.2-0.2)x. Change Global speed to 1/1e(10*challenge amount) in Solvent IX. All Solution addition multiplier(and formula) is disabled.<br>Reward:';
	},
	'chal.1.3': 'REVERSE RESEARCH',
	'chal.1.3.description': function () {
		return "You have first 2x-1 row NRS, but it's effect is reversed(Complete at most 2 times)<br>Reward: Change the effect of 101 to 10%. Increase Total NRT based on challenge amount, First 2x-1 NRS and this NRS will not cost anything";
	},
	'chal.1.4': 'LOGARITHM',
	'chal.1.4.description': function () {
		return 'In any challenge, when the progression speed exceeds 10, it is calculated as log10(log10(progression speed, max 10)) + 10. Solution reduced to log10(solution).';
	},
	'chal.1.5': 'LIMITED',
	'chal.1.5.description': function () {
		return 'The maximum value of progression times is 1, Cap solution to 0';
	},
	'chal.1.6': 'THE GREAT REVERT',
	'chal.1.6.description': function () {
		return 'Disable UNOCF effect, Reset Solution. Cap current progressing times to current progressing speed, Prion reduce progressing speed(progressing speed=10^10(log10 log10 (progressing times)/ log10 log10 prion) if progressing speed and prion both greater than 1e10, otherwise 0）<br>Goal: Reach e1e4500000 Progressing times';
	},
	'chal.1.2.effect': function (params: any) {
		return (
			'Progressing speed ^(1+ln(ln(x^10+1)^' +
			format(params.values.effq) +
			'+1)/5) based on Non Rec. Power. Currently: ^' +
			format(
				player.nonrecu.power
					.pow(10)
					.add(1)
					.ln()
					.pow(params.values.effq)
					.add(1)
					.ln()
					.div(5)
					.add(1),
			)
		);
	},
	'chal.1.3.effect': function (params: any) {
		return '×' + params.values.effect;
	},
	'currency.compressed_hydra': 'Compressed Hydra Energy',
	'currency.qol_crystal_points': 'QoL Crystal Points',
	'tab.automator': 'Automator',

	'upgs.byl.B6R11': 'Deduction Energy Button gain button +1',
	'upgs.byl.B6R12': 'Click Button (This buyable level)<sup>2</sup> times per second',
	'upgs.byl.B6R13': 'B6-R-1-1,B6-R-1-2 effect exponent+0.05',
	'upgs.byl.B6R14': 'U6-R-1-1 effect exponent+0.05',
	'upgs.byl.B6R15': 'U6-R-1-3~4 effect base+0.015',
	'upgs.byl.B6R21': 'Reduce B6-R-1-3~4 cost based on Deduction Energy',

	'studies.dung.title': 'Skill Tree',

	'offline.title': 'Calculating offline Progress',
	'offline.tick': 'Calculated {a}/{b}',
	'offline.tick2': 'Calculated {a}/{b}',
	'stat.ordlvl': 'Current Ordinal Level:{level}',
	'stat.ordlvl2': 'Highest Ordinal Level: {level}',
	'stat.ordlvlnext': 'Next Ordinal Level Requires ',
	'dung.core.checkfor': 'Cores(Click for information)',
	'dung.core.info': `Real level{a}(Rarity buff{b}%)<br />
	HP+{c}<br />
	ATK+{d}<br />
	DEF+{e}<br />`,
	'dung.core.position.hea': 'Health Pos.',
	'dung.core.position.atk': 'Attack Pos.',
	'dung.core.position.def': 'Defend Pos.',
	'dung.core.notequiped': 'Not Equipped {a}',
	'dung.core.equiped': 'Equipped {a}',
	'dung.core.unequip': 'Unequip!',

	'dil.preset.set': 'Add current solvent as a preset',
	'dil.preset.a': 'Preset: ',
	'dil.preset.use': 'Use',
	'dil.preset.del': 'Delete',
	'dil.useable': 'You can use {a} Solutions for buying upgrades.',
	'dil.respec': 'Respec',
	'currency.九头蛇溶液': 'Solution',

	chapa0: {
		title: 'Prologue',
		text1: 'Successor',
		text: 'Looking For Numbers',
	},
	chapa1: {
		title: 'Chapter 1',
		text1: 'Addition',
		text: 'Addiction To Numbers',
	},
	chapa2: {
		title: 'Chapter 2',
		text1: 'Multiplication',
		text: 'Advance Despite Difficulties',
	},
	chapa3: {
		title: 'Chapter 3',
		text1: 'Exponentiation',
		text: 'Endless Hardships',
	},
	chapa4: {
		title: 'Chapter 4',
		text1: 'Ordinal',
		text: 'Transfinite',
	},
	chapa5: {
		title: 'Chapter 5',
		text1: 'Hydra',
		text: 'The Ultimate Power',
	},
	chapa6: {
		title: 'Chapter 6',
		text1: 'Non Recursion',
		text: 'Long & Uninterrupted',
	},
	chapa7: {
		title: 'Chapter 7',
		text1: 'Proof Theory',
		text: 'Depopulated Zone',
	},
	chapa8: {
		title: 'Chapter 8',
		text1: 'Cardinal',
		text: 'The Actual Self',
	},
	'uselessconfirm.0.t': 'Addition Reset',
	'uselessconfirm.0':
		"Do you want to reset? It'll reset your number, most upgrades and buyables.<br>You will gain {gain} Addition Power(AP).",
	'uselessconfirm.1.t': 'Multiplication Reset',
	'uselessconfirm.1':
		"Do you want to reset? It'll reset your number, Addition Power most upgrades and buyables.<br>You will gain {gain} Multiplication Power(MP).",
	'uselessconfirm.2.t': 'Exponentiation Reset',
	'uselessconfirm.2':
		"Do you want to reset? It'll reset your progress before Exponentiation.<br>You will gain {gain} Exponentiation Power(MP) and. {gain2} QoL Points.",

	'useless.confirm.a': 'Do you want to import this save? The current progress will be wiped.',
	'savebank.download': 'Download save',
	'savebank.import': 'Import save',

	'savebank.后继层级': 'Successor Layer',
	'savebank.加法层级': 'Addition Layer',
	'savebank.指数层级': 'Exponentiation Layer',
	'savebank.序数层级': 'Ordinal Layer',
	'savebank.九头蛇层级': 'Hydra Layer',
	'savebank.非递归层级': 'Non Recursion Layer',
	'savebank.后继层通关': 'Complete successor layer',
	'savebank.5加法能量': '5AP',
	'savebank.10加法能量': '10AP',
	'savebank.56加法能量': '56AP',
	'savebank.74加法能量': '74AP',
	'savebank.加法层通关': 'Complete Addition Layer',
	'savebank.解锁奇点生成器': '1e21 MP in dilate',
	'savebank.献祭后继前': 'before sacrifice successor',
	'savebank.解锁数论研究3': 'Unlock number theory #3',
	'savebank.解锁加速器': 'Unlock booster/accelerator',
	'savebank.序数快速前进': 'Ordinal fast-growing',
	'savebank.序数快速前进<sup>2</sup>': 'Ordinal fast-growing<sup>2</sup>',
	'savebank.到达ψ<sub>0</sub>(Ω)': 'Reach ψ<sub>0</sub>(Ω)',
	'savebank.首次访问九头蛇': 'First access Hydra',
	'savebank.第一组升级解锁': 'First group of upgrade unlock',
	'savebank.第二组升级解锁': '2nd group of upgrade unlock',
	'savebank.第三组升级解锁': '3rd group of upgrade unlock',
	'savebank.2501250溶液': '2501250 Solutions',
	'savebank.11次非递归': '11 times NR reset',
	'savebank.35次非递归': '35 times NR reset',
	'savebank.66次非递归': '66 times NR reset',
	'nonrec.chaltip':
		'In Non Recursion Challenge, Solvent II will increase the cost of U5-S upgrades<br />Caution: NRC1,2,3,7 can only complete 5 times',

	'currency.x4': 'x<sub>4</sub>',
	'crreuncy.τ4': 'τ<sub>4</sub>',

	bmsdefinition,
	bmswellorder1,
	bmswellorder2,
	bmswellorder3,
	bmswellorder4,
	bmswellorder,
	bmswellorder1prove,
	bmswellorder2prove,
	bmswellorder3prove,
	bmswellorder4prove,

	prss1,
	prss2,
	prss3,
	prss4,
	prss5,
	prss6,
	prss7,
	prss8,
	prss9,
	prss10,
	prss11,
	prss12,
	prss13,
	prss14,
	prss15,
	prss16,
	prssdefinition,

	'upgs.71': 'NRC1 challenge debuff reduced from 0.4667+X to 0.4667+0.3X',
	'upgs.72':
		'Keep Highest Solution amount if not in NRC. Significantly reduce the softcap^2 of hydra energy',
	'upgs.73': "NRS 52{'|'}71{'|'}72{'|'}73 time speed is 1000 faster.",
	'upgs.74': 'Significantly enhance the effect of solution',
	'upgs.75': 'Deduction power gain^1.25',
	'upgs.76': 'Unlock more NT5 upgrades',
	'upgs.77': 'Non Rec. Energy enhances <b>only timing</b> speed in current Non Recursion Reset',
	'upgs.78': 'U6-7 effect ^2',

	'upgs.71UN': 'Start UNOCF progression, +1/s',
	'upgs.U6R11': 'Non Rec. Energy multiplies Deduction Energy gain',
	'upgs.U6R12': 'You can buy at most 3 columns in row 5-7',
	'upgs.U6R13': 'B6-R-1-1 effect^2',
	'upgs.U6R14': 'Total NRT multiplies Non Rec. Energy gain',
	'upgs.U6R15': 'You can buy maxB6-R-1~4',
	'upgs.U6R16': 'Enhance B6-R-1-5 by 5%',
	'upgs.U6R17': 'Auto buy max B6-R-1~4',
	'upgs.U6R21': 'Remove the softcap^2 of Non Rec.<sup>?</sup> Energy',
	'upgs.U6R22': 'Current time in Non Rec. Reset multiplies Deduction Energy gain',
	'upgs.U6R18': function () {
		return `Deduction Energy×1e100<br>UNLOCK<b class="baseRetribution"> ${'RETRIBUTION'}</b>`;
	},

	'nt.wellorderness': 'Well-Orderness',
	'nt.wellorderness.ded':
		'You have {a} Deduction Energy. <br />They multiply UNOCF progressing speed by ×{b}',

	'nt.wellorderness.proving': 'Proving: {prove}.',
	'nt.wellorderness.select.0': 'None',
	'nt.wellorderness.select.1': 'The Well-orderness of PrSS (Primitive Sequence System)',
	'nt.wellorderness.select.2': 'The Well-orderness of BMS (Bashicu Matrix System)',
	'nt.wellorderness.select.3': 'The Well-orderness of Y Sequence System',

	'nt.wellorderness.butt': 'Get {a} Deduction Energy',

	page: 'Page {page}',

	'nt.wellorderness.process.0':
		'Next: Define P with finite-length natural number sequence set, The recursional definition of P is...',
	'nt.wellorderness.process.1': 'Define P, cost 10 Deduction Energy',

	'nt.wellorderness.notproved': '(Not proved)',
	'nt.wellorderness.lemma': 'Lemma {a}',
	'nt.wellorderness.prove': 'Prove',

	'nt.wellorderness.process.2': 'Prove lemma 1.1, cost 100,000 Deduction Energy',
	'nt.wellorderness.process.3': 'Prove lemma 1.2, cost 500,000,000 Deduction Energy',
	'nt.wellorderness.effect.0':
		'Lemma 1.2 reward: Reduce softcap^2 of hydra energy, Automatically gain NRC5 challenge amount, prion gain speed×(Deduction Energy+1)^2, NRC6 challenge amount enhance Deduction Energy gain',

	'nt.wellorderness.effect.1':
		'Lemma 1.1 reward: You can auto update the amount of solution, Reduce the softcap^2 of Hydra energy. Deduction Energy gain*10.',

	'tab.prooftheory': 'Proof theory',
	'tab.analyze': 'Analyze',
	'tab.analyzemilestone': 'Analyzing milestone',
	'tab.garden': 'Garden',

	'nt.wellorderness.unlockedalemma': 'Unlocked a lemma',
	'nt.wellorderness.process.4':
		'Define the expand function of PrSS, cost 1.000e15 Deduction Energy',
	'nt.wellorderness.process.5': 'Unlock lemma 2, cost 1.0000e17 Deduction Energy',
	'nt.wellorderness.process.6': 'Prove lemma 2.1, cost 1.0000e34 Deduction Energy',
	'nt.wellorderness.effect.2':
		'Lemma 2.1 reward: Reduce the softcap^2 of Hydra Energy. Solution enhances Deduction Energy gain',
	'nt.wellorderness.process.7': 'Prove lemma 2.2, cost 1.0000e52 Deduction Energy',
	'nt.wellorderness.effect.3':
		'Lemma 2.2 reward: Auto buy NRT, Automatically gain NRC6 challenge amount. Multiply the base of B6-R-1-3、B6-R-1-4. Reduce the softcap^2 of Hydra Energy',
	'nt.wellorderness.process.8': 'Prove lemma2.3, cost 1.7977e308 Deduction Energy',
	'nt.wellorderness.effect.4':
		'Lemma 2.3 reward:Deduction Energy significantly enhance prion gain speed',
	'nt.wellorderness.process.9': 'Unlock lemma 3, cost 3.000e320 Deduction Energy',
	'nt.wellorderness.process.10': 'Prove lemma 3, cost 3.000e325 Deduction Energy',
	'nt.wellorderness.effect.5': 'Lemma 3 reward:B6-R-1-3, Multiply the base of B6-R-1-4 again',
	'nt.wellorderness.process.11': 'Unlock lemma 4, cost 1.000e690 Deduction Energy',
	'nt.wellorderness.process.12': 'Prove lemma 4, cost 1.000e695 Deduction Energy',
	'nt.wellorderness.effect.6': 'Lemma 4 reward: BMS progression speed (double exponent) ^1.2',
	'nt.wellorderness.process.13': 'Unlock lemma 5, cost 1.000e700 Deduction Energy',
	'nt.wellorderness.process.14': 'Prove lemma 4, cost 1.000e695 Deduction Energy',
	'nt.wellorderness.effect.7': 'Lemma 5 reward: Deduction Energy gain^1.5.',

	'nt.wellorderness.process.15': 'Define lemma 1, cost 1.000e2435 Deduction Energy',
	'nt.wellorderness.process.16': 'Prove lemma 1, cost 1.000e2940 Deduction Energy',
	'nt.wellorderness.effect.8': 'Effect:  UNOCF 5th effect×30,000',
	'nt.wellorderness.process.17': 'Unlock lemma 2, cost {cost} Deduction Energy',
	'nt.wellorderness.process.18': 'Prove lemma 2, cost 1.000e8320 Deduction Energy',
	'nt.wellorderness.effect.9':
		'Reward:Remove the softcap^2 of Hydra Energy, Reduce (tidily) the growing speed of B6-R-2-1 cost.',
	'nt.wellorderness.process.19': 'Unlock lemma 3, cost 1.00e42,258 Deduction Energy',
	'nt.wellorderness.process.20': 'Prove lemma 3, cost {cost} Deduction Energy',
	'nt.wellorderness.effect.10': 'Reward:Significantly enhance BMS progressing speed.',
	'nt.wellorderness.process.21': 'Unlock lemma 4, cost {cost} Deduction Energy',
	'nt.wellorderness.process.22': 'Prove lemma 4, cost {cost} Deduction Energy',
	'nt.wellorderness.effect.11': 'Reward:Significantly enhance BMS progressing speed.',
	'nt.wellorderness.process.23':
		'Prove the well-orderness of BMS, cost e100,000,000 Deduction Energy.',
	'nt.wellorderness.effect.12':
		'Reward: You can do the first RETRIBUTION reset......after e150000000 Deduction Energy, BMS progressing speed slog+{effect}',

	'nonrec.unocf.is': 'Your UNOCF Ordinal is',
	'nonrec.unocf.tip':
		'Because of the complexness of UNOCF, Not all progression will mapped to ordinal',
	'nonrec.unocf.eff.1':
		'UNOCF make BMS progressing speed^{effect}(Enable on BMS progressing speed>1)',
	'nonrec.unocf.eff.2.unl': 'Reach 512 progresses to unlock 2nd UNOCF effect',
	'nonrec.unocf.eff.2': 'UNOCF makes UNOCF progressing speed*{effect}',
	'nonrec.unocf.eff.3.unl': 'Reach 4096 progresses to unlock 3rd UNOCF effect',
	'nonrec.unocf.eff.3': 'UNOCF makes Solution gain*{effect}',
	'nonrec.unocf.eff.4.unl': 'Reach 16384 progresses to unlock 4th UNOCF effect',
	'nonrec.unocf.eff.4': 'UNOCF make Non Rec. Energy^{effect}',
	'nonrec.unocf.eff.5.unl': 'Reach 1.000e1900 progresses to unlock 5th UNOCF effect',
	'nonrec.unocf.eff.5': 'UNOC make prion growing speed (double exponent)×{effect}',
	'nonrec.unocf.nextord': 'Next ordinal is ',

	'tab.retribution': function () {
		return 'RETRIBUTION';
	},
	'retri.text': `¶THIS IS THE END OF ROAD¶<br />
REACH THE LIMIT OF NOTATION, AND PROVE THE WELLORDERNESS OF NOTATION,<br />
THEN YOU CAN GET REVELATION.<br />
……TO GET THE STRONGER STRENGTH……<br />`,
	'retri.2': 'Revelation...',
	next: 'NEXT',
	limited: 'Locked',
	cancel: 'Cancel',
	confirm: 'Confirm',
	modalreq: 'Required',
	modalvalid1: 'Not valid',
	modalvalid2: 'Not valid',
	tip: 'Tip',
	'retri.reset':
		'You will lost all your Non Rec. Progress, Hydra Progress, and upgrades<br>BUT YOU WILL GET REVELATION AND 1 <b>SINGULARITY ENERGY</b>, TO GET THE STRONGER STRENGTH...',
	'retri.ok': 'Yes...',

	'res.compress': 'Compressed Hydra Energy',

	'yeng.totaleffect': 'Total Compressed Hydra Energy makes BMS progressing speed×',
	'yeng.progressed': 'Progressed {x} times',
	'yeng.dim.0.title': 'First Y Seq. Dimension',
	'yeng.dim.buymax': 'Buy max',
	'yeng.dim.require': 'Requires ',
	'yeng.dim.0.effect': 'Progress {effect} times per second',
	'yeng.dim.1.title': 'Second Y Seq. Dimension',
	'yeng.dim.2.title': 'Third Y Seq. Dimension',
	'yeng.dim.3.title': 'Fourth Y Seq. Dimension',
	'yeng.dim.1.effect': 'Produce {effect} First Y Seq. Dimension per second',
	'yeng.dim.2.effect': 'Produce {effect} Second Y Seq. Dimension per second',
	'yeng.dim.3.effect': 'Produce {effect} Third Y Seq. Dimension per second',

	'yeng.reset': 'Reset Y Seq. Dimensions, Get {gain} Compressed Hydra Energy',

	'upgs.621': 'Hydra Energy enhanced Comp. Hydra Energy',
	'upgs.622':
		'For each dimension purchased, its effect becomes a certain multiple of the original value.',
	'upgs.623': 'Square the effect of U5-2-1~2',
	'upgs.624': 'In any time, You have at least 1 First Y Seq. Dimension',
	'upgs.625': 'All Dimensions production *3',
	'upgs.626': 'Reduce 4 Dimensions cost growth raise to 50%',
	'upgs.627': 'Y Seq. Progressed times produces Fourth Y Seq. Dimension',
	'upgs.628': 'Improve the formula of Ascension effect, Square the effect of U5-2-1',
	'upgs.629': 'Get 100% of pending Comp. Hydra Energy /s passively',

	'upgs.6210':
		'For each additional 2nd to 4th Y Sequential Dimension purchased, its effect is multiplied by (0.95 + Dimension Number × 0.05).',
	'upgs.6211': 'U5-2-7 effect ^3',
	'upgs.6212': 'Prestige~Recursion do not reset anything, Recursion effect +50%',
	'upgs.6213':
		'<span style="font-size: 10px">When Solvent 1-8 are fully upgraded and entering dilute mode, Hydra Energy gains a multiplier of 1e1000000 per second, with the cap being Solution ×10×(time spent in dilute mode + 1).</span>',

	'upgs.ts_auto_pkg_hydra': 'Get automator hydra package, Use include hydra; to import',
	'upgs.ts_auto_pkg_nonrec': 'Get automator nonrec package，Use include nonrec; to import',

	'ts.unlauto': 'Spend 1000 TS to unlock automator',

	'pt.desc': `In analysis system, Different systems will unlock at different times each week.<br />Current day is {week}<span style=\"font-size: 12px\">(UTC+08:00)</span>, Unlock {sys} System.<br />Do PT Reset to analyse randomly, 
	    Success rate is {rate}% , Analyzing the same system {cycle} times will inevitably succeed.<br />
		The initial analysis of a single system must succeed.<br /><br />`,

	'pt.effresettimes': `<p>The PT reset brought you rewards:</p>
<p>Global speed *{eff1} before Cardinal, Maximum value *5</p>
<p>Reduce the logarithmic softcap by *{eff2}%, Maximum value -50%</p>
<p>Solution gain *{eff3}, Maximum value *4</p>
<p>Non Rec. Reset times gain *{eff4} per Non Rec. Reset, Maximum value *25</p>`,
	'pt.reset': 'Proof Theory Reset',
	'pt.analysisprogress': 'Analysis Progress: {x}/11(Attempted {attempt} times)',
	'pt.analysisprogresseff': 'Analysis Effect: {effect}',
	'pt.analysisprogresseff.0': 'Hydra Energy gain',
	'pt.analysisprogresseff.1': 'Non Rec. Energy gain',
	'pt.analysisprogresseff.2': 'Non Rec. Reset times gain',
	'pt.analysisprogresseff.3': 'Deduction Energy gain',
	'pt.analysisprogresseff.4': 'Solution gain',
	'pt.analysisprogresseff.5': 'Y Engine efficiency',

	'pt.youhave1': 'You have {a} PT analysis times',
	'pt.youhave2': 'You have {a} PT reset times',
	'pt.youhave3': 'You have {a} QoL Crystal Points',
	'currency.证明论解析次数': 'PT analysis times',

	'upgs.7c1q': 'Keep NRC1x5',
	'upgs.7c2q': 'Keep NRC2x5',
	'upgs.7c3q': 'Keep NRC3x5',
	'upgs.7c4q': 'Keep NRC4x2',
	'upgs.7c5q': 'Keep NRC5 progress',
	'upgs.7c6q': 'Keep NRC6 progress',
	'upgs.7c7q': 'Complete NRC7 automatically on eee9 Progressing times',
	'upgs.7t1q': '+2 Free NRT',
	'upgs.7t2q': '+2 Free NRT',
	'upgs.7t3q': '+4 Free NRT',
	'upgs.7t4q': '+10 Free NRT',
	'upgs.7t5q': '+100 Free NRT',
	'upgs.7t6q': '+10000 Free NRT',
	'upgs.7t7q': 'Keep NRT on PT reset',
	'upgs.7ta1q': 'Automate 1st NRT buyable',
	'upgs.7ta2q': 'Automate 2nd NRT buyable',
	'upgs.7ta3q': 'Automate 3rd NRT buyable',
	'upgs.7tamq': 'Auto max NRT buyables (Useless)',
	'upgs.7hpa1q': 'Automate Prestige',
	'upgs.7hpm1q': 'Minimum threshold of Prestige automation',
	'upgs.7hpa2q': 'Automate Ascension',
	'upgs.7hpm2q': 'Minimum threshold of Ascension automation',
	'upgs.7hpa3q': 'Automate Transcension',
	'upgs.7hpm3q': 'Minimum threshold of Transcension automation',
	'upgs.7hpa4q': 'Automate recursion',
	'upgs.7hpm4q': 'Minimum threshold of Recursion automation',
	'upgs.7nt4q': 'Unlock Number Theory 4 (Always)',
	'upgs.7nt4uq': 'Keep NT4 upgrades',
	'upgs.7nt4bq': 'Automate NT4 buyables',
	'upgs.7nt4bmq': 'Auto max NT4 buyables',
	'upgs.7nt5ubq': 'Automate NT5 upg&byls',
	'upgs.7nt5bmq': 'Auto max NT5 byls',

	'garden.startsimulate': 'Start simulate',

	'garden.gen.0': 'String',
	'garden.gen.1': 'Quark',
	'garden.gen.2': 'Nucleon',
	'garden.gen.3': 'Atom',
	'garden.gen.4': 'Molecule',
	'garden.gen.5': 'Amino Acid',
	'garden.gen.6': 'DNA',

	'garden.upg.0': 'String Vibration',
	'garden.upg.1': 'D-Brane',
	'garden.upg.2': 'M-Theory',
	'garden.upg.3': 'Gluon',
	'garden.upg.4': 'Quark Confinement',
	'garden.upg.5': 'Neutrino',
	'garden.upg.6': 'Higgs Boson',
	'garden.upg.7': 'Electron',
	'garden.upg.8': 'Strong Interaction',
	'garden.upg.9': 'Weak Interaction',
	'garden.upg.10': 'Atomic Energy',
	'garden.upg.11': 'Quantum Entanglement',
	'garden.upg.12': 'Chemical Bond',
	'garden.upg.13': 'Quantum Tunneling',
	'garden.upg.14': 'Element',
	'garden.upg.15': 'Periodic Table',
	'garden.upg.16': 'Ion',
	'garden.upg.17': 'Electron Orbital',
	'garden.upg.18': 'Atomic Decay',
	'garden.upg.19': 'Free Radical',
	'garden.upg.20': 'Covalent Bond',
	'garden.upg.21': 'Free Charge',
	'garden.upg.22': 'Chemical Energy',
	'garden.upg.27': 'Protein',
	'garden.upg.28': 'Protein Encoding',
	'garden.upg.29': 'RNA',
	'garden.upg.30': 'Virus',
	'garden.upg.31': 'Heredity',

	'garden.gen.7': 'Idea Multiplier',
	'garden.gen.8': 'Idea Multiplier II',
	'garden.gen.7.effDesc': 'Idea production ×{effect}',

	'garden.upg.23': 'START',
	'garden.upg.24': 'ST1',
	'garden.upg.25': 'I1',
	'garden.upg.26': 'E1',
	'garden.upg.32': 'I2',
	'garden.upg.33': 'E2',
	'garden.upg.34': 'IGCD1',
	'garden.upg.35': 'IGCD2',

	'currency.想法': 'Idea',
	'currency.熵': 'Entropy',

	'garden.produce': 'Produce {prod} Idea',
	'garden.produce2': 'Produce {prod2} Entropy',

	'currency.灵感': 'Inspiration',
	'garden.entropydebuff': 'Generator and upgrade cost (in simulation) ×{effect}',
	'garden.enhance': 'Enhance ',
	'garden.improving.0': 'Generator Idea multiply',
	'garden.improving.1': 'Generator Entropy divide',

	'currency.灵感能量': 'Inspiration Energy',
	'garden.inspirationgenerate': 'Inspiration Generate',
	'garden.nextig': 'Next Inspiration Generate will enable after {time}',
	'garden.nextig2': 'Next Inspiration Generate will enable in',
	'garden.localspeedmult': 'Local speed×',
	'garden.shortcut.0.0': 'To',
	'garden.shortcut.0.1': 'Ancient',
	'garden.upg.23.desc': 'Unlock Garden Level',
	'garden.upg.24.desc': 'Unlock ancient phase',
	'garden.upg.34.desc': 'Reduce minimum IG time to 16 hours',
	'garden.upg.35.desc': 'Reduce minimum IG time to 8 hours',
	'garden.level.tag': 'Level',
	'garden.level.upgrade': 'Upgrade',
	'garden.level.base': 'Based on Garden Level, +{effect} I. Energy per second',

	'upgs.ts_auto_pkg_hydra.name': 'Automator hydra module',
	'upgs.ts_auto_pkg_nonrec.name': 'Automator nonrec module',
	examplecode: 'Example Code:',

	'garden.upg.36.desc': 'Reduce minimum IG time to 4 hours',
	'garden.upg.36': 'IGCD3',
	'stat.precard': 'Pre cardinal speed: ',

	'pt.reset.title': 'Proof Theory Reset',
	'pt.reset.desc': 'Are you sure you want to reset? (Need Gamma test)',
	'pt.reset.title2': 'Proof Theory Reset(again)',
	'pt.reset.desc2':
		'证明论重置还没做完，可能会导致: 证明论效果失效，ω病毒，卡死病毒，你确实要重置?',
	'pt.reset.title3': 'Cannot reset',
	'pt.reset.desc3': 'Need Gamma test.<br>(The PT Layer is not stable.)',
	'pt.reset.desc4': 'Need NRC7x1.',
	'about.termiunsfinitine': '一名無知的小鬼',
	'about.englishlocalization': 'English Localization',
	'dung.keyreq': 'You need a key to open this door',
	'set.upgnewui': 'Element-like Upgrade UI',

	'currency.never': 'Singularity Energy',
	'upgs.sing1': 'Restart Singularity Generator',
	'ts.vowreduce': 'Fate respecing requirement -{value}',

	'tab.nonrecbms': 'Non Rec. BMS',
	'oracle.title': 'Oracle progress',
	'oracle.bit': 'Oracle bit',
	'oracle.1': 'Current Oracle bit collection speed multiplier×{effect}',
	'oracle.2': 'Multiply oracle bit collection speed ×{effect},based on total Proof-theory power',
	'oracle.3': 'Multiply oracle bit collection speed ×{effect},based on total Garden-Inspirations',
	'oracle.fate': 'Fate',
	'oracle.fate.desc':
		'Use oracle bit to buy fate. Adjacent instances of the same fate will mutually reinforce each other (enhancing effects). Adjacent instances of different fates will mutually repel each other (weakening effects).',
	'currency.nrb_deduction': 'Non Rec. BMS progressing speed',
	'upgs.81':
		'Non Rec. BMS progressing times slightly reduces the effect of adjacent different fates repelling each other.',
	'upgs.82': 'Non Rec. BMS progressing times enhance progressing speed',
	'upgs.83': 'Non Rec. BMS slightly enhance the rate of fates (after buying fate)',
	'upgs.84': 'Proof-theory power enhanced Non Rec. BMS progressing speed',
	'upgs.85': 'Non Rec. BMS progressing times enhance Oracle bit collection speed',
	'upgs.86': 'The effect of U7-3 which applying to Space & Time fate, ×2 ',
	'upgs.87': 'Compressed Hydra Energy enhances Non Rec. BMS progressing speed',
	'upgs.88': 'Remove the softcap of Non Rec. BMS effect',
	'upgs.6216': 'Keep The first 12 Y-Seq upgrades',
	'upgs.6217': 'Multiply Non Rec. BMS progressing speed by 10',
	'upgs.89': 'Reduce the growth rate of fates',
	'tab.sin': 'Original Sin',
	'currency.karma': 'Karma',
	'upgs.mil.sin_1':
		'Adjacent instances of different fates <span style="font-size: 24px"><b>WILL NOT</b></span> mutually repel each other (weakening effects).',
	'garden.improving.3': 'Generator automatic batch',
	'garden.upg.81': 'ATBBK1',
	'garden.upg.82': 'ATBBK2',
	'garden.upg.83': 'ATBBK3',
	'garden.upg.84': 'ATBBK4',
	'garden.upg.85': 'ATBC1',
	'garden.upg.85.desc': 'The generator that requires ideas will spend only 1/2 currency',
	'garden.upg.86': 'ITCHE1',
	'garden.upg.86.desc': function () {
		return `Enhance Compressed Hydra Energy slog, based on total inspirations. Currently: +${format(player.garden.totalInspiration.add(1).log10().root(2).div(2).min(10))}`;
	},
	'garden.upg.87': 'ITNRB1',
	'garden.upg.87.desc': function () {
		return `Enhance Non Rec. BMS progression speed, based on total inspirations. Currently: ×${format(player.garden.totalInspiration.add(10).log10().max(1).pow(0.5).pow10().div(10))}`;
	},
	'currency.pt_power': 'Proof-theory Power',

	'set.autosave': 'Auto saving',

	'detectedmulti.title': 'Auto saving is disabled',
	'detectedmulti.content':
		"Detected there're more than 1 games are running. It may cause conflicts.",
	'retri.reset2':
		'You will lost all your Non Rec. Progress, Hydra Progress, Proof-theory Progress, and upgrades...<br>BUT YOU WILL GET REVELATION AND 1 <b>SINGULARITY ENERGY</b>, TO GET THE STRONGER STRENGTH...',

	'garden.gen.9': 'Idea Multiplier III',
	'garden.gen.10': 'Idea Multiplier IV',
	'garden.upg.37': 'LS1',
	'garden.upg.38': 'LS2',
	'garden.upg.39': 'LS3',
	'garden.improving.2': 'Local speed',
	'garden.tiplevel1': 'Pre-cardinal speed increases after garden level 1',
	'garden.tiplevel2': 'Gain Proof-theory power after garden level 10',

	'garden.upg.48.desc': 'Reduce minimum IG time to 2 hours',
	'garden.upg.48': 'IGCD4',
	'garden.upg.49.desc': 'Reduce minimum IG time to 1 hour',
	'garden.upg.49': 'IGCD5',
	'garden.upg.50.desc': 'Reduce minimum IG time to 30 minutes',
	'garden.upg.50': 'IGCD6',
	'garden.upg.40.desc': 'Reduce minimum IG time to 10 minutes',
	'garden.upg.40': 'IGCD7',
	'garden.upg.41.desc': 'Reduce minimum IG time to 3 minutes',
	'garden.upg.41': 'IGCD8',
	'garden.upg.42.desc': 'Reduce minimum IG time to 1 minute',
	'garden.upg.42': 'IGCD9',
	'garden.upg.43.desc': 'Reduce minimum IG time to 30 seconds',
	'garden.upg.43': 'IGCD10',
	'garden.upg.44.desc': 'Reduce minimum IG time to 10 seconds',
	'garden.upg.44': 'IGCD11',
	'garden.upg.45.desc': 'Reduce minimum IG time to 3 seconds',
	'garden.upg.45': 'IGCD12',
	'garden.upg.46.desc': 'Reduce minimum IG time to 1 second',
	'garden.upg.46': 'IGCD13',
	'garden.upg.47.desc': 'Inspiration Generation can execute at any time',
	'garden.upg.47': 'IGCD14',

	'garden.gen.11': 'Prokaryotes',
	'garden.upg.51': 'cytoplasm',
	'dung.sp.0': 'Properties',
	'dung.sp.1': 'Skill Tree',
	'dung.sp.2.0': 'Core',
	'dung.sp.2.1': 'Dungeon',

	'garden.upg.52': 'Cell Membrane',
	'garden.upg.53': 'Life Activity',
	'garden.upg.54': 'Environmental Refliection',
	'garden.upg.55': 'Chloroplast',
	'garden.gen.12': 'Eukaryote',
	'garden.upg.56': 'LSER1',
	'garden.upg.56.desc': 'Enhance (local speed effect to entropy) by ^1.025',
	'garden.upg.57': 'I3',
	'garden.upg.58': 'I4',
	'garden.upg.59': 'E3',
	'garden.upg.60': 'INS1',

	'garden.upg.60.desc': 'Increase Inspiration exponent to 0.275',
	'garden.upg.61': 'LS4',
	'garden.upg.62': 'LS5',
	'garden.upg.63': 'IP1',
	'garden.upg.63.desc': 'Idea gain ×(log10(Total ideas+1)+1).',
	'garden.upg.64': 'I5',
	'garden.upg.65': 'I6',
	'garden.upg.66': 'E4',
	'garden.upg.67': 'ATU1',
	'garden.upg.67.desc': function () {
		return `Buy primitive upgrades per 1 second. Last bought: ${(Math.abs(Date.now() - player.garden.ATU1LastBought) / 1000).toFixed(3)} s`;
	},
	'garden.upg.68': 'ATB1',
	'garden.upg.68.desc': function () {
		return `Buy primitive generators per 1 second. Last bought: ${(Math.abs(Date.now() - player.garden.ATB1LastBought) / 1000).toFixed(3)} s`;
	},
	'garden.upg.69': 'ATU2',
	'garden.upg.69.desc': function () {
		return `Buy ancient upgrades per 3 seconds. Last bought: ${(Math.abs(Date.now() - player.garden.ATU2LastBought) / 1000).toFixed(3)} s`;
	},
	'garden.upg.70': 'ATB2',
	'garden.upg.70.desc': function () {
		return `Buy ancient generators per 3 seconds. Last bought: $${(Math.abs(Date.now() - player.garden.ATB2LastBought) / 1000).toFixed(3)} s`;
	},
	'garden.upg.71': 'EP1',
	'garden.upg.71.desc': 'Entropy gain ×(log10(Total ideas+1)+1).',
	'garden.upg.72': 'Nucleus',
	'garden.upg.73': 'Respiration',
	'garden.upg.74': 'Fungi',
	'garden.upg.75': 'Synapse',
	'garden.upg.76': 'INS2',
	'garden.upg.76.desc': 'Increase Inspiration exponent to 0.3',
	'garden.upg.77': 'INS3',
	'garden.upg.77.desc': 'Increase Inspiration exponent to 0.325',
	'garden.upg.78': 'INS4',
	'garden.upg.78.desc': 'Increase Inspiration exponent to 0.35',
	'garden.upg.79': 'INS5',
	'garden.upg.79.desc': 'Increase Inspiration exponent to 0.375',
	'garden.upg.80': 'INS6',
	'garden.upg.80.desc': 'Increase Inspiration exponent to 0.4',

	'res.ptpower': 'Proof theory power',
	'tab.oracle': 'Oracle',
	'upgs.6214': 'Compressed Hydra Energy increases Non Rec. Energy',
	'upgs.6215': 'Auto buy Y Seq Dimensions',

	'currency.焓': 'Enthalpy',
	'studies.nonrec.31': function () {
		if (player.retribution == 0) return '????';
		return 'PT reset keep Non Rec. Study tree';
	},

	'upgs.810': 'Enhance the formula of CHE to PT Power',
	'upgs.811': 'PT Power enhances CHE slog',
	'upgs.812': 'Reduce the softcap^2 of Non Rec. BMS effect',
	'upgs.6218': 'PT Power enahnces Non Rec. BMS speed',
	'upgs.6219': 'Reduce the growth rate of Fates',
	'upgs.6220': 'Oracle bit gain speed^1.5',
	'upgs.813': 'Non Rec. BMS effect ×10',
	'upgs.814': 'Reduce and delay the softcap^2 of Non Rec. BMS effect',
	'upgs.815': 'Delay justice-fate effect softcap by *2',
	'upgs.816': 'Delay justice-fate effect softcap by *100',
	'upgs.mil.sin_2': 'The effect of adjacent instance of the same fate(4-element fates) ^1.05',
	'upgs.mil.sin_3': 'PT Power delays the softcap^3 of Compressed Hydra Energy.',
	'upgs.mil.sin_4': 'Compressed Hydra Energy silently enhances PT Power',
	'upgs.mil.sin_5': 'The rate of fates +1000%',
	'upgs.mil.sin_6': 'Karma significantly enhances Compressed Hydra Energy',
	'upgs.mil.sin_7': 'PT Power enhances Sin',
	'upgs.mil.sin_8': 'The gain of karma ^1.75',
	'upgs.mil.sin_9': 'Get 1% of pending PT power/s passively.',
	'upgs.mil.sin_10':
		'Unlock the well-orderness progression of <b>Y Sequence</b>; Unlock the 2nd Effect of Non Rec. BMS. PT will not reset Number Theory #5',

	'upgs.U6R31':
		'Unlock lemma prover, prove 1 lemma per 10 seconds (For every increase in lemma level, the proof speed slows down to 1/4)',
	'upgs.U6R32':
		'Unlock theorem prover, prove 1 theorem(requires and spends 4^(lemma level)  lemmas) per 100 seconds.',
	'upgs.U6R33': 'Lemmas count enhances Karma gain',
	'upgs.U6R34': "Enhance lemma prover & theorem prover's speed, based on Compressed Hydra Energy",
	'upgs.U6R35': "Enhance lemma prover's speed, based on Compressed Hydra Energy",
	'upgs.U6R36': 'Proving theorem will not spend lemmas',
	'upgs.U6R37': "Multiply Lemma effect, lemma prover's speed and theorem prover's speed by 10",
	'upgs.U6R38': 'U6-R-3-4 effect ^2, U6-R-3-5 effect^1.5',
	'upgs.U6R39': 'Lemma effect ^1.1',
	'upgs.U6R310': "Significantly enhance lemma prover's speed, based on Compressed Hydra Energy",
	'upgs.U6R311': "Significantly enhance theorem prover's speed, based on lemma counts",
	'upgs.U6R312':
		"Lemma level will not decrease lemma prover's speed, raise the effect of U6-R-3-11 by 1.5",

	'oracle.fate.type.0': 'Space-fate',
	'oracle.fate.type.1': 'Time-fate',
	'oracle.fate.type.2': 'Life-fate',
	'oracle.fate.type.3': 'Death-fate',
	'oracle.fate.type.4': 'Justice-fate',

	'oracle.fate.type.0.title': 'Space',
	'oracle.fate.type.0.effect': 'Base: CHE slog +0.075',

	'oracle.fate.type.1.title': 'Time',
	'oracle.fate.type.1.effect': 'Base: Proof theory Power ×0.075',

	'oracle.fate.type.2.title': 'Life',
	'oracle.fate.type.2.effect': 'Base: Idea & Entropy ×+0.075',

	'oracle.fate.type.3.title': 'Death',
	'oracle.fate.type.3.effect': 'Base: Garden Local speed ×+0.075',

	'oracle.fate.type.4.title': 'Justice',
	'oracle.fate.type.4.effect': 'Raise the sorrunding other fates by ×1.8',

	'oracle.fate.type.tot': 'Total: {effect}',

	'oracle.fate.type.0.slot': 'Space',
	'oracle.fate.type.1.slot': 'Time',
	'oracle.fate.type.2.slot': 'Life',
	'oracle.fate.type.3.slot': 'Death',
	'oracle.fate.type.4.slot': 'Justice',

	'oracle.fate.effect.1': 'Total PT Power makes fate rate+{effect}%',
	'oracle.fate.effect.2': 'Total Oracle bit  makes fate rate+{effect}% after 88 oracle bits',
	'oracle.fate.effect.3':
		'After 1e10,000,000 PT Power, improve PT power gain formulat , and fate rate +500.0000%( static)',
	'oracle.fate.effect.4':
		'After e1.500e11 PT Power, reduce the softcap^2 of Compressed Hydra Energy',
	'oracle.fate.tip': 'Unlock next feature after 1e9 PT Power',
	'oracle.fate.vow': 'Vow points: ',
	'oracle.fate.vow.p.0': 'Garden Generator Progress',
	'oracle.fate.vow.p.1': 'Proof-Theory Reset Progress',
	'oracle.fate.vow.respec': 'Respec',

	'oracle.sin.value': 'You have {value} sin (not really sin)',
	'oracle.sin.youhave': 'You have {value} karma',
	'oracle.sin.effect2': ', makes Compressed Hydra Energy slog +{effect} after softcap',

	'nonrecbms.value': 'You progressed Non Rec. BMS for {a} times, the ordinal is',
	'nonrecbms.effect.0': 'Non Rec. BMS makes Compressed Hydra Energy slog +{effect}',
	'nonrecbms.effect.1': 'Karma gain speed×{effect}',

	'nt.wellorderness.y.a': `You have proved<b style="color: #c98300; font-size: 30px">{lemmas}</b
			> lemmas (Compressed Hydra Energy+{effect1} slog)，<b style="color: #c98300; font-size: 30px">{theorems}</b
			> theorems (pending {pending}, lemmas effect×{effect2}).`,

	'nt.wellorderness.y.level.a': 'Your lemma level is {lemma}, theorem level is{theorem}.',
	'nt.wellorderness.y.level.le': `Increase lemma level, requires {requires} theorems.<br />Lemma prover's speed/4, but lemmas effect×1.5.`,
	'nt.wellorderness.y.level.th': `Increase theorem level, requires {requires} theorems. <br />Reset previous progresses, but theorems effect ^1.5.`,
	'nt.wellorderness.y.level.re': `Decrease 1 lemma level(it doesn't refund theorems)`,
	'nt.wellorderness.y.status': `Theorem prover`,
	'nt.wellorderness.y.prove':
		'Prove the well-orderness of Y sequence, requires F9.0070e15 Deduction Energy',
	'nt.wellorderness.y.effect': `Reward (of the well-orderness of Y): Remove the softcap of lemmas. You can do 2nd retribution reset after F3.403e38 Compressed Hydra Energy.<br />You gain 1 deduction energy^2.`,
	'nt.wellorderness.y.2': `You have <b style="color: #c98300; font-size: 30px">{a}</b> deduction energy^2, makes lemma prover\s speed ×{effect}.`,
	'set.gamma.unabled':
		"Because the existing Gamma test has entered a special stage, you can't enter the Gamma test now.",
};
