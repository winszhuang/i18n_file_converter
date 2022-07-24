<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import SelectorFolder from './components/SelectorFolder.vue'
import SelectorTabs from './components/SelectorTabs.vue'
import { TransformModeList } from './constants/default'
import { getLangListByFolderPath } from './logic/helper'
import { jsonToExcel, excelToJson } from './logic/index'
import { TransformModeEnum } from './enums/mode.enum'

const folderPath = ref('')
const folderPathError = ref('')
const mode = ref<Mode>(TransformModeList[0])
const baseLang = ref<Mode>()
const langList = ref<Mode[]>([])

const execute = async () => {
  const strategy = {
    [TransformModeEnum.jsonToExcel]: () => jsonToExcel(
      langList.value.map(item => item.key),
      baseLang.value!.key,
      folderPath.value
    ),
    [TransformModeEnum.excelToJson]: () => excelToJson()
  }

  const modeIndex = mode.value.value as TransformModeEnum

  try {
    const result = await strategy[modeIndex]()
    alert(result ? 'success' : 'fail')
  } catch (error) {
    alert((error as Error).message)
  }
}

watchEffect(async () => {
  if (folderPath.value && folderPathError.value === '') {
    const list = await getLangListByFolderPath(folderPath.value)
    langList.value = list.map((item, index) => ({ key: item, value: index }))
    return
  } else {
    langList.value = []
  }
})

</script>

<template>
  <div class="flex flex-col items-stretch justify-between w-full h-screen px-6 py-10 font-mono">
    <main>
      <h1 
        class="pb-8 text-4xl font-semibold text-slate-700">I18n File Converter
      </h1>

      <!-- 選擇轉換模式 -->
      <section class="mb-8">
        <h4 class="mb-2 text-2xl">Choose Mode</h4>
        <div class="pl-4 mb-3 border-l-2 border-black bg-slate-100">
          <span class="font-bold ">jsonToExcel</span>  : trans all language json files to single xlsx file <br>
          <span class="font-bold ">excelToJson</span> : trans single xlsx file to all language json files
        </div>
        <SelectorTabs 
          :tabList="TransformModeList"
          v-model:tabs="mode"
        />
      </section>

      <template v-if="mode.value === TransformModeEnum.jsonToExcel">
        <!-- 選擇資料夾 -->
        <section class="relative mb-8">
          <h4 class="mb-2 text-2xl">Main Folder</h4>
          <div class="pl-4 mb-3 border-l-2 border-black bg-slate-100">
            don't choose desktop
            or folder without files inside
          </div>
          <SelectorFolder 
            v-model:path="folderPath"
            v-model:errorMessage="folderPathError"
          />
          <div class="absolute mt-1 ml-2 text-red-500">
            {{ folderPathError }}
          </div>
        </section>
    
        <!-- 選擇基準語系 -->
        <section class="mb-8">
          <h4 class="mb-2 text-2xl">Base Language</h4>
          <div class="pl-4 mb-3 border-l-2 border-black bg-zinc-100">
            Use this language folder as a reference
          </div>
          <SelectorTabs 
            :tabList="langList"
            v-model:tabs="baseLang"
          />
        </section>
      </template>

      <template v-else>
        <div class="text-center">
          maintaining...
        </div>
      </template>
    </main>

    <!-- 執行 -->
    <button 
      @click="execute"
      class="px-6 py-3 text-3xl border-2 border-black rounded-lg hover:bg-slate-700 hover:text-white">
      Execute
    </button>
  </div>
</template>
