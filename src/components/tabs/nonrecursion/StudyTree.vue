<script setup lang="ts">
import StudyTree from './StudyTree.vue';
import { formatWhole } from '@/utils/format';
import { addTheories, canBuyTheories, resetTheories, theoriesCost } from '@/core/nonrecu/studies';
import SingleStudy from "./SingleStudy.vue"
import { ref, onMounted, nextTick, watch, type ComponentPublicInstance } from 'vue'

const studyRefs = ref<Map<number, InstanceType<typeof SingleStudy>>>(new Map())
const connectorsRef = ref<HTMLElement | null>(null)

const studyConnections = [
  { from: 0, to: 2 },
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 0, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 4 },
  { from: 3, to: 5 },
  { from: 4, to: 6 },
  { from: 5, to: 7 },
  { from: 6, to: 8 },
  { from: 6, to: 9 },
  { from: 6, to: 10 },
  { from: 8, to: 11 },
  { from: 10, to: 12 },
  { from: 8, to: 13 },
  { from: 9, to: 14 },
  { from: 10, to: 15 },
  { from: 13, to: 16 },
  { from: 14, to: 17 },
  { from: 15, to: 18 },
  { from: 16, to: 19 },
  { from: 17, to: 19 },
  { from: 18, to: 19 },
  { from: 19, to: 20 },
  { from: 19, to: 21 },
  { from: 20, to: 22 },
  { from: 21, to: 22 },
  { from: 22, to: 23 },
  { from: 22, to: 24 },
  { from: 22, to: 25 },
  { from: 23, to: 26 },
  { from: 24, to: 26 },
  { from: 25, to: 26 },
]

const registerStudyRef = (id: number, el: any | InstanceType<typeof SingleStudy> | null) => {
  if (el) {
    studyRefs.value.set(id, el)
  } else {
    studyRefs.value.delete(id)
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
      
      const fromEl = fromStudy.$el.children[1]! as HTMLElement
      const toEl = toStudy.$el.children[1]! as HTMLElement
      
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
        <div class="study-desc" :class="canBuyTheories(0) ? 'study-buyable' : ''" @click="addTheories(0)">
          <div>获得一个非递归理论</div>
          <div>花费: {{ formatWhole(theoriesCost(0)) }} 九头蛇能量</div>
        </div>
      </div>
      <div class="study">
        <div class="study-name">NRT2</div>
        <div class="study-desc" :class="canBuyTheories(1) ? 'study-buyable' : ''" @click="addTheories(1)">
          <div>获得一个非递归理论</div>
          <div>花费: {{ formatWhole(theoriesCost(1)) }} 九头蛇溶液</div>
        </div>
      </div>
      <div class="study">
        <div class="study-name">NRT3</div>
        <div class="study-desc" :class="canBuyTheories(2) ? 'study-buyable' : ''" @click="addTheories(2)">
          <div>获得一个非递归理论</div>
          <div>花费: {{ formatWhole(theoriesCost(2)) }} 非递归能量</div>
        </div>
      </div>
    </div>
    <div class="studies_row">
      <div class="study">
        <div class="study-name">NRTR</div>
        <div class="study-desc study-buyable" @click="resetTheories">
          <div>重置研究树</div>
          <div>花费: 0 非递归能量</div>
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
      <div class=studies_row>
        <SingleStudy 
          :ref="el => registerStudyRef(4, el)" 
          :study_id="4" 
          @update:study="updateAllConnectors" 
        />
        <SingleStudy 
          :ref="el => registerStudyRef(5, el)" 
          :study_id="5" 
          @update:study="updateAllConnectors" 
        />
      </div>
      <div class=studies_row>
        <SingleStudy 
          :ref="el => registerStudyRef(6, el)" 
          :study_id="6" 
          @update:study="updateAllConnectors" 
        />
        <SingleStudy 
          :ref="el => registerStudyRef(7, el)" 
          :study_id="7" 
          @update:study="updateAllConnectors" 
        />
      </div>
      <div class=studies_row>
        <SingleStudy 
          :ref="el => registerStudyRef(11, el)" 
          :study_id="11" 
          @update:study="updateAllConnectors" 
        />
        <SingleStudy 
          :ref="el => registerStudyRef(8, el)" 
          :study_id="8" 
          @update:study="updateAllConnectors" 
        />
        <SingleStudy 
          :ref="el => registerStudyRef(9, el)" 
          :study_id="9" 
          @update:study="updateAllConnectors" 
        />
        <SingleStudy 
          :ref="el => registerStudyRef(10, el)" 
          :study_id="10" 
          @update:study="updateAllConnectors" 
        />
        <SingleStudy 
          :ref="el => registerStudyRef(12, el)" 
          :study_id="12" 
          @update:study="updateAllConnectors" 
        />
      </div>
      <div class=studies_row>
        <SingleStudy 
          :ref="el => registerStudyRef(13, el)" 
          :study_id="13" 
          @update:study="updateAllConnectors" 
        />
        <SingleStudy 
          :ref="el => registerStudyRef(14, el)" 
          :study_id="14" 
          @update:study="updateAllConnectors" 
        />
        <SingleStudy 
          :ref="el => registerStudyRef(15, el)" 
          :study_id="15" 
          @update:study="updateAllConnectors" 
        />
      </div>
      <div class=studies_row>
        <SingleStudy 
          :ref="el => registerStudyRef(16, el)" 
          :study_id="16" 
          @update:study="updateAllConnectors" 
        />
        <SingleStudy 
          :ref="el => registerStudyRef(17, el)" 
          :study_id="17" 
          @update:study="updateAllConnectors" 
        />
        <SingleStudy 
          :ref="el => registerStudyRef(18, el)" 
          :study_id="18" 
          @update:study="updateAllConnectors" 
        />
      </div>
      <div class=studies_row>
        <SingleStudy 
          :ref="el => registerStudyRef(19, el)" 
          :study_id="19" 
          @update:study="updateAllConnectors" 
        />
      </div>
      <div class=studies_row>
        <SingleStudy 
          :ref="el => registerStudyRef(20, el)" 
          :study_id="20" 
          @update:study="updateAllConnectors" 
        />
        <SingleStudy 
          :ref="el => registerStudyRef(21, el)" 
          :study_id="21" 
          @update:study="updateAllConnectors" 
        />
      </div>
      <div class=studies_row>
        <SingleStudy 
          :ref="el => registerStudyRef(22, el)" 
          :study_id="22" 
          @update:study="updateAllConnectors" 
        />
      </div>
      <div class=studies_row>
        <SingleStudy 
          :ref="el => registerStudyRef(23, el)" 
          :study_id="23" 
          @update:study="updateAllConnectors" 
        />
        <SingleStudy 
          :ref="el => registerStudyRef(24, el)" 
          :study_id="24" 
          @update:study="updateAllConnectors" 
        />
        <SingleStudy 
          :ref="el => registerStudyRef(25, el)" 
          :study_id="25" 
          @update:study="updateAllConnectors" 
        />
      </div>
      <div class=studies_row>
        <SingleStudy 
          :ref="el => registerStudyRef(26, el)" 
          :study_id="26" 
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
  gap: 30px;
  margin-bottom: 30px;
  flex-shrink: none
}

.studies_row > .study {
  margin: 15px;
  position: relative;
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
  z-index: 1
}
</style>