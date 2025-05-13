<template>
  <div
    class="skeleton"
    :style="{
      width: width + 'px',
      height: height + 'px',
      aspectRatio:aspectRatio
    }"
  ></div>
</template>

<script>
export default {
  name: "Skeleton",
  props: {
    width: {
      type: [String, Number],
      default: '100%', // 默认宽度
    },
    height: {
      type: [String, Number],
      default: "auto", // 默认高度
    },
    aspectRatio:{
        type:[String],
        default:'1/1'
    }
  },
};
</script>

<style scoped>
.skeleton {
  background-color: var(--ui-light);
  border-radius: var(--br-2);
  animation: shimmer 1.5s infinite;
  position: relative;
  overflow: hidden;
  
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
}

</style>