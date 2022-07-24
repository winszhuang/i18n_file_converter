<script setup lang="ts">
import { ref } from 'vue'
import { useVModel } from '@vueuse/core'
import { isPathExist } from '../logic/helper';

const props = withDefaults(defineProps<{
  path?: string,
  errorMessage?: string,
}>(), {
  path: '',
  errorMessage: ''
})
const emit = defineEmits(['update:path', 'update:errorMessage'])

const path = useVModel(props, 'path', emit)
const errorMessage = useVModel(props, 'errorMessage', emit)
const inputFileRef = ref<HTMLElement>()

const getFolderPath = (e: Event) => {
  const fileList = (e.target as HTMLInputElement)?.files

  if (fileList && fileList.length) {
    const firstFile = fileList[0]
    const selectFolderName = firstFile.webkitRelativePath.split('/')[0]
    const thisPath = firstFile.path.split(selectFolderName)[0] + selectFolderName

    path.value = thisPath
    errorMessage.value = ''
  }
}

const afterBlur = async () => {
  const trueOrErrorMessage = await isPathExist(path.value)
  errorMessage.value = trueOrErrorMessage === true ? '' : trueOrErrorMessage
}
</script>

<template>
  <div class="flex">
    <button
      class="inline-block p-4 font-mono text-sm font-bold text-gray-900 border-2 border-black rounded-l-lg cursor-pointer focus:outline-none bg-slate-300 hover:bg-slate-700 hover:text-white"
      type="button"
      @click="inputFileRef?.click()"
    >
      choose folder path
      <input
        @change="getFolderPath"
        ref="inputFileRef"
        type="file"
        webkitdirectory
        class="hidden"
        id="file"
        name="file"
      />
    </button>
    <input
      @blur="afterBlur" 
      v-model="path"
      class="flex-1 px-4 border-2 border-l-0 border-black rounded-r-lg "
    />
  </div>
</template>
