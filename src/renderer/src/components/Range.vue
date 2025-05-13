<template>
  <div class="range">
    <input type="range" name="" id="" v-model="value" :min="min" :max="max" :step="step"/>
    <span>{{ value }}{{ sub }}</span>
  </div>
</template>
<script>
export default {
  props: ['min', 'max', 'step', 'sub','value'],
  data() {
    return {
      timer: null,
      value: void 0
    }
  },
  methods: {
    change(val) {
      this.value = val
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$emit('output', val)
      }, 100)
    }
  }
}
</script>
<style scoped>
.range {
  width: 80%;
  height: auto;
  display: flex;
  flex-direction: row;
  gap: 0.3rem;
  align-items: center;
}
span {
  font-size: 0.9rem;
  opacity: var(--text-opacity-3);
}
input{
    height: 4px;
    width: 100%;
}
</style>
