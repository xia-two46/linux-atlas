<script setup>
// 浏览器内伪终端组件：封装原项目的 terminal.js（零依赖伪终端）
// 在 onMounted 时动态加载 core 脚本并挂载到 [data-terminal] 元素
import { onMounted, onBeforeUnmount, ref } from 'vue'

const rootEl = ref(null)
let mounted = false

onMounted(async () => {
  if (mounted) return
  mounted = true
  // terminal-core.js 是 IIFE，会自己查找 [data-terminal] 并挂载
  await import('./terminal-core.js')
})

onBeforeUnmount(() => {
  mounted = false
})
</script>

<template>
  <div class="terminal" data-terminal ref="rootEl">
    <div class="terminal-bar">
      <span class="dot dot-r"></span><span class="dot dot-y"></span><span class="dot dot-g"></span>
      <span class="terminal-title">user@cmd-atlas:~</span>
    </div>
    <div class="terminal-body" data-terminal-body role="log" aria-live="polite" aria-label="终端输出">
      <div class="term-line term-banner">GNU/Linux 命令图谱 · 浏览器内伪终端</div>
      <div class="term-line term-hint">输入 <code>help</code> 查看支持的命令，<code>ls</code> 开始浏览</div>
    </div>
    <form class="terminal-input-line" data-terminal-form @submit.prevent>
      <span class="term-prompt" data-terminal-prompt>user@atlas:~$</span>
      <input type="text" data-terminal-input aria-label="终端输入" autocomplete="off" spellcheck="false" />
    </form>
  </div>
</template>

<style scoped>
/* 终端样式：与主题无关的深色终端外观，保证可读性 */
.terminal {
  background: #0d1117;
  border: 1px solid #30363d;
  border-radius: 12px;
  overflow: hidden;
  font-family: 'SFMono-Regular', 'JetBrains Mono', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13.5px;
  line-height: 1.6;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
}
.terminal-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #161b22;
  border-bottom: 1px solid #30363d;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}
.dot-r { background: #ff5f56; }
.dot-y { background: #ffbd2e; }
.dot-g { background: #27c93f; }
.terminal-title {
  margin-left: 8px;
  color: #8b949e;
  font-size: 12px;
}
.terminal-body {
  padding: 14px 16px;
  min-height: 180px;
  max-height: 360px;
  overflow-y: auto;
  color: #c9d1d9;
}
.term-line { white-space: pre-wrap; word-break: break-word; }
.term-banner { color: #58a6ff; font-weight: 600; margin-bottom: 4px; }
.term-hint { color: #8b949e; }
.term-hint code {
  background: #30363d;
  color: #79c0ff;
  padding: 1px 5px;
  border-radius: 4px;
  font-size: 12.5px;
}
.terminal-input-line {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-top: 1px solid #30363d;
  background: #161b22;
}
.term-prompt {
  color: #7ee787;
  white-space: nowrap;
}
.terminal-input-line input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #c9d1d9;
  font-family: inherit;
  font-size: inherit;
  caret-color: #58a6ff;
}
</style>
