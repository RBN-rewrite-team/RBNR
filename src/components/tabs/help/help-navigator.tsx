import { player } from "@/core/save";
import { isDeveloper } from "@/core/save/testing";
import { formatWhole } from "@/utils/format";
import { defineComponent } from "vue";
import { lastPage, nextPage } from "./page-controller";
import { gotoShortCut, SHORTCUTS } from "./shortcuts";



export default defineComponent({
    setup() {
        return ()=> (<>
        <div style="display: flex; justify-content: center; align-items: center; margin-top: 5px">
			<button
				class="clickable_button"
				onClick={lastPage}
			>
				-
			</button>
			第 { formatWhole(player.help.page) } 页
			<button class="clickable_button" onClick={nextPage}>+</button>
			<br />
            {Object.entries(SHORTCUTS).map((x)=>(
                <button class="clickable_button" onClick={()=>gotoShortCut(x[0])}>{x[1].text}</button>
            ))}
		</div>
        </>)
    }
})