import { defineComponent } from 'vue';
import convertTextToComponent from './text-to-component-convert';
import { player } from '@/core/save';

import gamecontent1 from './contents2/gamecontent-1.txt?raw';
import gamecontent1e from './contents2/gamecontent-1-en.txt?raw';
import gamecontent2 from './contents2/gamecontent-2.txt?raw';
import gamecontent2e from './contents2/gamecontent-2-en.txt?raw';
import { i18n } from '@/utils/i18n';
// prettier-ignore
export const HELP_CONTENT = [
    {
        page: 1,
        get content() {
            return i18n.global.locale.value == 'zh-CN' ? gamecontent1 : gamecontent1e
        },
        unlocked() {return true},
    },
    {
        page: 2,
        get content() {
            return i18n.global.locale.value == 'zh-CN' ? gamecontent2 : gamecontent2e
        },
        unlocked() {return true},
    },
    // {
    //     page: 2,
    //     content: ordinal2,
    //     unlocked() {return true},
    // },
    // {
    //     page: 3,
    //     content: ordinal3,
    //     unlocked() {
    //         return player.upgrades[58];
    //     },
    // },
    // {
    //     page: 4,
    //     content: ordinal4,
    //     unlocked() {
    //         return player.upgrades[58];
    //     },
    // },
    // {
    //     page: 5,
    //     content: ordinal5,
    //     unlocked() {
    //         return player.upgrades[58];
    //     },
    // },
    // {
    //     page: 6,
    //     content: ordinal6,
    //     unlocked() {
    //         return player.upgrades[58];
    //     },
    // },
    // {
    //     page: 7,
    //     content: ordinal7,
    //     unlocked() {
    //         return player.upgrades[58];
    //     },
    // },
    // {
    //     page: 8,
    //     content: ordinal8,
    //     unlocked() {
    //         return player.upgrades[58];
    //     },
    // },
    // {
    //     page: 9,
    //     content: ordinal9,
    //     unlocked() {
    //         return player.upgrades[58];
    //     },
    // },
    // {
    //     page: 10,
    //     content: ordinal10,
    //     unlocked() {
    //         return player.upgrades[58];
    //     },
    // },
    // {
    //     page: 101,
    //     content: ordinal101,
    //     unlocked() {
    //         return true;
    //     },
    // },
    // {
    //     page: 102,
    //     content: ordinal102,
    //     unlocked() {
    //         return true;
    //     },
    // },
    // {
    //     page: 103,
    //     content: ordinal103,
    //     unlocked() {
    //         return true;
    //     },
    // },
    // {
    //     page: 104,
    //     content: ordinal104,
    //     unlocked() {
    //         return true;
    //     },
    // },
    // {
    //     page: 105,
    //     content: ordinal105,
    //     unlocked() {
    //         return true;
    //     },
    // },
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
