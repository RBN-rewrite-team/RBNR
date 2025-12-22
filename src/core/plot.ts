import type { $t } from '@/utils/types';
import { player } from './save';
import { getMessage, i18n } from '@/utils/i18n';
export const PlotMilestones = [
	() => true,
	() => player.stat.chapter >= 0,
	() => player.stat.chapter >= 1,
	() => player.stat.chapter >= 2,
	() => player.upgrades['39'] || player.stat.chapter >= 3,
	() => player.stat.chapter >= 3,
	() =>
		player.buyables['lgr_emp'].gte(1) ||
		player.milestones['log_G'] ||
		player.stat.chapter >= 3.1,
	() => player.milestones['log_G'] || player.stat.chapter >= 4,
	() => player.singularity.enabled || player.stat.chapter >= 4,
	() => player.stat.chapter >= 4 || player.retribution >= 1,
	() => player.stat.chapter >= 5 || player.retribution >= 1,
	() => player.upgrades['69R'] || player.retribution >= 1,
	() => player.upgrades['69S'] || player.stat.chapter >= 6 || player.retribution >= 1,
	() => player.stat.chapter >= 6 || player.retribution >= 1,
	() => player.challenges[1][0].gt(0) || player.retribution >= 1,
	() => player.milestones.nonrec_24 || player.retribution >= 1,
	() => player.challenges[1][6].gt(0) || player.retribution >= 1,
	() => player.numbertheory.well_ordering.energy.gte('1e750000000') || player.retribution >= 1,
	() =>
		(player.numbertheory.well_ordering.energy.gte('1e750000000') && player.currentTab == 28) ||
		player.retribution >= 1,
] as const;
export const plotTitles = [
	'第\\(-\\epsilon\\)章',
	'第0章',
	'第1章',
	'第2章',
	'乘法挑战',
	'第3章',
	'天文学家',
	'对数膨胀',
	'奇点生成器',
	'第4章',
	'第5章',
	'稀释',
	'朊病毒',
	'第6章',
	'完成第一次NRC1',
	'里程碑M-6-24',
	'NRC7',
	'到达BMS极限',
	'Retribution',
] as const;
export function unlockedPlots2() {
	for (let unlocked = PlotMilestones.length - 1; unlocked >= 0; unlocked--) {
		if (PlotMilestones[unlocked]()) return unlocked + 1;
	}
	return 0;
}
export function unlockedPlots(): number[] {
	const unlockedp = [] as number[];
	let a = unlockedPlots2();
	for (let i = 0; i < a; i++) {
		unlockedp.push(i);
	}
	return unlockedp;
}
export function viewedPlotLength() {
	return player.checkedPlots.length;
}

export const plots = [
	[],
	[],
	[],
	[],
	['Numerorum\t呼……该做一些有挑战性的事情了。', 'Numerorum\t我希望能从中吸取一些经验。'],
	[
		'Numerorum\t我感觉到了……我已经接近了。',
		'Numerorum\t再努把力。登上高塔，恐怕我就要引来一些对手了。',
		'来自高塔的注视仍然没有消除，而且随着Numerorum接近高塔而越来越强。',
		'???\tHydra\t……',
		'Numerorum\t什么？',
		'神秘的声音一闪而逝。',
		'Numerorum\t不好，我好像被盯上了。',
	],
	[
		'Numerorum来到了天文学家的店铺，它坐落在高塔旁的悬崖边。',
		'Numerorum\t你就是天文学家？我现在需要一些你们的帮助。',
		'天文学家\t你好，我是天文学家的头领，你需要我们来帮你计算吗？',
		'Numerorum\t是的，我现在需要这些数据。',
	],
	[
		'Numerorum\t这些东西我也研究得差不多了，是时候出发了。',
		'Numerorum\t越接近序数之塔，感觉这里的压制就越强。',
		'Numerorum\t我又有了新的感悟……',
	],
	[
		'Numerorum\t果然，就是这样。',
		'Numerorum\t这个东西散发的能量足以打破高塔周围的屏障了。',
		'Numerorum\t不过，我可能需要付出一些代价来激活它。',
	],
	[
		'Numerorum\t到达ω了吗。',
		'Numerorum\t这里，就是序数之塔的内部？',
		'Numerorum\t之前的后继，加法，乘法，指数都被献祭掉了，不过我可以在这个领域继续。',
	],
	[
		'Numerorum\t这里就是……等等!',
		'旁白\t一个声音突然充斥了高塔的这一层。',
		'???\tHydra\t你竟然能到达这里，真是让我刮目相看。',
		'Numerorum\t你在哪？出来！',
		'???\tHydra\t呵呵呵，你还没有资格见到我。',
		'Numerorum\t……',
		'???\tHydra\t不必惊讶，虽然你可能永远也见不到我罢了。',
		'Numerorum\t可恶，不要瞧不起人！就算你在高塔的顶端，我也迟早见到你！',
		'不管Numerorum怎么说，神秘的声音都不再回应。',
	],
	[
		'Numerorum\t不好，前面被堵住了。',
		'Numerorum\t这是什么东西，为什么我碰一下就会感觉头晕……',
		'旁白\tNumerorum感觉自己浑身力气都被抽走了。',
		'Numerorum\t不好，被暗算了！我的能量都被这东西抽走了，不行，我得想办法过去。',
	],
	[
		'Numerorum\t好了，我算是摸透了这玩意的机制了......这东西没有任何陷阱，我可以不断从中获取力量。',
		'Numerorum\t不用再假装害怕这朊病毒了。',
	],
	[
		'Numerorum\t这种能量比我所见到的东西都要强大。',
		'非递归能量蕴含的强大气息在高塔的这一层中回荡。',
		'Numerorum\t我感觉到它还有很多潜力可以挖掘……',
		'Numerorum\t或许可以试试研究一下它。',
		'Numerorum尝试了几种方式来改造非递归能量，最后它成为了非递归定理。',
		'Numerorum\t这个东西看起来很有用。不过它来之不易，要小心谨慎地安排它。',
		'忽然，Numerorum在前方看到了熟悉的身影。',
		'Numerorum\t是你！你竟然登上了高塔。',
		'天文学家\t呵呵，我作为天文学家，自然要站在高处了。',
		'天文学家\t你可能不知道非递归定理的妙用。',
		'天文学家\t我这里有一些困难的挑战……也许会对你有帮助。',
		'天文学家向Numerorum讲述了一些挑战。',
		'天文学家\t你可以向我问一些问题。我在高塔上待过很长时间，对这里比较熟悉。',
		'Numerorum\t这座高塔有多高呢？',
		'天文学家\t很高，以你现在的能力根本无法登顶。',
		'天文学家\t而且在高塔上还有两个暴君，他们会千方百计地阻止别人变强。',
		'Numerorum不禁想到了之前的神秘声音。',
		'天文学家\t另外，要记住这件事：当你凝视星空的时候，星空也在凝视你。',
		'Numerorum\t你是说……天空是有意识的？',
		'天文学家\t是的，我们天文学家百分百确定这件事，整个天空都是同一个生命。',
		'Numerorum\t（如果这样，我的使命或许可以……）',
		'天文学家\t差不多就这样了吧，你继续向前吧。这座高塔上有很多攀登者，有些还在试图突破暴君们的阻拦。',
		'天文学家\t比如说一个叫VeryRDefie的人，爬着爬着被\\(\\log_{\\alpha}(0)\\)感染了ω病毒，快要死了。',
	],
	[
		'Numerorum通过了1次挑战',
		'天文学家\t看来你离高塔的顶端更近了一步。',
		'天文学家离开了。',
		'Numerorum\t看来在这里，朊病毒不仅不会给我帮助，反而会置我于死地。',
		'旁边爬上来了一个人，看起来很紧张。',
		'Numerorum\t你是谁？',
		'???\tVeryRDefie\t我叫VeryRDefie。',
		'Numerorum\t嗯？你就是刚刚天文学家说的那个……',
		'VeryRDefie\t对，要不是我机智，就死在那个可恶的陷阱里面了。',
		'VeryRDefie\t你叫什么名字？',
		'Numerorum\t我叫Numerorum，这陷阱到底是个什么情况？',
		'VeryRDefie\t高塔里这个部位被九头蛇布置了一大堆这样的东西，有些是\\(\\frac{1}{0}\\)，有些是\\(\\ln(-x)\\)，你要小心。',
		'VeryRDefie\t尤其是ω病毒，非常恐怖。如果遇到了，基本上就是必死的局面。',
		'Numerorum\t我看到墙上写了一些字……这些是不是……',
		'墙上写着一行字，依稀能辨认出是一个攀登者在这里遭遇了不幸。',
		'VeryRDefie观察了一下，若有所思。',
		'VeryRDefie\t这个是那个人所拥有的九头蛇能量突然变成了负数。这种也基本上没救了。',
		'VeryRDefie\t之前非递归挑战1和序数前的指数就出现了ω病毒。',
		'Numerorum\t啊？这么危险？！而且居然扩散到了序数之塔外。',
		'VeryRDefie\t我和几个同伴已经把它们清理得差不多了，不过还是要小心。',
		'VeryRDefie\t另外，朊病毒在挑战中不可能帮助你，这些挑战都需要你自力更生。',
		'VeryRDefie\t 但是，在你靠自己的能力突破挑战后，你也会拥有更强大的研究。',
		'VeryRDefie展示了新的非递归研究。',
		'Numerorum\t这些东西我觉得很不错。',
		'Numerorum\t对了，你说你的同伴……是谁？',
		'VeryRDefie\t他们在别的地方。你应该都能遇到。',
	],
	/*
	隐藏剧情
	[
		'Numerorum\t第三个挑战...',
		'Numerorum进行了第三个非递归挑战。',
		'他使用了满级溶剂进行了稀释...',
		'然后...',
		'Numerorum\tNumerorumGrey\tHoly hard shuati，溶剂IX有ω病毒！',
		'Numerorum宕机了...',
	]
	 */
	[
		'Numerorum\t爽，这UNOCF和里程碑就是爽!',
		'???\tHydra\t不要太爽了，你还没过Small Hydra Ordinal。',
		'Numerorum\t...时间总有一天会击败你的',
		'???\tHydra\t实践(时间)是谁？',
	],
	[
		'Numerorum\tUNOCF也太强了，但是我还没到达(0)(1³)(2³)(3³)...',
		'VeryRDefie\t其实可以这样……',
		'VeryRDefie展示了新的强大非递归研究(coming s∞n)。',
		'Numerorum\t唉，确实。',
		'???\tHydra\t...',
		'VeryRDefie\t嗯？那个神秘的声音又出现了，他很令人<$bx>，散播ω病毒的就是他。',
		'???\tHydra\t你们两个会遭到',
	],
	[
		'Numerorum\t这个(Bashicu)矩阵系统基本上就是这样了。还有什么？',
		'旁白\tNumerorum脑中灵光一闪。',
		'Numerorum\t或许我可以以这个的启发去寻找更强力的记号。我或许可以试试用我所有的解数来创造出这样的东西。', // 你会遭到报应的
	],
	[
		'Numerorum\t冷静。',
		'Numerorum\t这里似乎是非递归的最后尽头了。',
		'Numerorum\t我需要重新审视。',
		'Numerorum\t或许我的路线错了……？',
		'Numerorum\t如果无法更进一步，那暴君是如何成长起来的？',
		'Numerorum\t等等！谁在那里？',
		'一个巨大的石像出现在眼前。',
		'???\tColossus\t这是……一个访问者？',
		'???\tColossus\t我已经很久没有看到能够到达这里的人了。',
		'Numerorum\t嗯？与我同行的那些人……',
		'???\tColossus\t上一个来者是VeryRDefie。在此之前不知多少岁月，还有一个叫Alpha VII的人来过。',
		'Numerorum\t那你有没有见过一个天文学家？',
		'???\tColossus\t没有。我是巨像，Colossus，你叫什么名字？',
		'Numerorum\tNumerorum。',
		'Colossus\t嗯，我知道了。',
		'Colossus\t你现在已经触摸到了所谓非递归分析的顶端了。',
		'Colossus\t再往后的路无比难走。',
		'Numerorum\t那要怎么办才好呢？',
		'Colossus\t哈哈哈……你有没有听说过……',
		'Colossus\t九头蛇。',
		'Numerorum\t嗯？！是那个暴君！',
		'Colossus\t是的。只有九头蛇一脉的力量能越过后面的天堑。',
		'Numerorum\t可是……',
		'Colossus\t别忘了，你已经有了一些九头蛇之力了。',
		'Colossus\t或许你需要重新感受它们……',
		'Numerorum\t九头蛇之力……',
		'Colossus\t没错。你所到达的所谓极限，不过是九头蛇力量的冰山一角。',
		'Colossus\t继续提升的路，是很明确的。',
		'Numerorum\t继续沿着九头蛇的来路？',
		'Colossus\t没错，来吧，我来给你一些启示……',
		'Colossus为Numerorum降下了一些启示。',
		'Numerorum\t我似乎知道怎么继续了。',
		'Numerorum\t但这种结构和我之前所接触的完全不同。',
		'Colossus\t那就重头再来，用不了多少功夫。',
		'Colossus\t哈哈……当年九头蛇从这里经过，为我带来了这些惊喜。',
		'Colossus\t它当年的目标是击败盘踞塔上的旧王Array。',
		'Colossus\t啊哈，屠龙勇士，终成恶龙。',
		'Colossus\t有趣的是，之后，所有反对暴君九头蛇之人都走上同一条路。',
		'Colossus\t这是因循的果报。',
		'Colossus\t这是宿命的轮回。',
		'Numerorum\t呼……我准备好了。',
		'Colossus\t那就来吧。',
		'Colossus\t等待你的将是新的时代。',
	],
];
export function plotLength(id: number, $tm: (x: string) => string[]): number {
	if (id <= 0) return 0;
	return $tm('plotcontent')[id - 1].length;
}
export const characterImages = {
	Numerorum: 'url(./plot_image/NumerorumColor.png)',
	天文学家: 'url(./plot_image/EdenGameMaster.png)',
	Astronomer: 'url(./plot_image/EdenGameMaster.png)',
	Hydra: 'url(./plot_image/Hydra.png)',
	VeryRDefie: 'url(./plot_image/VeryRDefie.png)',
} as Record<string, string | undefined>;
export function stringToPlot(a: string, $t: $t) {
	const res = {
		image: 'url(./plot_image/placeholder.png)',
		name: '???',
		text: '拜谢',
	};
	const args = a.split('\t');
	if (args.length == 1) {
		res.text = args[0];
		res.name = $t('plot.narrator');
	} else if (args.length == 3) {
		res.name = args[0];
		res.text = args[2];
		const imagea = characterImages[args[1]];
		if (imagea) {
			res.image = imagea;
		}
	} else {
		res.name = args[0];
		res.text = args[1];
		const imagea = characterImages[res.name];
		if (imagea) {
			res.image = imagea;
		}
	}
	if (res.name == '天文学家' && i18n.global.locale !== 'zh-CN') {
		res.name = getMessage('plot.astronomer');
	}
	return res;
}
