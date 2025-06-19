<template>
  <Teleport to="body">
    <div class="modal-backdrop" :style="props.mask ? 'background-color: rgba(0, 0, 0, 0.341);backdrop-filter: blur(1px);' : ''">
    <div class="modal_inner_window" :style="{minWidth:minWidth,minHeight:minHeight}">
      <div class="window-control">
        <button @click.top="emits('close')" class="close-button"><Icon icon="material-symbols:close-rounded" class="icon" style="color: var(--text);"/></button>
      </div>
      <h1 class="_h1_title">{{ title }}</h1>
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
  },
  title:{
    type:String,
  },
  minWidth:{
    type:String,
    default:"30rem"
  },
  minHeight:{
    type:String,
    default:"20rem"
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
  border-radius: 0.3rem;
  box-shadow: var(--shadow-surround);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  backdrop-filter: blur(5px);
  animation: window-in 0.2s ease-in-out;
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
@keyframes window-in {
  from {
    transform: scale(1.1);
    opacity: 0.5;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.modal_inner_window ._h1_title{
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--text-o-1);
    
}
.modal-window-button-group{
    display: flex;
    flex-direction: row;
    gap: 1rem;
    margin-top: auto;
    margin-bottom: 0;

    button {
        width: fit-content;
        height: fit-content;
        padding: 0.5rem 1.5rem;
        background: var(--ui);
        color: var(--text-o-1);
        font-size: 1rem;
        font-weight: 600;
        border: none;
        border-radius: 15px;
        flex: 1;
        &.normal {
            background-color: var(--ui-light);
            color: var(--text-o-4);
        }

        &.warn {
            background-color: rgb(223, 35, 35);
            color: white;
        }

        &.strong{
          background-color: var(--strong);
          color: var(--text-o-1);
        }
    }
}

.modal-window-input{
  width: 100%;
  background: var(--ui);
  padding: 0.5rem 0.8rem;
  box-sizing: border-box;
  font-size: 1rem;
  border: none;
  outline: 1px var(--border) solid;
  border-radius: var(--br-1);
  color: var(--text-o-1);
}
.modal-window-input:hover,.modal-window-input:focus{
  outline: 1px var(--strong) solid;
}

.modal-window-tip-span{
  font-size: 1rem;
  color: var(--text-o-3);

}

.modal-window-checkbox{
  width:1rem;
  height: 1rem;
  
}
.modal-window-display-flex-row-temp{
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}
</style>
