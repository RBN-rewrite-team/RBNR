import { player } from './save';

export function unlockedPlots() {
	let a = 1;
	if (player.stat.chapter >= 0) {
		a++;
	}
	if (player.stat.chapter >= 1) {
		a++;
	}
	if (player.stat.chapter >= 2) {
		a++;
	}
	if (player.upgrades['39'] || player.stat.chapter >= 3) {
		a++;
	}
	if (player.stat.chapter >= 3) {
		a++;
	}
	if (
		player.buyables['lgr_emp'].gte(1) ||
		player.milestones['log_G'] ||
		player.stat.chapter >= 3.1
	) {
		a++;
		player.stat.chapter = Math.max(player.stat.chapter, 3.1);
	}
	if (player.milestones['log_G'] || player.stat.chapter >= 4) {
		a++;
	}
	if (player.singularity.enabled || player.stat.chapter >= 4) {
		a++;
	}
	if (player.stat.chapter >= 4) {
		a++;
	}
	if (player.stat.chapter >= 5) {
		a++;
	}
	if(player.upgrades['69R']) a++;
	if(player.upgrades['69S'] || player.stat.chapter >= 6) a++;
	return a;
}
export function viewedPlotLength() {
	return player.checkedPlots.length;
}

export const plots = [
	[
		'大基数在支撑集合论宇宙的序数高塔中飘荡。',
		'随后，Numerorum在“大数世界”的边疆醒来。',
		'Numerorum\t……',
		'Numerorum\t终于……醒来了。',
		'Numerorum看看这熟悉又陌生的世界。',
		'Numerorum\t世界改变了许多。',
		'Numerorum\t但我的使命还没有完成……',
		'远处的序数高塔若隐若现。',
		'Numerorum\t该从哪里开始我的目标呢？',
		'Numerorum\t负数显然离我的目标有点远。',
		'Numerorum\t就先从0开始吧。',
	],
	[
		'随着第一次后继运算的进行，Numerorum感受到了曾经的气息。',
		'Numerorum\t这熟悉的感觉。',
		'Numerorum\t这一个个连成串的数字，可能是我这一段旅程中唯一的伙伴了。',
		'Numerorum\t虽然长路漫长，但是好的开始是成功的一半。',
		'Numerorum\t加油。',
		'敢问路在何方？路在脚下。',
	],
	[
		'Numerorum\t这个能量，有一种让人舒服的感觉。',
		'Numerorum\t花费这么多数字是值得的。',
		'Numerorum\t我怎么感觉到谁在看着我？',
		'Numerorum望向半空中的序数高塔。',
		'高塔高耸入云，无法看穿。',
		'Numerorum\t注视感来自高塔的顶端。',
		'能登上高塔之巅的人，Numerorum暂时还无法窥探。',
		'Numerorum\t究竟是谁建造了这么高的建筑？',
		'Numerorum\t可惜我现在还很弱小，无法攀登这座高塔。',
		'Numerorum\t那就立下小目标，先进入序数的层次。',
	],
	[
		'Numerorum\t这是一种更精密的能量。',
		'Numerorum\t我选择的路没有错误。',
		'Numerorum\t但是那种来自序数之塔的注视感更加强烈了。',
	],
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
		'EdenGameMaster\t你好，我是天文学家的头领，你需要我们来帮你计算吗？',
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
		'Numerorum:好了，我算是摸透了这玩意的机制了......这东西没有任何陷阱，我可以不断从中获取力量。',
		'Numerorum:不用再假装害怕这朊病毒了。',
	],
];
export function plotLength(id: number): number {
	if(id <= 0) return 0;
	return plots[id - 1].length;
}
export const characterImages = {
	Numerorum: 'url(./plot_image/NumerorumColor.png)',
	EdenGameMaster: 'url(./plot_image/EdenGameMaster.png)',
	Hydra: 'url(./plot_image/Hydra.png)',
} as Record<string, string | undefined>;
export function stringToPlot(a: string) {
	let res = {
		image: 'url(./plot_image/placeholder.png)',
		name: '???',
		text: '拜谢',
	};
	let args = a.split('\t');
	if (args.length == 1) {
		res.text = args[0];
	} else if (args.length == 3) {
		res.name = args[0];
		res.text = args[2];
		let imagea = characterImages[args[1]];
		if (imagea) {
			res.image = imagea;
		}
	} else {
		res.name = args[0];
		res.text = args[1];
		let imagea = characterImages[res.name];
		if (imagea) {
			res.image = imagea;
		}
	}
	return res;
}
