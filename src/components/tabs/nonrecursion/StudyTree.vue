<script setup lang="ts">
import StudyTree from './StudyTree.vue';
import { formatWhole } from '@/utils/format';
import { addTheories, theoriesCost } from '@/core/nonrecu/studies';
import SingleStudy from "./SingleStudy.vue"
import { ref, onMounted, nextTick, watch, type ComponentPublicInstance } from 'vue'

const studyRefs = ref<Map<number, InstanceType<typeof SingleStudy>>>(new Map())
const connectorsRef = ref<HTMLElement | null>(null)

const studyConnections = [
  { from: 0, to: 2 },
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 0, to: 3 },
]

const registerStudyRef = (id: number, el: Element | ComponentPublicInstance | InstanceType<typeof SingleStudy> | null) => {
  if (el instanceof SingleStudy) {
    studyRefs.value.set(id, el)
  } else if (!el) {
    studyRefs.value.delete(id)
  } else {
    console.warn("传了个非空非SingleStudy")
  }
}

const updateAllConnectors = () => {
  nextTick(() => {
    if (!connectorsRef.value) return
    
    connectorsRef.value.innerHTML = ''
    
    studyConnections.forEach(connection => {
      if (!connectorsRef.value) return
      const fromStudy = studyRefs.value.get(connection.from)
      const toStudy = studyRefs.value.get(connection.to)
      
      if (!fromStudy || !toStudy) return
      
      const fromEl = fromStudy.$el as HTMLElement
      const toEl = toStudy.$el as HTMLElement
      
      if (!fromEl || !toEl) return
      
      const fromRect = fromEl.getBoundingClientRect()
      const toRect = toEl.getBoundingClientRect()
      const containerRect = connectorsRef.value.getBoundingClientRect()
      
      const startX = (fromRect.left + fromRect.right) / 2 - containerRect.left
      const startY = (fromRect.top + fromRect.bottom) / 2 - containerRect.top
      const endX = (toRect.left + toRect.right) / 2 - containerRect.left
      const endY = (toRect.top + toRect.bottom) / 2 - containerRect.top
      
      const dx = endX - startX
      const dy = endY - startY
      const length = Math.sqrt(dx * dx + dy * dy)
      const angle = Math.atan2(dy, dx) * 180 / Math.PI
      
      const lineContainer = document.createElement('div')
      lineContainer.className = 'connection-line'
      lineContainer.style.position = 'absolute'
      lineContainer.style.left = `${startX}px`
      lineContainer.style.top = `${startY}px`
      lineContainer.style.width = `${length}px`
      lineContainer.style.transform = `rotate(${angle}deg)`
      lineContainer.style.transformOrigin = '0 0'
      lineContainer.style.zIndex = '1'
      lineContainer.style.pointerEvents = 'none'
      
      const line = document.createElement('div')
      line.className = 'line'
      line.style.height = '20px'
      line.style.width = '100%'
      line.style.background = 'linear-gradient(90deg, #e5c380, #d4af37)'
      line.style.boxShadow = '0 0 10px rgba(229, 195, 128, 0.7)'
      
      lineContainer.appendChild(line)
      connectorsRef.value.appendChild(lineContainer)
    })
  })
}

onMounted(() => {
  updateAllConnectors()
  window.addEventListener('resize', updateAllConnectors)
})

watch(studyRefs, () => {
  updateAllConnectors()
}, { deep: true })
</script>

<template>
  <div class="studies-container">
    <div class="studies_row">
      <div class="study">
        <div class="study-name">NRT1</div>
        <div class="study-desc" @click="addTheories(0)">
          <div>获得一个非递归理论</div>
          <div>花费: {{ formatWhole(theoriesCost(0)) }} 九头蛇能量</div>
        </div>
      </div>
      <div class="study">
        <div class="study-name">NRT2</div>
        <div class="study-desc" @click="addTheories(1)">
          <div>获得一个非递归理论</div>
          <div>花费: {{ formatWhole(theoriesCost(1)) }} 九头蛇溶液</div>
        </div>
      </div>
      <div class="study">
        <div class="study-name">NRT3</div>
        <div class="study-desc" @click="addTheories(2)">
          <div>获得一个非递归理论</div>
          <div>花费: {{ formatWhole(theoriesCost(2)) }} 非递归能量</div>
        </div>
      </div>
    </div>
    
    <div class="studies-tree">
      <div class="studies_row">
        <SingleStudy 
          :ref="el => registerStudyRef(0, el)" 
          :study_id="0" 
          @update:study="updateAllConnectors" 
        />
        <SingleStudy 
          :ref="el => registerStudyRef(1, el)" 
          :study_id="1" 
          @update:study="updateAllConnectors" 
        />
      </div>
      <div class="studies_row">
        <SingleStudy 
          :ref="el => registerStudyRef(2, el)" 
          :study_id="2" 
          @update:study="updateAllConnectors" 
        />
        <SingleStudy 
          :ref="el => registerStudyRef(3, el)" 
          :study_id="3" 
          @update:study="updateAllConnectors" 
        />
      </div>
      <div ref="connectorsRef" class="connectors-container"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.studies-container {
  position: relative;
}

.studies_row {
  display: flex;
  justify-content: center;
  position: relative;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 30px;
}

.studies_row > .study {
  margin: 15px;
  position: relative;
  z-index: 2;
}

.studies-tree {
  position: relative;
  min-height: 300px;
  padding: 20px;
}

.connectors-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>