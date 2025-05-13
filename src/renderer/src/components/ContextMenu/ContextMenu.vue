<template>
  <div ref="contextMenuRef" style="display: none;">
    <slot></slot>
    <Teleport to="body" defer>
      <Transition>
        <div v-if="showMenu" class="context-menu" :style="{
          left: pos.posX + 'px',
          top: pos.posY + 'px'
        }">
          <div class="menu-list" ref="list">
            <div class="menu-item" v-for="(item, i) in menu" :key="item.label" @click="handelClick(item)"
              :class="{ iamhr: item == 'hr' }" :style="item.style" v-show="!item?.disrender">
              <Icon v-if="item.icon" :icon="item.icon" />
              <span v-if="item.label">{{ item.label }}</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
<script setup>
import useContextMenu from '@/utils/useContextMenu'
import { computed, onMounted, ref } from 'vue'
import { useViewPort } from './useViewport'
import { Icon } from '@iconify/vue';
const props = defineProps({
  menu: {
    type: Array,
    default: () => []
  },
  mode: {
    type: String,
    default: () => "contextmenu"
  }
})
const contextMenuRef = ref(null)
const emit = defineEmits(['select'])
const { x, y, showMenu } = useContextMenu(contextMenuRef, props.mode)
const { vw, vh } = useViewPort()
const list = ref(null)
const pos = computed(() => {
  if (list.value) {
    let w = list.value.clientWidth
    let h = list.value.clientHeight
    let posX = x.value
    let posY = y.value
    if (x.value > vw.value - w - 60) {
      posX = x.value - w
    }
    if (y.value > vh.value - h - 60) {
      posY = y.value - h
    }
    return {
      posX,
      posY
    }
  }
  else {
    return { posX: 0, posY: 0 }
  }
})
function handelClick(item) {
  showMenu.value = false
  emit('select', item)
}
</script>
<style scoped>
.context-menu {
  position: fixed;
  background: var(--component);
  box-shadow: var(--shadow);
  box-sizing: border-box;
  min-width: 10rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  color: var(--text);
  line-height: 1.8;
  white-space: nowarp;
  overflow: hidden;
  z-index: 9999;
  width: auto;
  height: auto;
  padding: 0.7rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

}

.fit {
  width: 0px;
  height: 0px;
  overflow: hidden;
}

.menu-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.menu-item {

  padding: 0.1rem 0.4rem;
  border-radius: 0.2rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  gap: 0.3rem;
}

.menu-item:hover {
  background: var(--hover);
  font-weight: 600;
  color: var(--strong);
}

.v-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.v-enter-to {
  opacity: 1;
  transition: 0.1s;
}

.iamhr {
  opacity: 0.4;
  background: var(--text);
  padding: 0 0 !important;
  height: 1px;
  width: 90%;
  pointer-events: none;
  margin: 0.3rem auto;
}
</style>
