import { defineComponent } from "vue";

export default defineComponent({
    name: "CardinalWorld", 
    setup(props, ctx) {
        return () => <>
            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    'background-color': 'black',
                    fontSize: "28px"
                }}
            > 
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: 'calc(50% - 20px)',

                        transform: 'translate(-50%, -50%)',
                    }}
                >Cardinal</div>
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: 'calc(50% + 20px)',

                        transform: 'translate(-50%, -50%)',
                    }}
                >ℵ<sub>0</sub></div>
            </div>
            
       </>
    },
})