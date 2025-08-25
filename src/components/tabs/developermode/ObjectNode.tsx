import { format } from "@/utils/format";
import ModalService from "@/utils/Modal";
import Decimal from "break_eternity.js";
import { defineComponent, type PropType } from "vue";
function setVal(obj: any, key: any){
    ModalService.show({
        title: "设置此项目的值",
        content: "设置此项目的值",
        fields: [
            {
                type: "input",
                placeholder: "值"
            }
        ],
        onConfirm(values) {
            if (obj[key] instanceof Decimal){
                let a = new Decimal(values[0]);
                if (a.isNan()) return ;
                obj[key] = a;
            } else if (typeof obj[key] == "number") {
                let a = Number(values[0]);
                if (isNaN(a)) return ;
                obj[key] = a;
            } else if (typeof obj[key] == "boolean") {
                let a = Boolean(values[0]);
                obj[key] = a;
            }
        },
    })
}
function objectNode(obj: any, objlayers=0) {
    return <div style="width: 90%; font-size: 12px; border: 2px solid var(--suptitle-color); padding: 10px; position: relative; left: 5%">{(function (){
        if (typeof obj == "number") {
            return <span>Number: {obj}</span>
        }else if (typeof obj == "string") {
            return <span>String: {obj}</span>
        }else if (typeof obj == "boolean") {
            return <span>Boolean: {obj ? "true" : "false"}</span>
        }
        else if (typeof obj == "object") {
            if (obj instanceof Decimal) {
                return <span>DEC{format(obj)}</span>
            }
            return Object.entries(obj).map(([k, v]) => {
                return <div>{".".repeat(objlayers)}{k}: {objectNode(v, objlayers+1)}<br /><button style="position: absolute; right: 0%; transform: translate(-50px, -50px)" onClick={()=>setVal(obj,k)}>Set value</button></div>
            })
        } else {
            return <span>Unknown</span>
        }
    })()}</div>
}
export default defineComponent({
    name: "ObjectNode",
    props: ["goal"],
    setup(props) {
        return ()=>(<>
            {objectNode(props.goal)}
        </>)
    }
})