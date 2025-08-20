import { defineComponent, type PropType } from "vue";
import type { readSaveDetail } from ".";

export default defineComponent({
    name: "DetailsToHTML",
    props: {
        det: {
            type: Object as PropType<NonNullable<ReturnType<typeof readSaveDetail>>>

        }
    },
    setup(props){
        // {props.det?.isOrdinal}
        return ()=>(<><div style={{
            border: "1px solid red",
        }}>
            版本: {props.det?.version}<br />
            章节：{props.det?.chapter}<br />
            资源：<div innerHTML={props.det?.number} style={{
                display: "inline"
            }} /><br />
            <br />
            上次保存：{props.det?.lastSave}<br />
        </div></>)
    }
})