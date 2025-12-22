import { player } from '@/core/save';
import { wordShift } from "@/core/word-shift";
import { useUpdate } from "@/lib/useUpdate";
import { defineComponent } from "vue";
import { useI18n } from 'vue-i18n';

export default defineComponent({
    name: "EnterTheCardinalWorld",
    setup(props, ctx) {
		const $t = useI18n().t;
		function differ() {
			const WIP_MS = 1 * 220000;
			
			let d = Date.now();
			if(!player.thedoorofcardinalstate) return 0;
			if(d - player.thedoorofcardinaltime >= WIP_MS) player.thedoorofcardinaltime = d - WIP_MS;
			return d - player.thedoorofcardinaltime;
		}
		const diff = useUpdate(differ);
		let point_list = [];
		for(let i = 0;i < 1000;i++)
		{
			point_list.push([i, Math.random() * 360, (Math.random() + 0.5) * 0.025, Math.random() * 600 + 100]);
		}
        return () => (diff.value > 0 ? <>
            <div style={{
				position: 'absolute',
				width: '100%',
				height: '100%',
				top: 0,
				left: 0,
				'z-index': 10,
				'background-color': 'black',
				opacity: diff.value < 5000 ? diff.value / 5000 : 1,
			}}>
				{diff.value > 5000 ? <>
			{diff.value},{player.thedoorofcardinalcrisis}
				<div style={{
					position: 'absolute',
					width: '50px',
					height: '4px',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					opacity: diff.value < 8000 ? Math.sin((diff.value - 8000) / 3000 * 4.5 * Math.PI) / 2 + 0.5 : 1,
					'background-image': 'linear-gradient(to right, black 0%, white 50%, black 100%)',
					'z-index': 12,
				}} />
				<div style={{
					position: 'absolute',
					width: '4px',
					height: '50px',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					opacity: diff.value < 8000 ? Math.sin((diff.value - 8000) / 3000 * 4.5 * Math.PI) / 2 + 0.5 : 1,
					'background-image': 'linear-gradient(to bottom, black 0%, white 50%, black 100%)',
					'z-index': 12,
				}} />
				<div style={{
					position: 'absolute',
					width: '8px',
					height: '8px',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					opacity: diff.value < 8000 ? Math.sin((diff.value - 8000) / 3000 * 4.5 * Math.PI) / 2 + 0.5 : 1,
					'box-shadow': '0px 0px 3px 3px white',
					'background-color': 'white',
					'border-radius': '4px',
					'z-index': 12,
				}} />
				<div style={{
					position: 'absolute',
					display: diff.value < 12000 && diff.value > 8000 ? 'block' : 'none',
					width: (diff.value - 8000) / 1 + 'px',
					height: (diff.value - 8000) / 1 + 'px',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					'background-color': 'rgba(0, 0, 0, 0)',
					'border': '2px solid white',
					'border-radius': (diff.value - 8000) / 2 + 'px',
				}} />
				<div style={{
					position: 'absolute',
					display: diff.value < 12500 && diff.value > 8500 ? 'block' : 'none',
					width: (diff.value - 8500) / 0.975 + 'px',
					height: (diff.value - 8500) / 0.975 + 'px',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					'background-color': 'rgba(0, 0, 0, 0)',
					'border': '2px solid white',
					'border-radius': (diff.value - 8500) / 1.95 + 'px',
				}} />
				<div style={{
					position: 'absolute',
					display: diff.value < 13000 && diff.value > 9000 ? 'block' : 'none',
					width: (diff.value - 9000) / 0.95 + 'px',
					height: (diff.value - 9000) / 0.95 + 'px',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					'background-color': 'rgba(0, 0, 0, 0)',
					'border': '2px solid white',
					'border-radius': (diff.value - 8500) / 1.9 + 'px',
				}} />
				<div style={{
					position: 'absolute',
					display: diff.value < 13500 && diff.value > 9500 ? 'block' : 'none',
					width: (diff.value - 9500) / 0.9 + 'px',
					height: (diff.value - 9500) / 0.9 + 'px',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					'background-color': 'rgba(0, 0, 0, 0)',
					'border': '2px solid white',
					'border-radius': (diff.value - 8500) / 1.8 + 'px',
				}} />
				<div style={{
					position: 'absolute',
					display: diff.value < 14000 && diff.value > 10000 ? 'block' : 'none',
					width: (diff.value - 10000) / 0.85 + 'px',
					height: (diff.value - 10000) / 0.85 + 'px',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					'background-color': 'rgba(0, 0, 0, 0)',
					'border': '2px solid white',
					'border-radius': (diff.value - 8500) / 1.7 + 'px',
				}} />
				<div style={{
					position: 'absolute',
					display: diff.value < 14400 && diff.value > 10400 ? 'block' : 'none',
					width: (diff.value - 10400) / 0.775 + 'px',
					height: (diff.value - 10400) / 0.775 + 'px',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					'background-color': 'rgba(0, 0, 0, 0)',
					'border': '2px solid white',
					'border-radius': (diff.value - 8500) / 1.55 + 'px',
				}} />
				<div style={{
					position: 'absolute',
					display: diff.value < 14800 && diff.value > 10800 ? 'block' : 'none',
					width: (diff.value - 10800) / 0.7 + 'px',
					height: (diff.value - 10800) / 0.7 + 'px',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					'background-color': 'rgba(0, 0, 0, 0)',
					'border': '2px solid white',
					'border-radius': (diff.value - 10800) / 1.4 + 'px',
				}} />
				<div style={{
					position: 'absolute',
					display: diff.value < 15100 && diff.value > 11100 ? 'block' : 'none',
					width: (diff.value - 11100) / 0.6 + 'px',
					height: (diff.value - 11100) / 0.6 + 'px',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					'background-color': 'rgba(0, 0, 0, 0)',
					'border': '2px solid white',
					'border-radius': (diff.value - 11100) / 1.2 + 'px',
				}} />
				<div style={{
					position: 'absolute',
					display: diff.value < 15350 && diff.value > 11350 ? 'block' : 'none',
					width: (diff.value - 11350) / 0.5 + 'px',
					height: (diff.value - 11350) / 0.5 + 'px',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					'background-color': 'rgba(0, 0, 0, 0)',
					'border': '2px solid white',
					'border-radius': (diff.value - 11350) / 1 + 'px',
				}} />
				
				<div style={{
					position: 'absolute',
					display: diff.value < 12350 && diff.value > 9150 ? 'block': 'none',
					width: (diff.value - 9150) * 6 + 'px',
					height: '2px',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%) rotate(35deg)',
					'background-color': 'white',
				}} />
				
				<div style={{
					position: 'absolute',
					display: diff.value < 12350 && diff.value > 10550 ? 'block': 'none',
					width: (diff.value - 10550) * 6 + 'px',
					height: '2px',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%) rotate(85deg)',
					'background-color': 'white',
				}} />
				
				<div style={{
					position: 'absolute',
					display: diff.value < 12350 && diff.value > 11250 ? 'block': 'none',
					width: (diff.value - 11250) * 6 + 'px',
					height: '2px',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%) rotate(25deg)',
					'background-color': 'white',
				}} />
				
				{point_list.map(
					(x) => {
						return diff.value >= 15350 + x[0] * 100 && <>
							<div style={{
								position: 'absolute',
								top: '50%',
								left: '50%',
								transform: 'translate(-50%, -50%) rotate(' + x[1] + 'deg)'
							}}>
								{(() => {
									const t = ((diff.value - (15350 + x[0] * 100)) * x[2] + x[3]);
									if (t > ((document.body.offsetHeight*0.5) **2 + (document.body.offsetWidth*0.5) **2)**0.5) return <></>
									return  <div style={{
									position: 'absolute',
									display: diff.value < 160000 ? 'block' : 'none',
									width: '6px',
									height: '6px',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%) translateX(' + t + 'px) scale(' + ((t - x[3]) / x[2]) / 10000 + ')',
									filter: 'blur(' + (0.15 - x[2]) * 5 + 'px)',
									'background-color': 'white',
									'border-radius': '3px',
								}} /> })()}
							</div>
						</>
					}
				)}
				
				{diff.value >= 15350 ? <>
					<div style={{
						position: 'absolute',
						width: '100%',
						height: '100%',
						top: 0,
						left: 0,
						'background-image': 'radial-gradient(circle, black ' + (100 - (diff.value - 15350) / (120000 - 15350) * 100) + '%, red 100%)',
						opacity: diff.value >= 160000 ? 0.25 - (diff.value - 160000) / 4000 : 0.25,
					}} />
				</> : <></>}
				
				<div style={{
					position: 'absolute',
					left: '50%',
					top: '70%',
					'font-size': '14px',
					'color': 'rgb(192, 0, 0)',
					transform: 'translate(-50%, -50%)',
				}}>
					{diff.value > 150000 && diff.value <= 152000 ? '警报：检测到强力压制' : ''}
					{diff.value > 152000 && diff.value <= 154000 ? '世界隧道出现异常！' : ''}
					{diff.value > 154000 && diff.value <= 156000 ? '附近时空结构开始塌陷' : ''}
					{diff.value > 156000 && diff.value <= 158000 ? '异常加深，请注意！' : ''}
					{diff.value > 158000 && diff.value <= 160000 ? '世界隧道部分区域崩溃，请注意避开' : ''}
				</div>
				
				<div style={{
					position: 'absolute',
					left: '50%',
					top: 'calc(70% + 24px)',
					'font-size': '14px',
					'color': 'gold',
					transform: 'translate(-50%, -50%)',
				}}>
					{diff.value > 75000 && diff.value <= 77000 ? '（收到VeryRDefie的专频信号）' : ''}
					{diff.value > 77000 && diff.value <= 79000 ? 'VeryRDefie: 你好！' : ''}
					{diff.value > 79000 && diff.value <= 81000 ? 'VeryRDefie: 现在你可能看不到我。' : ''}
					{diff.value > 81000 && diff.value <= 83000 ? 'VeryRDefie: 但是我与你一起进入了隧道。' : ''}
					{diff.value > 83000 && diff.value <= 85000 ? 'VeryRDefie: 刚刚暴君九头蛇对你发动了一次打击，不过偏了。' : ''}
					{diff.value > 85000 && diff.value <= 87000 ? 'VeryRDefie: 小心了！这里不再安全。一会在说吧。' : ''}
					{diff.value > 87000 && diff.value <= 180000 ? '（VeryRDefie频道静默）' : ''}
					{diff.value > 180000 && diff.value <= 182000 ? 'VeryRDefie：这里已经是世界之间的绝对深空了。' : ''}
					{diff.value > 182000 && diff.value <= 184000 ? 'VeryRDefie：在脱离了刚刚的打击之后，九头蛇一时半会也无法锁定你。' : ''}
					{diff.value > 184000 && diff.value <= 186000 ? 'VeryRDefie：但这只是暂时，接下来的下一次打击，恐怕……' : ''}
					{diff.value > 186000 && diff.value <= 188000 ? 'VeryRDefie：……' : ''}
					{diff.value > 188000 && diff.value <= Infinity ? '（VeryRDefie频道静默）' : ''}
				</div>
				
				{player.retribution >= 2 ? <><div style={{
					position: 'absolute',
					left: '50%',
					top: 'calc(70% + 48px)',
					'font-size': '14px',
					'color': 'red',
					transform: 'translate(-50%, -50%)',
				}}>
					{diff.value > 160000 && diff.value <= 162000 ? '（收到Alpha VII的专频信号）' : ''}
					{diff.value > 162000 && diff.value <= 164000 ? 'Alpha VII：你在吗？我检查到了危险。' : ''}
					{diff.value > 164000 && diff.value <= 166000 ? 'Alpha VII：没错，我也跟过来了。' : ''}
					{diff.value > 166000 && diff.value <= 168000 ? 'Alpha VII：你既然能打开基数通道，我们肯定不会放过机会。' : ''}
					{diff.value > 168000 && diff.value <= 170000 ? 'Alpha VII：这边我暂时屏蔽了这一次打击。' : ''}
					{diff.value > 170000 && diff.value <= 172000 ? 'Alpha VII：据我所知，世界隧道的长度可能容纳四次袭击……' : ''}
					{diff.value > 172000 && diff.value <= 174000 ? 'Alpha VII：行程已经过半。' : ''}
					{diff.value > 174000 && diff.value <= 176000 ? 'Alpha VII：后面的路途仍然充满危险。回见。' : ''}
					{diff.value > 176000 && diff.value <= 210000 ? '（Alpha VII频道静默）' : ''}
					{diff.value > 210000 && diff.value <= 212000 ? 'Alpha VII：我大致定位了下一次打击的位置……' : ''}
					{diff.value > 212000 && diff.value <= 214000 ? 'Alpha VII：……但这并不能帮助你躲过。' : ''}
					{diff.value > 214000 && diff.value <= 216000 ? 'Alpha VII：我发现大数世界已经在排斥我们的存在。' : ''}
					{diff.value > 216000 && diff.value <= 218000 ? 'Alpha VII：这意味着如果你被摧毁，通道和我们都会不复存在。' : ''}
					{diff.value > 218000 && diff.value <= 220000 ? 'Alpha VII：……' : ''}
					{diff.value > 220000 && diff.value <= Infinity ? '（Alpha VII频道静默）' : ''}
				</div></> : <></>}
				
				{player.retribution >= 3 ? <><div style={{
					position: 'absolute',
					left: '50%',
					top: 'calc(70% + 72px)',
					'font-size': '14px',
					'color': 'cyan',
					transform: 'translate(-50%, -50%)',
				}}>
					{diff.value > 340000 && diff.value <= 342000 ? '（收到Damofrost的专频信号）' : ''}
					{diff.value > 342000 && diff.value <= 344000 ? 'Damofrost：危。' : ''}
					{diff.value > 344000 && diff.value <= 346000 ? 'Damofrost：刚刚你又被锁定了一次。' : ''}
					{diff.value > 346000 && diff.value <= 348000 ? 'Damofrost：……我用自身能量屏蔽了它。' : ''}
					{diff.value > 348000 && diff.value <= 350000 ? 'Damofrost：基数世界就在前方。' : ''}
					{diff.value > 350000 && diff.value <= 352000 ? 'Damofrost：九头蛇不会容许你轻易过去。' : ''}
					{diff.value > 352000 && diff.value <= 354000 ? 'Damofrost：祂一定会在最后关头再次试图阻止你。' : ''}
					{diff.value > 354000 && diff.value <= 356000 ? 'Damofrost：一定注意。' : ''}
					{diff.value > 356000 && diff.value <= Infinity ? '（Damofrost频道静默）' : ''}
				</div></> : <></>}
				
				{player.thedoorofcardinalcrisis === 999 && <div style={{
					position: 'absolute',
					left: '50%',
					top: '50%',
					width: '200vw',
					height: '200vh',
					'font-size': '14px',
					background: '#ffffff',
					zIndex: 10000,
					boxShadow: 'white 0px 0px 500px 4px'
				}}
				class={"crisis"}>
				</div>
				}
				</> : <></>}
			</div>
        </> : <></>);
    },
})