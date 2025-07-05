<template>
  <ModalWindow @close="store.commit('showEqualizer',false)" :title="'图形均衡器'">
    <div class="eq">
      <div class="toggle">
        <span class="tip">使用图形均衡器</span>
       <input type="checkbox" name="" id="" class="el-switch" :checked="useEQ" @change="e=>useEQ = e.target.checked">
      </div>
      <div class="control">
        <div class="cp" style="justify-content: space-between;">
          <span class="val">12db</span>
          <span class="val">0db</span>
          <span class="val">-12db</span>
        </div>
        <div class="cp" v-for="(item,index) in eq.equalizerFrequency">
          <span class="val">{{ eq.equalizerGains[index] }}</span>
          <VueSlider direction="btt" class="slider" v-model="eq.equalizerGains[index]" :min="-12" :max="12" :interval="1" :lazy="true"></VueSlider>
        <span class="frq">{{ item < 1000 ? item : item / 1000 + "k"}}Hz</span>
        </div>
      </div>
      <div class="presets">
        <span class="tip">使用预设</span>
        <select name="" id="" @change="e=>{
          eqGains = e.target.value
        }" :value="eqGains.join(',')">
          <option :value="pre.value" v-for="pre in eq.equalizerPreset">{{ pre.name }}</option>
        </select>
        
        <span class="tip" style="margin-left: 1.5rem;">均衡器质量</span>
        <select name="" id="" :value="Q" @change="e=>Q=e.target.value">
          <option value="3">高</option>
          <option value="2">均衡</option>
          <option value="1">标准</option>
        </select>
      </div>
    </div>
  </ModalWindow>
</template>
<script setup>
import { computed } from 'vue';
import ModalWindow from './windows/ModalWindow.vue'
import { store } from '@/store';
import VueSlider from 'vue-slider-component';
const useEQ = computed({
  get:()=>store.state.config.useEQ,
  set:(val)=>store.commit('config',{key:'useEQ',value:val})
})
const eq = computed(()=>{
  return store.state.equalizerData
})
const eqGains = computed({
  set:(val)=>store.commit("updateEqualizerGains",val.split(",").map(o=>parseInt(o))),
  get:()=>store.state.equalizerData.equalizerGains
})
const Q = computed({
  get:()=>store.state.equalizerData.equalizerQuality,
  set:(val)=>{store.commit('updateEqualizerQuality',parseInt(val))}
})
</script>
<style scoped>
.eq {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.eq .tip {
  color: var(--text-o-3);
}
.toggle{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.control{
 width: 100%;
 height: 15rem;
 display: grid;
 grid-template-columns: repeat(11,1fr);
 grid-template-rows: 1fr;
 gap: 0.2rem;
}
.cp{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: var(--text-o-3);
  align-items: center;
}
.cp .val,.frq{
  width: fit-content;
  height: 1.5rem;
  font-size: .9rem;
}
.control .slider{
  flex: 1;
}
select {
  color: var(--text-o-1);
  font-size: 1rem;
  padding: 0.3rem 0.7rem 0.3rem 0.3rem;
  background: var(--ui-light);
  width: 10rem;
  border: none;
  outline: none;
  border-radius: var(--br-1);
}
.presets{
  height: fit-content;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
}
</style>
