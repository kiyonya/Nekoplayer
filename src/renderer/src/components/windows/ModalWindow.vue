<template>
  <Teleport to="body">
    <div class="modal-backdrop" :style="props.mask ? 'background-color: rgba(0, 0, 0, 0.341);backdrop-filter: blur(1px);' : ''">
    <div class="modal_inner_window">
      <div class="window-control">
        <button @click.top="emits('close')" class="close-button"><Icon icon="material-symbols:close-rounded" class="icon" style="color: var(--text);"/></button>
      </div>
      <slot class="slot"></slot>
    </div>
  </div>
  </Teleport>
</template>
<script setup>
import { Icon } from '@iconify/vue'
const props = defineProps({
  mask:{
    type:Boolean,
    default:true
  }
})
const emits = defineEmits(['close'])
</script>
<style>
.modal-backdrop {
  width: 100vw;
  height: 100vh;
  display: flex;
  position: fixed;
  left: 0;
  top: 0;
  align-items: center;
  justify-content: center;
  z-index: 9999999999;
  
}
.modal_inner_window {
  padding: 1.5rem;
  width: auto;
  min-width: 30rem;
  height: fit-content;
  min-height: 20rem;
  position: absolute;
  z-index: 999;
  background-color: var(--component);
  border-radius: 0.9rem;
  box-shadow: var(--shadow-surround);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  backdrop-filter: blur(5px);
}
.modal_inner_window .window-control {
  width: 100%;
  position: relative;
}
.modal_inner_window .window-control .close-button{
  width: fit-content;
  height:fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  position: absolute;
  padding: 0rem 0rem;
  right: 0;
  min-width: 0;
  z-index: 9999;
  border-radius: var(--br-1);
}
.modal_inner_window .window-control .close-button:hover{
  background: var(--hover);
}
.modal_inner_window .window-control .close-button .icon {
  width: 2.1rem;
  height: 2.1rem;
  
  transition: 0.2s;
}
.modal_inner_window h1{
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--text-o-1);
}
.modal_inner_window span{
    width: fit-content;
    height: fit-content;
    font-size: 1.1rem;
    font-weight: 600;
    opacity: var(--text-opacity-2);
}
.modal_inner_window a{
    width: fit-content;
    height: fit-content;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-color);
    text-decoration: none;
}
.modal_inner_window a:hover{
    text-decoration: underline;
}
.modal_inner_window .strong-button{
    background: var(--app-theme-strong-background);
    color: white;
}
.modal_inner_window .warn-button{
    background: #f00;
    color: white;
}
.modal_inner_window button{
    width: fit-content;
    height: fit-content;
    padding: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    background: var(--hover);
    border-radius: 0.2rem;
    color: var(--text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-width: 4rem;
}
.modal_inner_window  .row{
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-content: center;
    align-items: center;
}
.modal_inner_window .self-bottom{
    margin-top: auto;
    margin-bottom: 0;
}
.modal_inner_window .to-right{
    justify-content: end;
}
.modal_inner_window .warn{
  color: rgb(255, 0, 0);
}
.modal_inner_window .warn-button{
  .color-button{
    background-color: aqua;
  }
}
</style>
