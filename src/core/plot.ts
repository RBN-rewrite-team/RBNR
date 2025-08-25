import { player } from './save';

export function unlockedPlots() {
	let a = 1;
	if (player.stat.chapter >= 0) {
		a++;
	}
	if (player.stat.chapter >= 1) {
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
];
export const characterImages = {
	Numerorum: 'url(./plot_image/NumerorumColor.png)',
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
