<script lang="ts" setup>
import { calcMountain, findByIndex, findByCoord, type Mountain, type NodeMountain, type LeafMountain } from "../../../utils/y-seq"
import { ref, reactive, computed, onMounted, watch, nextTick } from "vue"
const Y = reactive({
  Y: "1,10",
  type: "ω-Y"
}) // 后面会改成prop参数

const getYDimensionsLim = (type: string) => {
  if (type === "1-Y") return 2
  if (type === "ω-Y") return Infinity
  throw new Error("Unknown type")
}

const calculatedMountain = computed(() => calcMountain(Y.Y, getYDimensionsLim(Y.type)))
const mountain = ref<HTMLElement | null>(null)

const rowHeight = 128
const columnWidth = 128
const lineThickness = 4
const numberSize = 40
const gap = 12

function draw() {
  if (!mountain.value) return
  if (!calculatedMountain.value) return
  
  const canvas = mountain.value as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return
  
  const columnPosition: [number, number][] = [];
  const rowPosition: Record<string, number> = {};
  const calculatedMount = calculatedMountain.value as Mountain
  for (let cycles = 0; cycles < 2; cycles++) {
    let currentRow = 0;
    let renderingIndex = [0];
    let tempMountain: Mountain = calculatedMount;
    for (let i = 0; i < calculatedMount.dim - 1; i++) {
      renderingIndex.unshift((tempMountain as NodeMountain).arr.length - 1);
      tempMountain = (tempMountain as NodeMountain).arr[(tempMountain as NodeMountain).arr.length - 1]
    }
    renderingIndex.unshift(0)
    while (true) {
      tempMountain = findByIndex(calculatedMount, renderingIndex.slice(1, -1).reverse())!;
      if (cycles === 1) {
        render1Dmountain(calculatedMount, tempMountain, rowPosition, columnPosition)
      } else {
        rowPosition["c" + tempMountain.coord.slice(1).join(",")] = currentRow
      }
      currentRow++
      let d = 1
      for (; d < calculatedMount.dim; d++) {
        renderingIndex[d]--;
        if (renderingIndex[d] < 0) continue;
        for (let e = d - 1; e >= 1; e--) {
          tempMountain = findByIndex(calculatedMount, renderingIndex.slice(e + 1, -1).reverse())! as NodeMountain;
          renderingIndex[e] = tempMountain.arr.length - 1
        }
        if (d > 1) currentRow++;
        if ((cycles === 1) && (d > 1)) {
          const lines = d - 1;
          ctx.beginPath()
          for (let i = 0; i < lines; i++) {
            let y = currentRow * rowHeight - numberSize - gap + rowHeight * (i + 1) / (lines + 1)
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
          }
          ctx.stroke();
        }
        break;
      }
      
      if (d >= calculatedMount.dim) {
        if (cycles === 0) {
          let bottomRow = calculatedMount as NodeMountain
          while (bottomRow.dim > 1) bottomRow = (tempMountain as NodeMountain).arr[0] as NodeMountain
          ctx.font = `400 ${numberSize}px Computer Modern`
          let totalWidth = 0;
          for (let i = 0; i < bottomRow.arr.length; i++) {
            columnPosition.push([columnWidth, totalWidth])
            totalWidth += columnWidth
          }
          const totalHeight = (rowPosition["c"] + 1) * rowHeight
          canvas.style.width = totalWidth / 4 + "px"
          canvas.width = totalWidth
          canvas.style.height = totalHeight / 4 + "px"
          canvas.height = totalHeight
          ctx.fillStyle = getRootCssVariable("--background-color") ?? "white"
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = getRootCssVariable("--color") ?? "black"
          ctx.strokeStyle = getRootCssVariable("--color") ?? "black"
          ctx.lineWidth = lineThickness
          ctx.font = `400 ${numberSize}px Computer Modern`
          ctx.textAlign = "center"
        }
        break;
      }
    }
  }
}

function render1Dmountain(mount: Mountain, tempMountain: Mountain, rowPosition: Record<string, number>, columnPosition: [number, number][]) {
  if (!mountain.value) return

  const canvas = mountain.value as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return
  const rowID = rowPosition["c" + tempMountain.coord.slice(1).join(",")]
  for (let k = 0; k < (tempMountain as NodeMountain).arr.length; k++) {
    const point = (tempMountain as NodeMountain).arr[k] as LeafMountain;
    ctx.fillText(String(point.value), columnPosition[point.position][1] + columnPosition[point.position][0] / 2, (rowID + 1) * rowHeight - gap)
    if (point.leftLegCoord !== null) {
      ctx.beginPath();
      ctx.moveTo(columnPosition[point.position][1] + columnPosition[point.position][0] / 2, (rowPosition["c" + point.rightLegCoord!.slice(1).join(",")] + 1) * rowHeight - numberSize - gap)
      ctx.lineTo(columnPosition[point.position][1] + columnPosition[point.position][0] / 2, (rowID + 1) * rowHeight)
      const parentPosition = (findByCoord(mount, point.leftLegCoord!) as LeafMountain).position;
      ctx.lineTo(columnPosition[parentPosition][1] + columnPosition[parentPosition][0] / 2, (rowID + 2) * rowHeight - numberSize - gap)
      ctx.lineTo(columnPosition[parentPosition][1] + columnPosition[parentPosition][0] / 2, (rowPosition["c" + point.leftLegCoord!.slice(1).join(",")] + 1) * rowHeight - numberSize - gap)
      ctx.stroke()
    }
  }
}

function getRootCssVariable(variableName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim()
}

watch(calculatedMountain, draw)

onMounted(()=>{nextTick(draw)})
</script>

<template>
  <canvas ref="mountain" />
</template>