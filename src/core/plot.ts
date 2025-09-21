import { player } from './save';
const LOG_ALPHA_ZERO =
	'<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><msub><mrow><mi>log</mi><mo>⁡</mo></mrow><mi>α</mi></msub><mo stretchy="false">(</mo><mn>0</mn><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">\log_{\alpha}(0)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mop"><span class="mop">lo<span style="margin-right:0.01389em;">g</span></span><span class="msupsub"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.0573em;"><span style="top:-2.4559em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mathnormal mtight" style="margin-right:0.0037em;">α</span></span></span></span></span><span class="vlist-s">&ZeroWidthSpace;</span></span><span class="vlist-r"><span class="vlist" style="height:0.2441em;"><span></span></span></span></span></span></span><span class="mopen">(</span><span class="mord">0</span><span class="mclose">)</span></span></span></span>';
const FRAC_1_0 =
	'<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mfrac><mn>1</mn><mn>0</mn></mfrac></mrow><annotation encoding="application/x-tex">\frac{1}{0}</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1.1901em;vertical-align:-0.345em;"></span><span class="mord"><span class="mopen nulldelimiter"></span><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:0.8451em;"><span style="top:-2.655em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">0</span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span style="top:-3.394em;"><span class="pstrut" style="height:3em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">1</span></span></span></span></span><span class="vlist-s">&ZeroWidthSpace;</span></span><span class="vlist-r"><span class="vlist" style="height:0.345em;"><span></span></span></span></span></span><span class="mclose nulldelimiter"></span></span></span></span></span>';
const LN_NEG_X =
	'<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>ln</mi><mo>⁡</mo><mo stretchy="false">(</mo><mo>−</mo><mi>x</mi><mo stretchy="false">)</mo></mrow><annotation encoding="application/x-tex">\ln(-x)</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mop">ln</span><span class="mopen">(</span><span class="mord">−</span><span class="mord mathnormal">x</span><span class="mclose">)</span></span></span></span>';
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
	if (player.upgrades['69R']) a++;
	if (player.upgrades['69S'] || player.stat.chapter >= 6) a++;
	if (player.stat.chapter >= 6) a++;
	if (player.challenges[1][0].gt(0)) a++;
	if (player.milestones.nonrec_24) a++;
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
		'天文学家\t比如说一个叫VeryRDefie的人，爬着爬着被' +
			LOG_ALPHA_ZERO +
			'感染了ω病毒，快要死了。',
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
		'VeryRDefie\t高塔里这个部位被九头蛇布置了一大堆这样的东西，有些是' +
			FRAC_1_0 +
			'，有些是' +
			LN_NEG_X +
			'，你要小心。',
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
];
export function plotLength(id: number): number {
	if (id <= 0) return 0;
	return plots[id - 1].length;
}
export const characterImages = {
	Numerorum: 'url(./plot_image/NumerorumColor.png)',
	天文学家: 'url(./plot_image/EdenGameMaster.png)',
	Hydra: 'url(./plot_image/Hydra.png)',
	VeryRDefie: 'url(./plot_image/VeryRDefie.png)',
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
