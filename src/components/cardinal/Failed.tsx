import { player } from "@/core/global";
import { defineComponent, ref } from "vue";
import './cardinal.css';

export default defineComponent({
    name: "Failed",
    setup(props, ctx) {
        const counter = ref(0);
		const nextCanTouch = ref(Date.now());
        
        return () => <>
        <div
				style={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					top: 0,
					left: 0,
					'z-index': 10,
					'background-color': 'white',
					opacity: 1,
				}} onClick={()=>{
					if(Date.now() >= nextCanTouch.value)
					{
						counter.value++;
						nextCanTouch.value = Date.now() + 2000;
					}
				}} 
				>
				<div style={{
					position: 'absolute',
					left: '50%',
					top: '50%',
					'font-size': '19px',
					'color': 'rgb(0, 0, 0)',
					transform: 'translate(-50%, -50%)',
				//@ts-ignore
				}} align="center">
					{counter.value >= 0 && <><span class="failedText">可怕的袭击中断了你的去路</span></>}
					{counter.value >= 1 && <><span class="failedText"><br/>世界隧道在你的面前断裂</span></>}
					{counter.value >= 2 && <><span class="failedText"><br/>在最后的瞬间，你感觉到了某个飞过的实体</span></>}
					{counter.value >= 3 && <><span class="failedText"><br/>它似乎没有察觉你的存在，转眼便划过天际</span></>}
					{counter.value >= 4 && <><span class="failedText"><br/>你的一切在白光中被抹除</span></>}
                    {counter.value >= 5 && (player.meetcrisisbefore = false)}
				</div>
					
				</div>
                </>
    },
})