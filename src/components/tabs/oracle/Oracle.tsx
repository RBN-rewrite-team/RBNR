import Baixie from '@/components/group-2/Baixie.vue';
import { Oracle } from '@/core/pt/oracle/oracle.ts';
import { player } from '@/core/save/index.ts';
import { defineComponent } from 'vue';
import { format, formatWhole } from '@/utils/format.ts';
import { useUpdate } from '@/lib/useUpdate.ts';

export default defineComponent({
	name: 'Oracle',
	
	setup(props, ctx) {
		const progress = useUpdate(()=>Oracle.bitGainProgress());
		const s = useUpdate(() => {
			let r = [<></>, <></>, <></>, <></>, <></>];
			for(let i = 0;i < 5;i++)
			{
				let f = [<></>, <></>, <></>, <></>, <></>]
				for(let j = 0;j < 5;j++)
				{
					f[j] = <><td style="width: 100px"><div style={{width: '90px', height: '90px', border: '1px solid orange', 'background-color': 'rgb(63, 31, 0)', 'border-radius': '4px'}}></div></td></>
				}
				r[i] = <><tr style='height: 100px'>{f[0]}{f[1]}{f[2]}{f[3]}{f[4]}</tr></>;
			}
			let s = <><table><tbody>{r[0]}{r[1]}{r[2]}{r[3]}{r[4]}</tbody></table></>;
			return s;
		});
		return () => (
			<>
				<div style={{textAlign: "center", margin: "auto"}}>
					<br />
					<div style="width: calc(100% - 80px); height: 200px; padding: 5px; border: 1px solid red; color: red; margin: auto;">
						<h2>神谕进程</h2>
						<br />
						神谕比特
						<h3>
							{formatWhole(Oracle.nowBitsHave())}/
							{formatWhole(player.oracle.totalBits)}
						</h3>
						<div
							style="width: 100%; height: 40px; border: 1px solid orange; text-align: left"
						>
							<div
								style={{
									width: progress.value * 100 + '%',
									height: '100%',
									'background-color': 'red',
									'color': "var(--color)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>{(progress.value*100).toFixed(3)+"%"}</div>
						</div>
					</div>
					<br />
					<div style="width: calc(100% - 80px); height: 600px; padding: 5px; border: 1px solid rgb(127, 63, 0); color: rgb(127, 63, 0); margin: auto; overflow: auto">
						<h2>天命</h2>
						<br />
						使用神谕比特购买天命，相邻的同一命运会互相增强，相邻的不同命运会互相排斥。
						<br />
						<table style={{
    marginInlineStart: "0" ,
    marginInlineEnd: "0",
    margin: "auto"
                        }}><tbody><tr>
						<td><table>
							<tbody>
								<tr style='height: 100px'>
									<td><button style="width: 90px; height: 90px; border: 1px solid silver; background-color: var(--background-color); color: var(--color)">
										空之命({player.oracle.fateBought[0]})<br/>
										{formatWhole(Oracle.fateCost(0))}神谕比特
									</button></td>
								</tr>
								<tr style='height: 100px'>
									<td><button style="width: 90px; height: 90px; border: 1px solid lightgreen; background-color: var(--background-color); color: var(--color)">
										时之命({player.oracle.fateBought[1]})<br/>
										{formatWhole(Oracle.fateCost(1))}神谕比特
									</button></td>
								</tr>
								<tr style='height: 100px'>
									<td><button style="width: 90px; height: 90px; border: 1px solid cyan; background-color: var(--background-color); color: var(--color)">
										生之命({player.oracle.fateBought[2]})<br/>
										{formatWhole(Oracle.fateCost(2))}神谕比特
									</button></td>
								</tr>
								<tr style='height: 100px'>
									<td><button style="width: 90px; height: 90px; border: 1px solid red; background-color: var(--background-color); color: var(--color)">
										死之命({player.oracle.fateBought[3]})<br/>
										{formatWhole(Oracle.fateCost(3))}神谕比特
									</button></td>
								</tr>
								<tr style='height: 100px'>
									<td><button style="width: 90px; height: 90px; border: 1px solid blue; background-color: var(--background-color); color: var(--color)">
										理之命({player.oracle.fateBought[4]})<br/>
										{formatWhole(Oracle.fateCost(4))}神谕比特
									</button></td>
								</tr>
							</tbody>
						</table></td>
						<td>{s.value}</td></tr></tbody></table>
					</div>
				</div>
			</>
		);
	},
});
