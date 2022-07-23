<script setup lang="ts">
import { ref, computed } from 'vue'
import { TabGroup, TabList, Tab } from '@headlessui/vue'

const props = defineProps<{
  tabList: Array<{
    key: string,
    value: number
  }>
}>()
const emit = defineEmits(['update:mode'])

const selectedTab = ref(0)

const changeTab = (index: number) => {
  emit('update:mode', props.tabList[index])
}

const borderClass = computed(() => 
  (index: number) => {
      const length = props.tabList.length
      if (index === 0) return 'rounded-l-lg'
      if (index === length - 1) {
        return 'rounded-r-lg !border-r-2'
      }
      return ''
  }
)

</script>

<template>
  <div v-if="props.tabList.length">
    <TabGroup :selectedIndex="selectedTab" @change="changeTab">
      <TabList class="flex">
        <Tab
          as="template"
          v-slot="{ selected }"
          v-for="(item, index) in props.tabList"
        >
          <button
            :key="item.key"
            :class="[
              selected ? ' bg-slate-300' : 'bg-white',
              borderClass(index)
            ]"
            class="py-1.5 px-6 border-black border-2 flex-1 border-r-0"
          >
            {{ item.key }}
          </button>
        </Tab>
      </TabList>
    </TabGroup>
  </div>
  <div v-else class="py-1.5 px-6 border-black border-2 rounded-lg">
    empty list, please check main folder ↑ have some language folder 
  </div>
</template>