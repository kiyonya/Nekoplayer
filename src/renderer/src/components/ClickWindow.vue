<template>
  <div class="click-window" ref="window">
    <div class="click-window-ctx">
      <slot></slot>
    </div>
  </div>
</template>
<script>


export default {
  data() {
    return {
      offset: undefined,
    };
  },
  props: ["el"],
  emits: {},
  methods: {
    calcPosition(el) {
      const viewPosition = el.getBoundingClientRect();
      let elp = {
        top: viewPosition.top,
        left: viewPosition.left,
        right: viewPosition.right,
        bottom: viewPosition.bottom,
      };
      let w_width = this.$refs.window.clientWidth;
      let w_height = this.$refs.window.clientHeight;
      let pst = [
        _tryRender("lt"),
        _tryRender("rt"), 
        _tryRender("rb"), //优选右下
        _tryRender("lb"),
      ];
      if (pst[2]) {
        return _getPosition("rb");
      } else if (pst[1]) {
        return _getPosition("rt");
      } else if (pst[3]) {
        return _getPosition("lb");
      } else {
        return _getPosition("lt");
      }
      function _tryRender(p) {
        let result = [false, false];
        let index = p.split("");
        //LR判断
        if (index[0] === "l") {
          result[0] = elp.left - w_width > 0;
        } else {
          result[0] = elp.right + w_width < window.innerWidth;
        }
        //TB判断
        if (index[1] === "t") {
          result[1] = elp.top - w_height > 0;
        } else {
          result[1] = elp.bottom + w_height < window.innerHeight;
        }
        return result.every((item) => {
          return item === true;
        });
      }

      function _getPosition(p) {
        //输出css的left和top值
        const result = { left: 0, top: 0 ,origin:[]};
        const index = p.split("");
        if (index[0] === "l") {
          result.left = elp.left - w_width;
          result.origin[0] = 'right'
        } else {
          result.left = elp.right;
          result.origin[0] = 'left'
        }
        if (index[1] === "t") {
          result.top = elp.top - w_height;
          result.origin[1] = 'bottom'
        } else {
          result.top = elp.bottom;
          result.origin[1] = 'top'
        }
        return result
      }
    },

    closeWindow(event) {
      const mywindow = this.$refs.window;
      if (mywindow) {
        if (!mywindow.contains(event.target) && event.target !== this.el) {
          this.$emit("close", true);
        }
      }
    },
    init() {
      const offset = this.calcPosition(this.el);
      this.$refs.window.style.left = offset.left + "px";
      this.$refs.window.style.top = offset.top + "px";
      this.$refs.window.style.transformOrigin = offset.origin.join(' ')
    }
  },
  mounted() {
    this.init()
    document.addEventListener("click", this.closeWindow);
    window.addEventListener('resize',this.init)
  },
  beforeUnmount() {
    window.removeEventListener('resize',this.init)
    document.removeEventListener("click", this.closeWindow);
  },
};
</script>
<style >
@keyframes in {
    from{
        transform: scale(0);
    }
}
.click-window {
  position: fixed;
  z-index: 900;
  background: var(--component);
  width: fit-content;
  height: fit-content;
  padding: 0.3cqw 0.5cqw;
  display: flex;
  flex-direction: column;
  animation: in .2s;
  border-radius: 0.4cqw;
  min-width: 9cqw;
  box-shadow: 1px 1px 3px #0000002d;
}
.click-window-ctx{
    display: flex;
    flex-direction: column;
    align-items: start;
}
.click-window-ctx .button{
    padding: 0.5cqw 0.4cqw;
    width: 100%;
    background: transparent;
    border: none;
    color: var(--text);
    outline: none;
    font-size: 0.9cqw;
    display: flex;
    align-items: center;
    border-radius: 0.3cqw;
}
.click-window-ctx .button:hover{
    background:var(--hover) !important;
}
.click-window-ctx .ifix{
    width: 1.2cqw !important;
    margin-right: 0.3cqw;
}
.click-window-ctx hr{
    width: 100%;
    color: var(--border);
    opacity: 0.3;
    margin: 0.1cqw 0;
}
</style>
