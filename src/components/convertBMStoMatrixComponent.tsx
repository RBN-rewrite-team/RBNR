import { VueLatex } from "vatex";
import { defineComponent, type PropType } from "vue";

export function bmsToLatex(x: string) {
    /**
     * (a1,a2,a3)(b1,b2,b3)... \begin{pmatrix} a1& b1& ..
     */

    const matrix = x.split(")(").map((x)=>x.split(",").map(t=>parseInt(t.replace(/\D/g,''))));

    /**
     * \begin{pmatrix}
        1&  2& 3\\
        1&  2&3 \\
        1&  2&3
        \end{pmatrix}
     */

    const max_rows = Math.max(...matrix.map((x)=>x.length));

    let result = "";
    for (let j = 0; j<max_rows; j++){
        for (let i = 0; i<matrix.length; i++) {
            result+=(matrix[i][j] ?? "0").toString()
            if (i===matrix.length-1&&j!=max_rows-1) {
                result+="\\\\"
            } else if (i!==matrix.length-1){
                result+="&"
            }
        }
    }
    return `\\begin{pmatrix}${result}\\end{pmatrix}`
}

export default defineComponent({
    props: {
        matrix: {
            type: String as PropType<string>,
            required: true,
        }
    }, 
    setup(props) {
        return ()=>(<>
            <VueLatex expression={bmsToLatex(props.matrix)} />
        </>)
    }
})