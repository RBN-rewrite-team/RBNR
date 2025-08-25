import { format } from "@/utils/format";
import ModalService from "@/utils/Modal";
import Decimal from "break_eternity.js";
import { defineComponent, ref, type PropType } from "vue";

function setVal(obj: any, key: any) {
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
      if (obj[key] instanceof Decimal) {
        let a = new Decimal(values[0]);
        if (a.isNan()) return;
        obj[key] = a;
      } else if (typeof obj[key] == "number") {
        let a = Number(values[0]);
        if (isNaN(a)) return;
        obj[key] = a;
      } else if (typeof obj[key] == "boolean") {
        let a = Boolean(values[0]);
        obj[key] = a;
      }
    },
  });
}

const TreeNode = defineComponent({
  name: "TreeNode",
  props: {
    value: {
      type: [Object, Array, String, Number, Boolean, Decimal] as PropType<any>,
      required: true
    },
    keyName: {
      type: String,
      default: ""
    },
    depth: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const isExpanded = ref(props.depth < 2); // 默认展开前两层
    
    const toggle = () => {
      isExpanded.value = !isExpanded.value;
    };
    
    return {
      isExpanded,
      toggle
    };
  },
  render() {
    const { value, keyName, depth } = this;
    const isObject = typeof value === "object" && value !== null && !(value instanceof Decimal);
    const isArray = Array.isArray(value);
    const hasChildren = isObject && Object.keys(value).length > 0;
    
    const paddingLeft = `${depth * 16}px`;
    
    return (
      <div class="tree-node">
        <div class="tree-node-header" style={{ paddingLeft }}>
          {hasChildren && (
            <span 
              class="toggle-icon"
              onClick={this.toggle}
            >
              {this.isExpanded ? '▼' : '►'}
            </span>
          )}
          {!hasChildren && <span class="toggle-spacer"></span>}
          {keyName && <span class="key-name">{keyName}: </span>}
          {!isObject && (
            <span class="value-display">
              {value instanceof Decimal ? `Decimal { ${format(value)} }` : 
               typeof value === "boolean" ? (value ? "true" : "false") : 
               value}
            </span>
          )}
          {isObject && !this.isExpanded && (
            <span class="value-preview">
              {isArray ? `Array[${Object.keys(value).length}]` : `Object{${Object.keys(value).length}}`}
            </span>
          )}
          <button 
            class="set-value-btn"
            onClick={() => setVal(this.$parent, keyName)}
          >
            设置
          </button>
        </div>
        
        {isObject && this.isExpanded && (
          <div class="tree-node-children">
            {Object.entries(value).map(([key, val]) => (
              <TreeNode 
                value={val} 
                keyName={key} 
                depth={depth + 1}
                key={key}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
});

export default defineComponent({
  name: "ObjectNode",
  props: {
    goal: {
      type: [Object, Array, String, Number, Boolean, Decimal] as PropType<any>,
      required: true
    }
  },
  setup(props) {
    return () => (
      <div class="object-node-container">
        <TreeNode value={props.goal} depth={0} />
      </div>
    );
  }
});