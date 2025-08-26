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
	return a;
}
export function viewedPlotLength() {
	return player.checkedPlots.length;
}

export const plots = [
	[
		'大基数在支撑集合论宇宙的序数高塔中飘荡。',
		'随后，Numerorum来到了这个“大数世界”上。',
		'Numerorum\t......',
		'Numerorum\t醒来了呢。',
		'Numerorum\t该从哪里开始我的目标呢？',
		'Numerorum\t负数显然离我的目标有点远。',
		'Numerorum\t就先从0开始吧。',
	],
	[
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
		'Numerorum\t是谁建造了这么高的建筑？',
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
	],
	[
		'EdenGameMaster\t你好，我是天文学家的头领，你需要我们来帮你计算吗？',
		'Numerorum\temmmm....你们居然把店铺开设在这么接近高塔的地方。',
		'EdenGameMaster\t或许在高塔上有缘还会再见。',
	],
	[
		'Numerorum\t这些东西我也研究得差不多了，是时候出发了。',
		'Numerorum\t这个东西散发的能量足以打破高塔周围的屏障了。',
		'Numerorum\t不过，我可能需要付出一些代价来激活它。',
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
];
export const characterImages = {
	Numerorum: 'url(./plot_image/NumerorumColor.png)',
	EdenGameMaster: 'url(./plot_image/EdenGameMaster.png)',
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
