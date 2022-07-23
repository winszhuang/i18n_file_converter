<script setup lang="ts">
import { ref } from 'vue'
import SelectorFolder from './components/SelectorFolder.vue'
import SelectorTabs from './components/SelectorTabs.vue'
import { TransformModeList } from './constants/default'

const folderPath = ref('')
const exportFolderPath = ref('')
const mode = ref<Mode>(TransformModeList[0])
const langList = ref<Mode[]>([])

const execute = () => {
  console.log('execute');
}

</script>

<template>
  <div class="flex flex-col items-stretch justify-between w-full h-screen px-6 py-10 font-mono">
    <main>
      <h1 
        class="pb-8 text-4xl font-semibold">I18n File Converter
      </h1>
      <!-- 選擇資料夾 -->
      <section class="mb-6">
        <h4 class="mb-2 text-2xl">Main Folder</h4>
        <SelectorFolder v-model:path="folderPath"/>
      </section>
  
      <!-- 選擇基準語系 -->
      <section class="mb-6">
        <h4 class="mb-2 text-2xl">Base Language</h4>
        <SelectorTabs 
          :tabList="langList"
          v-model:mode="mode"
        />
      </section>
  
      <!-- 選擇轉換模式 -->
      <section class="mb-6">
        <h4 class="mb-2 text-2xl">Mode</h4>
        <SelectorTabs 
          :tabList="TransformModeList"
          v-model:mode="mode"
        />
      </section>
  
      <!-- 選擇輸出資料夾 -->
      <section class="mb-16">
        <h4 class="mb-2 text-2xl">Export</h4>
        <SelectorFolder v-model:path="exportFolderPath"/>
      </section>
    </main>

    <!-- 執行 -->
    <button 
      @click="execute"
      class="px-6 py-3 text-3xl border-2 border-black rounded-lg hover:bg-slate-700 hover:text-white">
      Execute
    </button>
  </div>
</template>
