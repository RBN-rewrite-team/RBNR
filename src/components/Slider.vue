<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted, onBeforeUnmount, nextTick, type PropType } from 'vue';
import PlusMinusButton from "@/components/PlusMinusButton.vue";

// 代码修改自https://github.com/NightCatSama/vue-slider-component
/*
The MIT License (MIT)

Copyright (c) 2016 NightCatSama.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

interface ProcessSign {
  pos: number[];
  start: number;
}

interface PiecewiseObj {
  style: Record<string, any>;
  index: number;
  label: any;
}

const roundToDPR = (function () {
  const r = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  return (value: number) => Math.round(value * r) / r;
})();

export default defineComponent({
  name: "Slider",
  components: {
    PlusMinusButton
  },
  props: {
    width: {
      type: String,
      default: 'auto'
    },
    height: {
      type: String,
      default: "6px"
    },
    data: {
      type: Array as PropType<any[]>,
      default: null
    },
    dotSize: {
      type: [String, Number],
      default: "16px"
    },
    dotWidth: {
      type: String,
      required: false
    },
    dotHeight: {
      type: String,
      required: false
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    interval: {
      type: Number,
      default: 1
    },
    show: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: [Boolean, Array] as PropType<boolean | boolean[]>,
      default: false
    },
    piecewise: {
      type: Boolean,
      default: false
    },
    tooltip: {
      type: [String, Boolean] as PropType<string | boolean>,
      default: 'always'
    },
    eventType: {
      type: String,
      default: 'auto'
    },
    direction: {
      type: String,
      default: 'horizontal'
    },
    reverse: {
      type: Boolean,
      default: false
    },
    lazy: {
      type: Boolean,
      default: false
    },
    clickable: {
      type: Boolean,
      default: true
    },
    speed: {
      type: Number,
      default: 0.5
    },
    realTime: {
      type: Boolean,
      default: false
    },
    stopPropagation: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Array, Object] as PropType<any>,
      default: 0
    },
    piecewiseLabel: {
      type: Boolean,
      default: false
    },
    debug: {
      type: Boolean,
      default: true
    },
    fixed: {
      type: Boolean,
      default: false
    },
    minRange: {
      type: Number
    },
    maxRange: {
      type: Number
    },
    processDraggable: {
      type: Boolean,
      default: false
    },
    useKeyboard: {
      type: Boolean,
      default: false
    },
    actionsKeyboard: {
      type: Array as () => PropType<((i: number) => number)[]>,
      default() {
        return [(i: number) => i - 1, (i: number) => i + 1];
      }
    },
    piecewiseFilter: {
      type: Function as PropType<(data: { index: number; label: any }) => boolean>
    },
    tooltipMerge: {
      type: Boolean,
      default: true
    },
    startAnimation: {
      type: Boolean,
      default: false
    },
    enableCross: {
      type: Boolean,
      default: true
    },
    valueInDot: {
      type: Boolean,
      default: false
    },
    plusMinusButtons: {
      type: Boolean,
      default: false,
    },
    sliderStyle: {
      type: [Array, Object, Function] as PropType<any>,
    },
    focusStyle: {
      type: [Array, Object, Function] as PropType<any>,
    },
    tooltipDir: {
      type: [Array, String] as PropType<string[] | string>,
    },
    xformatter: {
      type: [String, Function] as PropType<string | ((val: any) => string)>,
    },
    mergeFormatter: {
      type: [String, Function] as PropType<string | ((val1: any, val2: any) => string)>,
    },
    piecewiseStyle: Object,
    disabledStyle: Object,
    piecewiseActiveStyle: Object,
    processStyle: Object,
    processClass: String,
    bgStyle: Object,
    bgClass: String,
    tooltipStyle: {
      type: [Array, Object, Function] as PropType<any>,
    },
    disabledDotStyle: {
      type: [Array, Object, Function] as PropType<any>,
    },
    labelStyle: Object,
    labelActiveStyle: Object,
    dotClass: {
      type: [String, Array] as PropType<string | string[]>,
    },
  },
  emits: ['input', 'callback', 'on-keypress', 'drag-start', 'drag-end'],
  setup(props, { emit }) {
    // Reactive state
    const flag = ref(false);
    const dragFlag = ref(false);
    const crossFlag = ref(false);
    const keydownFlag = ref<number | null>(null);
    const focusFlag = ref(false);
    const processFlag = ref(false);
    const processSign = ref<ProcessSign | null>(null);
    const size = ref(0);
    const fixedValue = ref(0);
    const focusSlider = ref(0);
    const currentValue = ref<any>(props.value);
    const currentSlider = ref(0);
    const isComponentExists = ref(true);
    const isMounted = ref(false);
    const dotAxialSizePx = ref(1);

    // DOM refs
    const elem = ref<HTMLElement | null>(null);
    const dot0 = ref<HTMLElement | null>(null);
    const dot1 = ref<HTMLElement | null>(null);
    const process = ref<HTMLElement | null>(null);
    const tooltip0 = ref<HTMLElement | null>(null);
    const tooltip1 = ref<HTMLElement | null>(null);
    const wrap = ref<HTMLElement | null>(null);

    // Computed properties
    const tooltipFormatHelper = computed(() => {
      if (props.mergeFormatter) {
        if (typeof props.mergeFormatter === 'function') {
          return props.mergeFormatter(val.value[0], val.value[1]);
        }
        return (props.mergeFormatter as string)
          .replace(/\{value1\}/g, val.value[0])
          .replace(/\{value2\}/g, val.value[1]);
      }
      if (props.xformatter) {
        if (val.value[0] === val.value[1]) return formatting(val.value[0]);
        return formatting(val.value[0]) + "-" + formatting(val.value[1]);
      }
      if (val.value[0] === val.value[1]) return val.value[0];
      return val.value[0] + "-" + val.value[1];
    });

    const dotWidthVal = computed(() => props.dotWidth || props.dotSize);
    const dotHeightVal = computed(() => props.dotHeight || props.dotSize);

    const flowDirection = computed(() => 
      `l-slider--${props.direction + (props.reverse ? '-reverse' : '')}`
    );

    const tooltipMergedPosition = computed(() => {
      if (!isMounted.value) return {};
      const tooltipDirectionComputed = tooltipDirection.value[0];
      if (dot0.value) {
        const style: Record<string, string> = {};
        style[tooltipDirectionComputed] = `-${(dotAxialSizePx.value / 2) - (size.value / 2) + 9}px`;
        style['left'] = `50%`;
        return style;
      }
      return {};
    });

    const tooltipDirection = computed(() => {
      const dir = props.tooltipDir || (props.direction === 'vertical' ? 'left' : 'top');
      if (Array.isArray(dir)) {
        return isRange.value ? dir : dir[1];
      } else {
        return isRange.value ? [dir, dir] : dir;
      }
    });

    const tooltipStatus = computed(() => 
      props.tooltip === 'hover' && flag.value ? 'ad-slider-always' : 
      props.tooltip ? `ad-slider-${props.tooltip}` : ''
    );

    const tooltipClass = computed(() => [
      `ad-slider-tooltip-${tooltipDirection.value}`,
      'ad-slider-tooltip'
    ]);

    const disabledArray = computed(() => 
      Array.isArray(props.disabled) ? props.disabled : [props.disabled, props.disabled]
    );

    const boolDisabled = computed(() => 
      disabledArray.value.every(b => b === true)
    );

    const isDisabled = computed(() => 
      props.eventType === 'none' ? true : boolDisabled.value
    );

    const disabledClass = computed(() => 
      boolDisabled.value ? 'l-slider--disabled' : ''
    );

    const stateClass = computed(() => ({
      'ad-slider-state-process-drag': processFlag.value,
      'ad-slider-state-drag': flag.value && !processFlag.value && !keydownFlag.value,
      'ad-slider-state-focus': focusFlag.value
    }));

    const isRange = computed(() => 
      Array.isArray(props.value)
    );

    const slider = computed(() => 
      isRange.value ? [dot0.value, dot1.value] : [dot0.value]
    );

    const minimum = computed(() => 
      props.data ? 0 : props.min
    );

    const val = computed({
      get() {
        return props.data ? 
          (isRange.value ? 
            [props.data[currentValue.value[0]], props.data[currentValue.value[1]]] : 
            props.data[currentValue.value]) : 
          currentValue.value;
      },
      set(val: any) {
        if (props.data) {
          if (isRange.value) {
            const index0 = props.data.indexOf(val[0]);
            const index1 = props.data.indexOf(val[1]);
            if (index0 > -1 && index1 > -1) {
              currentValue.value = [index0, index1];
            }
          } else {
            const index = props.data.indexOf(val);
            if (index > -1) {
              currentValue.value = index;
            }
          }
        } else {
          currentValue.value = val;
        }
      }
    });

    const currentIndex = computed(() => {
      if (isRange.value) {
        return props.data ? 
          currentValue.value : 
          [getIndexByValue(currentValue.value[0]), getIndexByValue(currentValue.value[1])];
      } else {
        return getIndexByValue(currentValue.value);
      }
    });

    const indexRange = computed(() => {
      if (isRange.value) {
        return currentIndex.value;
      } else {
        return [0, currentIndex.value];
      }
    });

    const maximum = computed(() => 
      props.data ? (props.data.length - 1) : props.max
    );

    const multiple = computed(() => {
      const decimals = `${props.interval}`.split('.')[1];
      return decimals ? Math.pow(10, decimals.length) : 1;
    });

    const spacing = computed(() => 
      props.data ? 1 : props.interval
    );

    const total = computed(() => {
      if (props.data) {
        return props.data.length - 1;
      } else if (Math.floor((maximum.value - minimum.value) * multiple.value) % (props.interval * multiple.value) !== 0) {
        printError('Prop[interval] is illegal, Please make sure that the interval can be divisible');
      }
      return (maximum.value - minimum.value) / props.interval;
    });

    const usableSize = computed(() => 
      size.value - dotAxialSizePx.value
    );

    const gap = computed(() => 
      usableSize.value / total.value
    );

    const position = computed((): [number,number]|number => {
      if (isRange.value) {
        return [
          (currentValue.value[0] - minimum.value) / spacing.value * gap.value + dotAxialSizePx.value / 2,
          (currentValue.value[1] - minimum.value) / spacing.value * gap.value + dotAxialSizePx.value / 2
        ];
      } else {
        return ((currentValue.value - minimum.value) / spacing.value * gap.value + dotAxialSizePx.value / 2);
      }
    });

    const isFixed = computed(() => 
      props.fixed || props.minRange
    );

    const limit = computed(() => {
      if (isRange.value) {
        if (isFixed.value) {
          return [
            [dotAxialSizePx.value / 2, dotAxialSizePx.value / 2 + (total.value - fixedValue.value) * gap.value],
            [fixedValue.value * gap.value + dotAxialSizePx.value / 2, size.value - dotAxialSizePx.value / 2]
          ];
        } else {
          return [
            [dotAxialSizePx.value / 2, (position.value as [number, number])[1]],
            [(position.value as [number, number])[0], size.value - dotAxialSizePx.value / 2]
          ];
        }
      } else {
        return [dotAxialSizePx.value / 2, size.value - dotAxialSizePx.value / 2];
      }
    });

    const valueLimit = computed(() => {
      return isRange.value ? 
        isFixed.value ? 
          [
            [minimum.value, maximum.value - (fixedValue.value * (spacing.value * multiple.value)) / multiple.value],
            [minimum.value + (fixedValue.value * (spacing.value * multiple.value)) / multiple.value, maximum.value]
          ] : 
          [
            [minimum.value, currentValue.value[1]],
            [currentValue.value[0], maximum.value]
          ] : 
        [minimum.value, maximum.value];
    });

    const idleSlider = computed(() => 
      currentSlider.value === 0 ? 1 : 0
    );

    const wrapStyles = computed(() => {
      type StyleObject = {
        height?: string
        width?: string
        marginTop?: string
        marginLeft?: string
        marginRight?: string
        marginBottom?: string
      }
    
      const styles: StyleObject = props.direction === 'vertical' 
        ? { height: props.height }
        : { width: props.width }
    
      if (props.plusMinusButtons) {
        if (props.direction === "vertical") {
          styles.marginTop = "0.5rem"
          styles.marginBottom = "0.5rem"
        } else {
          styles.marginRight = "0.5rem"
          styles.marginLeft = "0.5rem"
        }
      }
    
      return styles
    })

    const sliderStyles = computed(() => {
      if (Array.isArray(props.sliderStyle)) {
        return isRange.value ? props.sliderStyle : props.sliderStyle[1];
      } else if (typeof props.sliderStyle === 'function') {
        return props.sliderStyle(val.value, currentIndex.value);
      } else {
        return isRange.value ? [props.sliderStyle, props.sliderStyle] : props.sliderStyle;
      }
    });

    const focusStyles = computed(() => {
      if (Array.isArray(props.focusStyle)) {
        return isRange.value ? props.focusStyle : props.focusStyle[1];
      } else if (typeof props.focusStyle === 'function') {
        return props.focusStyle(val.value, currentIndex.value);
      } else {
        return isRange.value ? [props.focusStyle, props.focusStyle] : props.focusStyle;
      }
    });

    const disabledDotStyles = computed(() => {
      const disabledStyle = props.disabledDotStyle;
      if (Array.isArray(disabledStyle)) {
        return disabledStyle;
      } else if (typeof disabledStyle === 'function') {
        const style = disabledStyle(val.value, currentIndex.value);
        return Array.isArray(style) ? style : [style, style];
      } else if (disabledStyle) {
        return [disabledStyle, disabledStyle];
      } else {
        return [
          { backgroundColor: '#ccc' },
          { backgroundColor: '#ccc' }
        ];
      }
    });

    const tooltipStyles = computed(() => {
      if (Array.isArray(props.tooltipStyle)) {
        return isRange.value ? props.tooltipStyle : props.tooltipStyle[1];
      } else if (typeof props.tooltipStyle === 'function') {
        return props.tooltipStyle(val.value, currentIndex.value);
      } else {
        return isRange.value ? [props.tooltipStyle, props.tooltipStyle] : props.tooltipStyle;
      }
    });

    const elemStyles = computed(() => 
      props.direction === 'vertical' ? {
        width: props.width,
        height: '100%',
        position: "relative"
      } : {
        height: props.height,
        position: "relative"
      }
    );

    const draggableStyle = computed(() => ({
      cursor: boolDisabled.value ? "default" : "pointer"
    }));

    const dotStyles = computed(() => {
      type dotStylesType = {
        width: number
        height: number
        position: "absolute"
        left: string
        top: string
      }
      let ret: dotStylesType = ({
        width: dotWidthVal.value,
        height: dotHeightVal.value,
        position: "absolute",
      }) as dotStylesType;
      if (props.direction === "vertical") {
        ret.left = "50%";
      } else {
        ret.top = "50%";
      }
      return ret;
    });

    const piecewiseDotStyle = computed(() => ({
      width: props.width,
      height: props.height,
    }));

    const piecewiseDotWrap = computed(() => {
      if (!props.piecewise && !props.piecewiseLabel) {
        return false;
      }
      let arr: PiecewiseObj[] = [];
      for (let i = 0; i <= total.value; i++) {
        const style = props.direction === 'vertical' ? {
          bottom: `${gap.value * i - usableSize.value / 2}px`,
          left: 0
        } : {
          left: `${gap.value * i - usableSize.value / 2}px`,
          top: 0
        };
        const index = props.reverse ? (total.value - i) : i;
        const label = props.data ? props.data[index] : (spacing.value * index) + props.min;
        if (props.piecewiseFilter && !props.piecewiseFilter({ index, label })) {
          continue;
        }
        arr.push({
          style,
          index,
          label: props.xformatter ? formatting(label) : label
        });
      }
      return arr;
    });

    // Methods
    const bindEvents = () => {
      document.addEventListener('touchmove', moving, { passive: false });
      document.addEventListener('touchend', moveEnd, { passive: false });
      document.addEventListener('mousedown', blurSlider);
      document.addEventListener('mousemove', moving);
      document.addEventListener('mouseup', moveEnd);
      document.addEventListener('mouseleave', moveEnd);
      document.addEventListener('keydown', handleKeydown);
      document.addEventListener('keyup', handleKeyup);
      window.addEventListener('resize', refresh);
      if (isRange.value && props.tooltipMerge) {
        dot0.value?.addEventListener('transitionend', handleOverlapTooltip);
        dot1.value?.addEventListener('transitionend', handleOverlapTooltip);
      }
    };

    const unbindEvents = () => {
      document.removeEventListener('touchmove', moving);
      document.removeEventListener('touchend', moveEnd);
      document.removeEventListener('mousedown', blurSlider);
      document.removeEventListener('mousemove', moving);
      document.removeEventListener('mouseup', moveEnd);
      document.removeEventListener('mouseleave', moveEnd);
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('keyup', handleKeyup);
      window.removeEventListener('resize', refresh);
      if (isRange.value && props.tooltipMerge) {
        dot0.value?.removeEventListener('transitionend', handleOverlapTooltip);
        dot1.value?.removeEventListener('transitionend', handleOverlapTooltip);
      }
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (!props.useKeyboard || !focusFlag.value) {
        return false;
      }
      switch (e.keyCode) {
        case 37: // Left
        case 40: // Down
          e.preventDefault();
          keydownFlag.value = true;
          flag.value = true;
          changeFocusSlider(props.actionsKeyboard[0]);
          break;
        case 38: // Up
        case 39: // Right
          e.preventDefault();
          keydownFlag.value = true;
          flag.value = true;
          changeFocusSlider(props.actionsKeyboard[1]);
          break;
      }
    };

    const handleKeyup = () => {
      if (keydownFlag.value) {
        keydownFlag.value = false;
        flag.value = false;
      }
    };

    const changeFocusSlider = (fn: (i: number) => number) => {
      if (isRange.value) {
        let arr = currentIndex.value.map((index: number, i: number) => {
          if (i === focusSlider.value || props.fixed) {
            const val = fn(index);
            const range = props.fixed ? valueLimit.value[i] : [0, total.value];
            if (val <= range[1] && val >= range[0]) {
              return val;
            }
          }
          return index;
        });
        if (arr[0] > arr[1]) {
          focusSlider.value = focusSlider.value === 0 ? 1 : 0;
          arr = arr.reverse();
        }
        setIndex(arr);
      } else {
        setIndex(fn(currentIndex.value as number));
      }
    };

    const blurSlider = (e: MouseEvent) => {
      const dot = isRange.value ? (focusSlider.value === 0 ? dot0.value : dot1.value) : dot0.value;
      if (!dot || dot === e.target || (dot as HTMLElement).contains(e.target as Node)) {
        return false;
      }
      focusFlag.value = false;
    };

    const formatting = (value: any) => {
      if (typeof props.xformatter === 'function') {
        return props.xformatter(value);
      } else if (typeof props.xformatter === 'string') {
        return props.xformatter.replace(/\{value\}/, value);
      }
      return value;
    };

    const getPos = (e: MouseEvent | Touch) => {
      props.realTime && getStaticData();
      const rect = elem.value?.getBoundingClientRect();
      if (!rect) return 0;
      return props.direction === 'vertical' ? 
        (props.reverse ? (e.clientY - rect.top) : (size.value - (e.clientY - rect.top))) : 
        (props.reverse ? (size.value - (e.clientX - rect.left)) : (e.clientX - rect.left));
    };

    const processClick = (e: MouseEvent) => {
      if (props.fixed) {
        e.stopPropagation();
      }
    };

    const wrapClick = (e: MouseEvent) => {
      if (isDisabled.value || !props.clickable || processFlag.value || dragFlag.value) return false;
      const pos = getPos(e);
      if (isRange.value) {
        if (disabledArray.value.every(b => b === false)) {
          currentSlider.value = pos > ((position.value[1] - position.value[0]) / 2 + position.value[0]) ? 1 : 0;
        } else if (disabledArray.value[0]) {
          if (pos < position.value[0]) return false;
          currentSlider.value = 1;
        } else if (disabledArray.value[1]) {
          if (pos > position.value[1]) return false;
          currentSlider.value = 0;
        }
      }
      if (disabledArray.value[currentSlider.value]) {
        return false;
      }
      setValueOnPos(pos);
      if (isRange.value && props.tooltipMerge) {
        const timer = setInterval(() => handleOverlapTooltip(), 16.7);
        setTimeout(() => window.clearInterval(timer), props.speed * 1000);
      }
    };

    const moveStart = (e: MouseEvent | TouchEvent, index = 0, isProcess = false) => {
      if (disabledArray.value[index]) {
        return false;
      }
      if (props.stopPropagation) {
        e.stopPropagation();
      }
      if (isRange.value) {
        currentSlider.value = index;
        if (isProcess) {
          if (!props.processDraggable) {
            return false;
          }
          processFlag.value = true;
          const touchEvent = e as TouchEvent;
          const mouseEvent = e as MouseEvent;
          const clientX = touchEvent.targetTouches?.[0]?.clientX || mouseEvent.clientX;
          const clientY = touchEvent.targetTouches?.[0]?.clientY || mouseEvent.clientY;
          processSign.value = {
            pos: position.value,
            start: getPos({ clientX, clientY } as MouseEvent)
          };
        }
        if (!props.enableCross && val.value[0] === val.value[1]) {
          crossFlag.value = true;
        }
      }
      if (!isProcess && props.useKeyboard) {
        focusFlag.value = true;
        focusSlider.value = index;
      }
      flag.value = true;
      emit('drag-start');
    };

    const moving = (e: MouseEvent | TouchEvent) => {
      if (props.stopPropagation) {
        e.stopPropagation();
      }
      if (!flag.value) return false;
      e.preventDefault();
      const touchEvent = e as TouchEvent;
      const mouseEvent = e as MouseEvent;
      const clientX = touchEvent.targetTouches?.[0]?.clientX || mouseEvent.clientX;
      const clientY = touchEvent.targetTouches?.[0]?.clientY || mouseEvent.clientY;
      const posEvent = { clientX, clientY } as MouseEvent;
      
      if (processFlag.value && processSign.value) {
        currentSlider.value = 0;
        setValueOnPos(processSign.value.pos[0] + getPos(posEvent) - processSign.value.start, true);
        currentSlider.value = 1;
        setValueOnPos(processSign.value.pos[1] + getPos(posEvent) - processSign.value.start, true);
      } else {
        dragFlag.value = true;
        setValueOnPos(getPos(posEvent), true);
      }
      if (isRange.value && props.tooltipMerge) {
        handleOverlapTooltip();
      }
    };

    const moveEnd = (e: MouseEvent | TouchEvent) => {
      if (props.stopPropagation) {
        e.stopPropagation();
      }
      if (flag.value) {
        emit('drag-end');
        if (props.lazy && isDiff(val.value, props.value)) {
          syncValue();
        }
      } else {
        return false;
      }
      flag.value = false;
      window.setTimeout(() => {
        crossFlag.value = false;
        dragFlag.value = false;
        processFlag.value = false;
      }, 0);
      setPosition();
    };

    const setValueOnPos = (pos: number, isDrag = false) => {
      const range = isRange.value ? limit.value[currentSlider.value] : limit.value;
      const valueRange = isRange.value ? valueLimit.value[currentSlider.value] : valueLimit.value;
      const index = Math.round((pos - dotAxialSizePx.value / 2) / gap.value);
      if (pos >= range[0] && pos <= range[1]) {
        const v = getValueByIndex(index);
        setTransform(pos);
        setCurrentValue(v, isDrag);
        if (isRange.value && (props.fixed || isLessRange(pos, index))) {
          setTransform(pos + ((fixedValue.value * gap.value) * (currentSlider.value === 0 ? 1 : -1)), true);
          setCurrentValue(
            (v * multiple.value + (fixedValue.value * spacing.value * multiple.value * (currentSlider.value === 0 ? 1 : -1))) / multiple.value,
            isDrag,
            true
          );
        }
      } else {
        const anotherSlider = pos < range[0] ? 0 : 1;
        const currentSliderPos = anotherSlider === 0 ? 1 : 0;
        setTransform(range[anotherSlider]);
        setCurrentValue(valueRange[anotherSlider]);
        if (isRange.value && (props.fixed || isLessRange(pos, index))) {
          setTransform(limit.value[idleSlider.value][anotherSlider], true);
          setCurrentValue(valueLimit.value[idleSlider.value][anotherSlider], isDrag, true);
        } else if (
          isRange.value && 
          (props.enableCross || crossFlag.value) && 
          !isFixed.value && 
          !disabledArray.value[anotherSlider] && 
          currentSlider.value === currentSliderPos
        ) {
          focusSlider.value = anotherSlider;
          currentSlider.value = anotherSlider;
        }
      }
      crossFlag.value = false;
    };

    const isLessRange = (pos: number, index: number) => {
      if (!isRange.value || (!props.minRange && !props.maxRange)) {
        return false;
      }
      const diff = currentSlider.value === 0 ? 
        (currentIndex.value as number[])[1] - index : 
        index - (currentIndex.value as number[])[0];
      if (props.minRange && diff <= props.minRange) {
        fixedValue.value = props.minRange;
        return true;
      }
      if (props.maxRange && diff >= props.maxRange) {
        fixedValue.value = props.maxRange;
        return true;
      }
      computedFixedValue();
      return false;
    };

    const isDiff = (a: any, b: any) => {
      if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
        return true;
      } else if (Array.isArray(a) && a.length === (b as any[]).length) {
        return a.some((v, i) => v !== b[i]);
      }
      return a !== b;
    };

    const setCurrentValue = (val: any, isDrag = false, isIdleSlider = false) => {
      const slider = isIdleSlider ? idleSlider.value : currentSlider.value;
      if (val < minimum.value || val > maximum.value) return false;
      if (isRange.value) {
        if (isDiff((currentValue.value as any[])[slider], val)) {
          (currentValue.value as any[]).splice(slider, 1, val);
          if (!props.lazy || !flag.value) {
            syncValue();
          }
        }
      } else if (isDiff(currentValue.value, val)) {
        currentValue.value = val;
        if (!props.lazy || !flag.value) {
          syncValue();
        }
      }
      isDrag || setPosition();
    };

    const getValueByIndex = (index: number) => {
      return ((spacing.value * multiple.value) * index + (minimum.value * multiple.value)) / multiple.value;
    };

    const getIndexByValue = (value: number) => {
      return Math.round((value - minimum.value) * multiple.value) / (spacing.value * multiple.value);
    };

    const setIndex = (val: number[] | number) => {
      if (Array.isArray(val) && isRange.value) {
        let value;
        if (props.data) {
          value = [props.data[val[0]], props.data[val[1]]];
        } else {
          value = [getValueByIndex(val[0]), getValueByIndex(val[1])];
        }
        setValue(value);
      } else {
        const numVal = getValueByIndex(val as number);
        if (isRange.value) {
          currentSlider.value = numVal > ((currentValue.value[1] - currentValue.value[0]) / 2 + currentValue.value[0]) ? 1 : 0;
        }
        setCurrentValue(numVal);
      }
    };

    const increment = (dir: number) => {
      if (boolDisabled.value) return;
      const newVal = getValue() + dir * props.interval;
      if (newVal > props.max || newVal < props.min) return;
      setValue(newVal);
    };

    const setValue = (val: any, noCb = false, speed?: number) => {
      if (isDiff(val.value, val)) {
        const resetVal = limitValue(val);
        val.value = isRange.value ? [...resetVal] : resetVal;
        computedFixedValue();
        syncValue(noCb);
      }
      nextTick(() => setPosition(speed));
    };

    const computedFixedValue = () => {
      if (!isFixed.value) {
        fixedValue.value = 0;
        return false;
      }
      fixedValue.value = Math.max(
        props.fixed ? (currentIndex.value as number[])[1] - (currentIndex.value as number[])[0] : 0,
        props.minRange || 0
      );
    };

    const setPosition = (speed?: number) => {
      flag.value || setTransitionTime(speed === undefined ? props.speed : speed);
      if (isRange.value) {
        setTransform(position.value[0], currentSlider.value === 1);
        setTransform(position.value[1], currentSlider.value === 0);
      } else {
        setTransform(position.value as number);
      }
      flag.value || setTransitionTime(0);
    };

    const setTransform = (val: number, isIdleSlider = false) => {
      const slider = isIdleSlider ? idleSlider.value : currentSlider.value;
      const value = roundToDPR(
        (props.direction === 'vertical' ? 
          ((dotAxialSizePx.value / 2) - val) : 
          (val - (dotAxialSizePx.value / 2))) * 
        (props.reverse ? -1 : 1)
      );
      const translateValue = props.direction === 'vertical' ? 
        `translate(-50%, ${value}px)` : 
        `translate(${value}px, -50%)`;
      const processSize = props.fixed ? 
        `${fixedValue.value * gap.value}px` : 
        `${slider === 0 ? position.value[1] - val : val - position.value[0]}px`;
      const processPos = props.fixed ? 
        `${slider === 0 ? val : (val - fixedValue.value * gap.value)}px` : 
        `${slider === 0 ? val : position.value[0]}px`;

      const sliderEl = slider === 0 ? dot0.value : dot1.value;
      if (sliderEl) {
        sliderEl.style.transform = translateValue;
        sliderEl.style.webkitTransform = translateValue;
      }

      if (isRange.value && process.value) {
        if (props.direction === 'vertical') {
          process.value.style.height = processSize;
          process.value.style[props.reverse ? 'top' : 'bottom'] = processPos;
        } else {
          process.value.style.width = processSize;
          process.value.style[props.reverse ? 'right' : 'left'] = processPos;
        }
      } else if (process.value) {
        if (props.direction === 'vertical') {
          process.value.style.height = `${val}px`;
          process.value.style[props.reverse ? 'top' : 'bottom'] = '0';
        } else {
          process.value.style.width = `${val}px`;
          process.value.style[props.reverse ? 'right' : 'left'] = '0';
        }
      }
    };

    const setTransitionTime = (time: number) => {
      // In order to avoid browser merge style and modify together
      time || process.value?.offsetWidth;
      const sliders = [dot0.value, dot1.value].filter(Boolean) as HTMLElement[];
      for (let i = 0; i < sliders.length; i++) {
        sliders[i].style.transitionDuration = `${time}s`;
        sliders[i].style.webkitTransitionDuration = `${time}s`;
      }
      if (process.value) {
        process.value.style.transitionDuration = `${time}s`;
        process.value.style.webkitTransitionDuration = `${time}s`;
      }
    };

    const limitValue = (val: any) => {
      if (props.data) {
        return val;
      }
      const inRange = (v: number) => {
        if (v < props.min) {
          printError(`The value of the slider is ${val}, the minimum value is ${props.min}, the value of this slider can not be less than the minimum value`);
          return props.min;
        } else if (v > props.max) {
          printError(`The value of the slider is ${val}, the maximum value is ${props.max}, the value of this slider can not be greater than the maximum value`);
          return props.max;
        }
        return v;
      };
      if (isRange.value) {
        return val.map((v: number) => inRange(v));
      } else {
        return inRange(val);
      }
    };

    const isActive = (index: number) => {
      return index >= (indexRange.value as number[])[0] && index <= (indexRange.value as number[])[1];
    };

    const syncValue = (noCb = false) => {
      let valToEmit = isRange.value ? [...val.value] : val.value;
      emit('input', valToEmit);
      keydownFlag.value && emit('on-keypress', valToEmit);
      noCb || emit('callback', valToEmit);
    };

    const getValue = () => {
      return val.value;
    };

    const getIndex = () => {
      return currentIndex.value;
    };

    const getStaticData = () => {
      if (elem.value) {
        size.value = props.direction === 'vertical' ? elem.value.offsetHeight : elem.value.offsetWidth;
        if (dot0.value) {
          dotAxialSizePx.value = props.direction === 'vertical' ? dot0.value.clientHeight : dot0.value.clientWidth;
        }
      }
    };

    const refresh = () => {
      if (elem.value) {
        getStaticData();
        computedFixedValue();
        setPosition(0);
      }
    };

    const printError = (msg: string) => {
      if (props.debug) {
        console.error(`[VueSlider error]: ${msg}`);
      }
    };

    const handleOverlapTooltip = () => {
      const isDirectionSame = tooltipDirection.value[0] === tooltipDirection.value[1];
      if (isRange.value && isDirectionSame && tooltip0.value && tooltip1.value) {
        const tooltip0El = props.reverse ? tooltip1.value : tooltip0.value;
        const tooltip1El = props.reverse ? tooltip0.value : tooltip1.value;
        const tooltip0Rect = tooltip0El.getBoundingClientRect();
        const tooltip1Rect = tooltip1El.getBoundingClientRect();
        const tooltip0Right = tooltip0Rect.right;
        const tooltip1Left = tooltip1Rect.left;
        const tooltip0Y = tooltip0Rect.top;
        const tooltip1Y = tooltip1Rect.top + tooltip1Rect.height;
        const horizontalOverlap = props.direction === 'horizontal' && tooltip0Right > tooltip1Left;
        const verticalOverlap = props.direction === 'vertical' && tooltip1Y > tooltip0Y;
        if (horizontalOverlap || verticalOverlap) {
          handleDisplayMergedTooltip(true);
        } else {
          handleDisplayMergedTooltip(false);
        }
      }
    };

    const handleDisplayMergedTooltip = (show: boolean) => {
      if (!tooltip0.value || !tooltip1.value || !process.value) return;
      
      const tooltip0El = tooltip0.value;
      const tooltip1El = tooltip1.value;
      const mergedTooltip = process.value.getElementsByClassName('vue-merged-tooltip')[0] as HTMLElement;
      
      if (show) {
        tooltip0El.style.visibility = 'hidden';
        tooltip1El.style.visibility = 'hidden';
        if (mergedTooltip) mergedTooltip.style.visibility = 'visible';
      } else {
        tooltip0El.style.visibility = 'visible';
        tooltip1El.style.visibility = 'visible';
        if (mergedTooltip) mergedTooltip.style.visibility = 'hidden';
      }
    };

    const dotContents = () => {
      return props.valueInDot ? Math.round(getValue() as number) : '';
    };

    // Watchers
    watch(() => props.value, (val) => {
      flag.value || setValue(val, true);
    });

    watch(() => props.max, (val) => {
      if (val < props.min) {
        return printError('The maximum value can not be less than the minimum value.');
      }
      const resetVal = limitValue(val.value);
      setValue(resetVal);
      refresh();
    });

    watch(() => props.min, (val) => {
      if (val > props.max) {
        return printError('The minimum value can not be greater than the maximum value.');
      }
      const resetVal = limitValue(val.value);
      setValue(resetVal);
      refresh();
    });

    watch(() => props.show, (bool) => {
      if (bool && !size.value) {
        nextTick(() => {
          refresh();
        });
      }
    });

    watch(() => props.fixed, () => {
      computedFixedValue();
    });

    watch(() => props.minRange, () => {
      computedFixedValue();
    });

    watch(() => props.reverse, () => {
      if (process.value) {
        process.value.style.cssText = '';
      }
      refresh();
    });

    // Lifecycle hooks
    onMounted(() => {
      isComponentExists.value = true;
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        return printError('window or document is undefined, can not be initialization.');
      }
      nextTick(() => {
        if (isComponentExists.value) {
          getStaticData();
          setValue(limitValue(props.value), true, props.startAnimation ? props.speed : 0);
          bindEvents();
          if (isRange.value && props.tooltipMerge && !props.startAnimation) {
            nextTick(() => {
              handleOverlapTooltip();
            });
          }
        }
      });
      isMounted.value = true;
    });

    onBeforeUnmount(() => {
      isComponentExists.value = false;
      unbindEvents();
    });

    return {
      // Refs
      elem,
      dot0,
      dot1,
      process,
      tooltip0,
      tooltip1,
      wrap,
      
      // State
      flag,
      dragFlag,
      crossFlag,
      keydownFlag,
      focusFlag,
      processFlag,
      size,
      fixedValue,
      focusSlider,
      currentValue,
      currentSlider,
      isComponentExists,
      isMounted,
      dotAxialSizePx,
      
      // Computed
      tooltipFormatHelper,
      dotWidthVal,
      dotHeightVal,
      flowDirection,
      tooltipMergedPosition,
      tooltipDirection,
      tooltipStatus,
      tooltipClass,
      disabledArray,
      boolDisabled,
      isDisabled,
      disabledClass,
      stateClass,
      isRange,
      slider,
      minimum,
      val,
      currentIndex,
      indexRange,
      maximum,
      multiple,
      spacing,
      total,
      usableSize,
      gap,
      position,
      isFixed,
      limit,
      valueLimit,
      idleSlider,
      wrapStyles,
      sliderStyles,
      focusStyles,
      disabledDotStyles,
      tooltipStyles,
      elemStyles,
      draggableStyle,
      dotStyles,
      piecewiseDotStyle,
      piecewiseDotWrap,
      
      // Methods
      formatting,
      processClick,
      wrapClick,
      moveStart,
      moving,
      moveEnd,
      setCurrentValue,
      getValueByIndex,
      getIndexByValue,
      setIndex,
      increment,
      setValue,
      setPosition,
      setTransform,
      isActive,
      syncValue,
      getValue,
      getIndex,
      refresh,
      printError,
      dotContents,
    };
  }
});
</script>

<template>
  <div :class="['l-slider', flowDirection, disabledClass, { 'l-slider--has-label': piecewiseLabel }]"
       v-show="show">
    <PlusMinusButton v-if="plusMinusButtons" type="minus" @click="increment(-1)"/>
    <div ref="wrap"
         :class="['l-slider__wrap', stateClass]"
         :style="[wrapStyles, boolDisabled ? disabledStyle : null]"
         @click="wrapClick">
      <div ref="elem" aria-hidden="true" :class="['l-slider__bg', 'c-slider__bg', bgClass]"
        :style="[elemStyles, bgStyle, draggableStyle]"
        @mousedown="moveStart($event, 0, true)"
        @touchstart="moveStart($event, 0, true)"
      >
        <template v-if="isRange">
          <div
            ref="dot0"
            key="dot0"
            :class="[tooltipStatus, 'l-slider__dot', 'c-slider__dot',
            {
              'l-slider__dot--focus': focusFlag && focusSlider === 0,
              'l-slider__dot--dragging': flag && currentSlider === 0,
              'l-slider__dot--disabled': !boolDisabled && disabledArray[0]
            }
          ]"
            :style="dotStyles"
            @mousedown="moveStart"
            @touchstart="moveStart"
          >
            <div
              :class="['l-slider__dot-handle', 'c-slider__dot-handle', dotClass]"
              :style="[
              (!boolDisabled && disabledArray[0])
              ? disabledDotStyles[0]
              : null,
              sliderStyles[0],
              focusFlag && focusSlider === 0 ? focusStyles[0]: null
            ]"
            ></div>
            <div ref="tooltip0" :class="['ad-slider-tooltip-' + tooltipDirection[0], 'ad-slider-tooltip-wrap']">
              <span class="ad-slider-tooltip" :style="tooltipStyles[0]">{{ xformatter ? formatting(val[0]) : val[0] }}</span>
            </div>
          </div>
          <div
            ref="dot1"
            key="dot1"
            :class="[tooltipStatus, 'l-slider__dot', 'c-slider__dot',
            {
              'l-slider__dot--focus': focusFlag && focusSlider === 1,
              'l-slider__dot--dragging': flag && currentSlider === 1,
              'l-slider__dot--disabled': !boolDisabled && disabledArray[1]
            }
          ]"
            :style="dotStyles"
            @mousedown="moveStart($event, 1)"
            @touchstart="moveStart($event, 1)"
          >
            <div
              :class="['l-slider__dot-handle', 'c-slider__dot-handle', dotClass]"
              :style="[
              (!boolDisabled && disabledArray[1])
              ? disabledDotStyles[1]
              : null,
              sliderStyles[1],
              focusFlag && focusSlider === 1 ? focusStyles[1]: null
            ]"
            ></div>
            <div ref="tooltip1" :class="['ad-slider-tooltip-' + tooltipDirection[1], 'ad-slider-tooltip-wrap']">
              <span class="ad-slider-tooltip" :style="tooltipStyles[1]">{{ xformatter ? formatting(val[1]) : val[1] }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div
            ref="dot0"
            key="dot0"
            :class="[tooltipStatus, 'l-slider__dot', 'c-slider__dot',
            {
              'l-slider__dot--focus': focusFlag && focusSlider === 0,
              'l-slider__dot--dragging': flag && currentSlider === 0
            }
          ]"
            :style="dotStyles"
            @mousedown="moveStart"
            @touchstart="moveStart"
          >
            <div :class="['l-slider__dot-handle', 'c-slider__dot-handle', dotClass]"
                 :style="[sliderStyles, focusFlag && focusSlider === 0 ? focusStyles : null]">
              {{dotContents()}}
            </div>
            <div :class="['ad-slider-tooltip-' + tooltipDirection, 'ad-slider-tooltip-wrap']">
              <span class="ad-slider-tooltip" :style="tooltipStyles">{{ xformatter ? formatting(val) : val }}</span>
            </div>
          </div>
        </template>
        <ul class="ad-slider-piecewise">
          <li
            v-for="(piecewiseObj, index) in piecewiseDotWrap"
            class="ad-slider-piecewise-item"
            :style="[piecewiseDotStyle, piecewiseObj.style]"
            :key="index"
          >
            <span
              v-if="piecewise"
              class="ad-slider-piecewise-dot"
              :style="[ piecewiseStyle, isActive(piecewiseObj.index) ? piecewiseActiveStyle : null ]"
            ></span>

            <span
              v-if="piecewiseLabel"
              class="ad-slider-piecewise-label"
              :style="[ labelStyle, isActive(piecewiseObj.index) ? labelActiveStyle : null ]"
            >
              {{ piecewiseObj.label }}
            </span>
          </li>
        </ul>
        <div
          ref="process"
          :class="['l-slider__process', 'c-slider__process', { 'ad-slider-process-draggable': isRange && processDraggable }, processClass]"
          :style="[elemStyles, bgStyle, draggableStyle]"
          @click="processClick"
        >
          <div
            ref="mergedTooltip"
            :class="['vue-merged-tooltip', 'ad-slider-tooltip-' + tooltipDirection[0], 'ad-slider-tooltip-wrap']"
            :style="tooltipMergedPosition"
          >
            <span class="ad-slider-tooltip" :style="tooltipStyles">
              {{ tooltipFormatHelper }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <PlusMinusButton v-if="plusMinusButtons" type="plus" @click="increment(1)"/>
  </div>
</template>

<style>
:root {
  --color-slider-blue: #0075ff;
}

.l-slider {
  display: flex;
  width: 100%;
  position: relative;
  align-items: center;
}

.l-slider--horizontal {
  flex-direction: row;
}

.l-slider--vertical {
  flex-direction: column-reverse;
}

.l-slider__wrap {
  position: relative;
  box-sizing: border-box;
  -webkit-user-select: none;
  user-select: none;
}

.l-slider--disabled .l-slider__wrap {
  opacity: 0.5;
  cursor: not-allowed;
}

.l-slider--has-label .l-slider__bg {
  margin-bottom: 1.5rem;
}

.l-slider--has-label.l-slider--horizontal .l-slider__bg,
.l-slider--has-label.l-slider--horizontal-reverse .l-slider__bg {
  top: 0.75rem;
}

.l-slider--disabled .c-slider__dot {
  cursor: not-allowed;
}

.l-slider__bg {
  display: block;
  position: relative;
}

.c-slider__bg {
  background-color: #cccccc;
  border-radius: var(--var-border-radius, 1.5rem);
}

.l-slider__bg::after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.l-slider__process {
  position: absolute;
  z-index: 1;
  transition: all 0s;
}

.c-slider__process {
  background-color: var(--color-slider-blue);
  border-radius: var(--var-border-radius, 15px);
}

.l-slider__wrap .ad-slider-process-draggable {
  z-index: 3;
  cursor: pointer;
}

.l-slider--horizontal .l-slider__process {
  width: 0;
  height: 100%;
  will-change: width;
  top: 0;
  left: 0;
}

.l-slider--vertical .l-slider__process {
  width: 100%;
  height: 0;
  will-change: height;
  bottom: 0;
  left: 0;
}

.l-slider--horizontal-reverse .l-slider__process {
  width: 0;
  height: 100%;
  top: 0;
  right: 0;
}

.l-slider--vertical-reverse .l-slider__process {
  width: 100%;
  height: 0;
  top: 0;
  left: 0;
}

.l-slider__dot {
  position: absolute;
  will-change: transform;
  z-index: 2;
  transition: all 0s;
}

.c-slider__dot {
  cursor: pointer;
}

.l-slider__dot-handle {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.c-slider__dot-handle {
  background-color: #ffffff;
  border: 0.1rem solid black;
  border-radius: var(--var-border-radius, 50%) !important;
  box-shadow: 0.5px 0.5px 2px 1px rgba(0, 0, 0, 32%);
  transition-duration: 0.2s;
}

.c-slider__dot-handle:hover {
  background-color: var(--color-slider-blue);
}

.l-slider__dot--focus .c-slider__dot-handle {
  box-shadow: 0 0 2px 1px var(--color-slider-blue);
}

.l-slider__dot--dragging {
  z-index: 5;
}

.l-slider__dot--disabled {
  z-index: 4;
}

.l-slider--horizontal .l-slider__dot {
  left: 0;
}

.l-slider--vertical .l-slider__dot {
  bottom: 0;
}

.l-slider--horizontal-reverse .l-slider__dot {
  right: 0;
}

.l-slider--vertical-reverse .l-slider__dot {
  top: 0;
}

.l-slider__wrap .ad-slider-tooltip-wrap {
  display: none;
  position: absolute;
  z-index: 9;
}

.l-slider__wrap .ad-slider-tooltip {
  display: block;
  white-space: nowrap;
  min-width: 20px;
  text-align: center;
  font-size: 14px;
  color: #ffffff;
  background-color: var(--color-slider-blue);
  border: 0.1rem solid var(--color-slider-blue);
  border-radius: var(--var-border-radius, 5px);
  padding: 2px 5px;
}

.l-slider__wrap .ad-slider-tooltip-wrap.ad-slider-tooltip-top {
  top: -9px;
  left: 50%;
  transform: translate(-50%, -100%);
}

.l-slider__wrap .ad-slider-tooltip-wrap.ad-slider-tooltip-bottom {
  bottom: -9px;
  left: 50%;
  transform: translate(-50%, 100%);
}

.l-slider__wrap .ad-slider-tooltip-wrap.ad-slider-tooltip-left {
  top: 50%;
  left: -9px;
  transform: translate(-100%, -50%);
}

.l-slider__wrap .ad-slider-tooltip-wrap.ad-slider-tooltip-right {
  top: 50%;
  right: -9px;
  transform: translate(100%, -50%);
}

.l-slider__wrap .ad-slider-tooltip-wrap.ad-slider-tooltip-top .ad-slider-tooltip::before,
.l-slider__wrap .ad-slider-tooltip-top .vue-merged-tooltip .ad-slider-tooltip::before {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  bottom: -10px;
  left: 50%;
  border: 5px solid transparent;
  border: 6px solid transparent\0;
  border-top-color: inherit;
  transform: translate(-50%, 0);
}

.l-slider__wrap .ad-slider-tooltip-wrap.vue-merged-tooltip {
  display: block;
  visibility: hidden;
}

.l-slider__wrap .ad-slider-tooltip-wrap.ad-slider-tooltip-bottom .ad-slider-tooltip::before,
.l-slider__wrap .ad-slider-tooltip-bottom .vue-merged-tooltip .ad-slider-tooltip::before {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  top: -10px;
  left: 50%;
  border: 5px solid transparent;
  border: 6px solid transparent\0;
  border-bottom-color: inherit;
  transform: translate(-50%, 0);
}

.l-slider__wrap .ad-slider-tooltip-wrap.ad-slider-tooltip-left .ad-slider-tooltip::before,
.l-slider__wrap .ad-slider-tooltip-left .vue-merged-tooltip .ad-slider-tooltip::before {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  top: 50%;
  right: -10px;
  border: 5px solid transparent;
  border: 6px solid transparent\0;
  border-left-color: inherit;
  transform: translate(0, -50%);
}

.l-slider__wrap .ad-slider-tooltip-wrap.ad-slider-tooltip-right .ad-slider-tooltip::before,
.l-slider__wrap .ad-slider-tooltip-right .vue-merged-tooltip .ad-slider-tooltip::before {
  content: "";
  width: 0;
  height: 0;
  position: absolute;
  top: 50%;
  left: -10px;
  border: 5px solid transparent;
  border: 6px solid transparent\0;
  border-right-color: inherit;
  transform: translate(0, -50%);
}

.l-slider__wrap .l-slider__dot.ad-slider-hover:hover .ad-slider-tooltip-wrap {
  display: block;
}

.l-slider__wrap .l-slider__dot.ad-slider-always .ad-slider-tooltip-wrap {
  display: block !important;
}

.l-slider__wrap .ad-slider-piecewise {
  list-style: none;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
}

.l-slider__wrap .ad-slider-piecewise-item {
  width: 8px;
  height: 8px;
  position: absolute;
}

.l-slider__wrap .ad-slider-piecewise-dot {
  display: inline-block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  background-color: rgba(0, 0, 0, 16%);
  border-radius: var(--var-border-radius, 50%);
  transform: translate(-50%, -50%);
  transition: all 0.3s;
}

.l-slider__wrap .ad-slider-piecewise-item:first-child .ad-slider-piecewise-dot,
.l-slider__wrap .ad-slider-piecewise-item:last-child .ad-slider-piecewise-dot {
  visibility: hidden;
}

.l-slider--horizontal .ad-slider-piecewise-label,
.l-slider--horizontal-reverse .ad-slider-piecewise-label {
  display: inline-block;
  visibility: visible;
  white-space: nowrap;
  position: absolute;
  top: 100%;
  left: 50%;
  font-size: 12px;
  color: #333333;
  transform: translate(-50%, 8px);
}

.l-slider--vertical .ad-slider-piecewise-label,
.l-slider--vertical-reverse .ad-slider-piecewise-label {
  display: inline-block;
  visibility: visible;
  white-space: nowrap;
  position: absolute;
  top: 50%;
  left: 100%;
  font-size: 12px;
  color: #333333;
  transform: translate(8px, -50%);
}
</style>