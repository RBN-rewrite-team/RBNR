import { defineComponent } from "vue";
import convertTextToComponent from "./text-to-component-convert";
import { player } from "@/core/save";
import ordinal1 from './contents/ordinal-1.txt?raw';
import ordinal2 from './contents/ordinal-2.txt?raw';
import ordinal3 from './contents/fgh-1.txt?raw';
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
    }
] as const satisfies {page: number; content: string; unlocked: ()=>boolean}[] 
export default defineComponent({
    setup() {
        return () => {
            const currentHelpContentIndex = HELP_CONTENT.findIndex((x)=>x.page==player.help.page)
            if (currentHelpContentIndex==-1) return "";

            const currentHelpContent = HELP_CONTENT[currentHelpContentIndex];
            const isUnlocked = currentHelpContent.unlocked 
                ? currentHelpContent.unlocked()
                : true;
            if (isUnlocked)
                return convertTextToComponent(currentHelpContent.content);
            return ""
        }
    }
})