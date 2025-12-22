import { player } from "@/core/global";
import { defineComponent, ref } from "vue";

export default defineComponent({
    name: "Failed",
    setup(props, ctx) {
        const counter = ref(0);
        
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
				}}
				>
				<div style={{
					position: 'absolute',
					left: '50%',
					top: '50%',
					'font-size': '14px',
					'color': 'rgb(0, 0, 0)',
					transform: 'translate(-50%, -50%)',
				}} onClick={()=>counter.value++}>
					{counter.value == 0 && "可怕的袭击中断了你的去路"}
					{counter.value == 1 && "世界隧道在你的面前断裂"}
					{counter.value == 2 && "在最后的瞬间，你的眼神捕捉到了某个飞过的实体"}
					{counter.value == 3 && "它似乎没有察觉你的存在，转眼便划过天际"}
					{counter.value == 4 && "你的一切在白光中被抹除"}
                    {counter.value == 5 && (player.meetcrisisbefore = false)}
				</div>
					
				</div>
                </>
    },
})