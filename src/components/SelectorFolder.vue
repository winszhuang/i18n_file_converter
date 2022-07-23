<script setup lang="ts">
import { ref } from 'vue'
import { useVModel } from '@vueuse/core'

const props = withDefaults(defineProps<{
  path?: string
}>(), {
  path: ''
})
const emit = defineEmits(['update:path'])

const path = useVModel(props, 'path', emit)
const inputFileRef = ref<HTMLElement>()

const getFolderPath = (e: Event) => {
  const fileList = (e.target as HTMLInputElement)?.files

  if (fileList && fileList.length) {
    const firstFile = fileList[0]
    const selectFolderName = firstFile.webkitRelativePath.split('/')[0]
    const thisPath = firstFile.path.split(selectFolderName)[0] + selectFolderName

    path.value = thisPath
  }
}
</script>

<template>
    <div class="flex">
      <button
        class="inline-block py-1.5 px-3 text-sm text-gray-900 border-black rounded-l-lg cursor-pointer bg-gray-50  focus:outline-none border-2 font-mono font-bold"
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
        v-model="path"
        class="flex-1 px-4 border-2 border-l-0 border-black rounded-r-lg "
      />
    </div>
</template>
