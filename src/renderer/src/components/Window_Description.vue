<template>
  <div class="mask" @click="this.$emit('close', true)"></div>
  <div class="content">
    <img
      src="@/assets/images/sys-close.svg"
      alt=""
      class="i icon"
      @click="this.$emit('close', true)"
    />
    <div class="name">
      {{ this.title }}
      <div class="subname">{{ subname }}</div>
    </div>

    <div class="ctx">
      <div class="section" v-for="s in this.ctx">
        <h3 v-html="s.ti"></h3>
        <p v-html="s.txt.replace(/\n/gi, '<br>')"></p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    sdate(string) {
      const regexes = [
      /^(?:(?:[12]\d{3})|(?:(?<!\d)[1-9]\d{2}(?!\d)))年[0-1]?\d月[0-3]?\d日$/
      ];
      let res = string
      for (const reg in regexes) {
        const match = string.match(reg);
        if (match) {
          res = string.replace(
            reg,
            `<span style="color:var(--app-theme-strong)">${match[1]}</span>`
          );
        }
      }
      return res;
    },
  },
  props: ["title", "ctx", "subname"],
  emits: ["close"],
};
</script>
<style scoped>
@keyframes in {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
}

.subname {
  font-size: 0.8cqw;
  opacity: var(--text-opacity-4);
  font-weight: 400;
}

.content {
  width: 40vw;
  height: 30vh;
  position: fixed;
  background: var(--app-theme-component);
  z-index: 10000;
  left: calc(50% - 20vw);
  top: calc(50vh - 15vh);
  padding: 2rem 1.5rem 1.9rem 1.5rem;

  border-radius: 0.5cqw;
  animation: in 0.2s;
}

.content p,
h3,
span {
  user-select: text;
}

.ctx {
  width: 100%;
  height: 80%;
  overflow-y: auto;
}

.i {
  position: absolute;
  width: 1.8cqw;
  right: 1.2rem;
  top: 1.2rem;
}

.name {
  font-size: 1.5cqw;
  font-weight: 500;
  margin-bottom: 1cqw;
}

.section {
  width: 100%;
  height: fit-content;
  margin-bottom: 1cqw;
}

h3 {
  margin-bottom: 0.2cqw;
  color: var(--app-theme-strong);
}
</style>
