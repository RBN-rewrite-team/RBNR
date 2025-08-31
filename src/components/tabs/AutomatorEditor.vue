<script lang="ts" setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { player } from "@/core/global"

const emit = defineEmits<{
  (e: 'update:code', code: string): void
}>()

const editorRef = ref<HTMLDivElement>()
const highlightRef = ref<HTMLDivElement>()
const gutterRef = ref<HTMLDivElement>()

const lineNumbers = computed(() => {
  const lines = player.automator.code.split('\n').length
  return Array.from({length: lines}, (_, i) => i + 1).join('<br>')
})

const highlightedCode = computed(() => {
  let result = santize(player.automator.code)
  
  //没做
  
  return result
})

const handleInput = (): void => {
  if (editorRef.value) {
    player.automator.code = santize(editorRef.value.innerHTML) || ''
    emit('update:code', player.automator.code)
    handleScroll()
  }
}

const handleScroll = (): void => {
  if (editorRef.value && highlightRef.value && gutterRef.value) {
    highlightRef.value.scrollTop = editorRef.value.scrollTop
    highlightRef.value.scrollLeft = editorRef.value.scrollLeft
    gutterRef.value.scrollTop = editorRef.value.scrollTop
  }
}

const handleKeyDown = (e: KeyboardEvent): void => {
  if (e.key === 'Tab') {
    e.preventDefault()
    document.execCommand('insertText', false, '  ')
  }
}

const santize = (text: string): string => {
  return text.replace(/<div><br><\/div>/g, "\n").replace(/<div>/g, "\n").replace(/<\/div>/g, "")
}

watch(() => player.automator.code, (newCode) => {
  if (newCode !== player.automator.code && editorRef.value) {
    player.automator.code = newCode
    editorRef.value.innerHTML = newCode
  }
})

onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = player.automator.code
  }
})
</script>

<template>
  <div align="center">
  自动机(只做了编辑器)<br>
  <div class="code-editor" align="left">
    <div ref="gutterRef" class="gutter" v-html="lineNumbers"></div>
    <div class="editor-container">
      <div ref="highlightRef" class="highlight-layer" v-html="highlightedCode"></div>
      <div 
        ref="editorRef"
        class="editor" 
        contenteditable
        spellcheck="false"
        @input="handleInput"
        @scroll="handleScroll"
        @keydown="handleKeyDown"
      ></div>
    </div>
  </div>
  </div>
</template>

<style scoped>
.code-editor {
  position: relative;
  height: 600px;
  width: 80%;
  display: flex;
  background-color: #1F1F1F;
  color: white;
  font-family: 'JetBrains Mono', monospace;
  font-size: 15px;
  overflow: auto;
  white-space: nowrap;
  word-break: keep-all;
}

.editor-container {
  position: relative;
  width: calc(100% - 50px);
  height: 100%;
}

.gutter {
  width: 50px;
  background-color: #2d2d30;
  color: #858585;
  text-align: right;
  padding: 15px 5px;
  box-sizing: border-box;
  user-select: none;
  overflow: hidden;
  flex-shrink: 0;
  line-height: 1.5
}

.highlight-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  background: #1F1F1F;
  z-index: 1;
  overflow: auto;
  font-family: inherit;
  font-size: inherit;
  line-height: 1.5;
  white-space: pre;
  pointer-events: none;
}

.editor {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 15px;
  box-sizing: border-box;
  background: transparent;
  color: transparent;
  caret-color: white;
  z-index: 2;
  overflow: auto;
  font-family: inherit;
  font-size: inherit;
  line-height: 1.5;
  white-space: pre;
  border: none;
  outline: none;
  resize: none;
}

.keyword {
  color: #569cd6;
}

.string {
  color: #ce9178;
}

.comment {
  color: #6a9955;
  font-style: italic;
}

.function {
  color: #dcdcaa;
}

.number {
  color: #b5cea8;
}

@font-face {
  font-family: JetBrains Mono;
  src: url('../../assets/JetBrainsMono-Regular.ttf') format('truetype');
  font-style: normal;
}

@font-face {
  font-family: JetBrains Mono;
  src: url('../../assets/JetBrainsMonoNL-Italic.ttf') format('truetype');
  font-style: italic;
}
</style>