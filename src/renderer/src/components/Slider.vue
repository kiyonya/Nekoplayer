<template>

    <input
      type="range"
      name="slider"
      class="slider-bar"
      max="1"
      min="0"
      step="0.0001"
      @input="changeValue($event)"
      :style="`--progress:${progress * 100}%`"
      v-model="this.ivalue"
    />

</template>
<script>
export default {
  data() {
    return {
      timer: null,
      ivalue: 0,
      progress: 0
    }
  },
  methods: {
    changeValue(e) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$emit('slider', e.target.value)
      }, this.debonunce || 0)
    }
  },
  watch: {
    value: {
      handler(n, o) {
        this.progress = this.value / this.total ? this.value / this.total : 0
        this.ivalue = this.progress.toFixed(10)
      },
      immdediate:true
    }
  },
  props: ['debonunce', 'value', 'total','module']
}
</script>
<style>
.slider-bar[type='range'] {
  --progress: 50%;
  height: 100%;
  width: 100%;
  position: absolute;
  appearance: none;
  background: #ff0;
  background: linear-gradient(90deg, var(--l), var(--r) 75%) no-repeat var(--b);
  background-size: var(--progress) 100%;
  border-radius: 5px;
  transition:  .2s ease-in-out;
}
.slider-bar[type='range']::-webkit-slider-thumb {
  appearance: none;
  -webkit-appearance: none;
  background-color: #fff;
  height: 1.3cqh;
  aspect-ratio: 1/1;
  border-radius: 50%;
  box-shadow: 1px 1px 2px #00000018;
  opacity: 0;
}

.slider-bar[type='range']:hover::-webkit-slider-thumb {
  opacity: 1;
}
</style>
