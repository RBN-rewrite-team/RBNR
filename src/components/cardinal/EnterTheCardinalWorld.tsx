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
			const WIP_MS = 1 * 160000;
			
			let d = Date.now();
			if(!player.thedoorofcardinalstate) return 0;
			if(d - player.thedoorofcardinaltime >= WIP_MS) player.thedoorofcardinaltime = d - WIP_MS;
			return d - player.thedoorofcardinaltime;
		}
		const diff = useUpdate(differ);
		let point_list = [];
		for(let i = 0;i < 1000;i++)
		{
			point_list.push([i, Math.random() * 360, (Math.random() + 0.5) * 0.02, Math.random() * 600 + 100]);
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
									transform: 'translate(-50%, -50%) translateX(' + t + 'px)',
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
						display: diff.value <= 160000 ? 'block' : 'none',
						width: '100%',
						height: '100%',
						top: 0,
						left: 0,
						'background-image': 'radial-gradient(circle, black ' + (100 - (diff.value - 15350) / (120000 - 15350) * 100) + '%, red 100%)',
						opacity: 0.25,
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