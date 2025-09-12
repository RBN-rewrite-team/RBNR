import { defineComponent } from "vue";
import { player } from ".";

export default defineComponent({
    name:"FontUI",
    setup() {
        return ()=>(<>
            <div>
                <p style={{"color": "var(--color)"}}>输入设置字体：</p>
                <input value={player.options.ui.user_font} onChange={$event => player.options.ui.user_font=($event.target as HTMLInputElement).value} class="modal-input" />
            </div>
        </>)
    }
});