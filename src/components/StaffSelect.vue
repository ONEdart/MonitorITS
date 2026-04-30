<template>
  <select
    class="form-select"
    :value="modelValue"
    @change="$emit('update:modelValue', ($event.target).value)"
  >
    <option value="">— Select Staff —</option>
    <option v-for="s in staffList" :key="s.id" :value="s.id">{{ s.name }}</option>
  </select>
</template>

<script setup>
import { computed } from 'vue'
import { useStaff } from '@/composables/useStaff'

const props = defineProps({ modelValue: String })
defineEmits(['update:modelValue'])
const { staffList, fetchAll } = useStaff()
fetchAll()
</script>