import { defineComponent } from 'vue';
import convertTextToComponent from './text-to-component-convert';
import { player } from '@/core/save';
import ordinal1 from './contents/ordinal-1.txt?raw';
import ordinal2 from './contents/ordinal-2.txt?raw';
import ordinal3 from './contents/fgh-1.txt?raw';
import ordinal4 from './contents/ordinal-4.txt?raw';
// prettier-ignore
export const HELP_CONTENT = [
    {
        page: 1,
        content: ordinal1,
        unlocked() {return true},
    },
    {
        page: 2,
        content: ordinal2,
        unlocked() {return true},
    },
    {
        page: 3,
        content: ordinal3,
        unlocked() {
            return player.upgrades[58];
        },
    },
    {
        page: 4,
        content: ordinal4,
        unlocked() {
            return player.upgrades[58];
        },
    }
] as const satisfies {page: number; content: string; unlocked: ()=>boolean}[]
export default defineComponent({
	setup() {
		return function () {
			const a = () => {
				const currentHelpContentIndex = HELP_CONTENT.findIndex(
					(x) => x.page == player.help.page,
				);
				if (currentHelpContentIndex == -1) return '';

				const currentHelpContent = HELP_CONTENT[currentHelpContentIndex];
				const isUnlocked = currentHelpContent.unlocked
					? currentHelpContent.unlocked()
					: true;
				if (isUnlocked) return convertTextToComponent(currentHelpContent.content);
				return '';
			};
			return (
				<>
					{a()}
					{/* <div v-else-if="player.help.page >= 4321">已达到当前版本残局：4321页。</div>
                <div v-else-if="player.help.page >= 3200">你的向后翻页按钮又一次被加强了!</div>
                <div v-else-if="player.help.page >= 2125">
                    你的页面数达到了一个不可思议的水平！作为奖励，向后翻页按钮变得更强......
                </div>
                <div v-else-if="player.help.page >= 1000">
                    你翻了太多页面了......向后翻页按钮变得不稳定......
                </div> */}
				</>
			);
		};
	},
});
