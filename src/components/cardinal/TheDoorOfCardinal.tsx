import { player } from "@/core/global";
import { activateTheDoorOfCardinal } from "@/core/post-nonrec/cardinal/the-door-of-cardinal";
import { wordShift } from "@/core/word-shift";
import { useUpdate } from "@/lib/useUpdate";
import { defineComponent } from "vue";

export default defineComponent({
    name: "TheDoorOfCardinal",
    setup(props, ctx) {
        return () => <>
            <div class={"main"}>
                <h1 class="corrupted_text">基数层级的入口</h1>
                <button class="clickable_button corrupted_text" 
                onClick={() => activateTheDoorOfCardinal()}
                style="margin: auto; border-color: var(--background-color); background-image: linear-gradient(to bottom, #000 0%, #f00 10%, #000 20%, #0f0 30%, #000 40%, #00f 50%, #000 60%, #0ff 70%, #000 80%, #fff 90%, #000 100%)">献祭一切，强行到达基数层级...</button>
                <p>可能失败</p>
            </div>
        </>
    },
})