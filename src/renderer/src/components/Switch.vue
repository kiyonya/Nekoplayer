<template>
  <input
    type="checkbox"
    class="el-switch"
    :checked="value"
    @change="(e)=>{emits('change',e.target.checked)}"
  />
</template>
<script setup>
const props = defineProps(['value'])
const emits = defineEmits(['change'])
</script>
