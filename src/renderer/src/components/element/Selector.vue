<template>
    <div class="selector">
        <select name="" id=""  @change="onchange($event)" :value="value" class="select" @focus="open = true" @blur="open = false">
        <option :value="opt.act" v-for="opt in options">{{ opt.label }}</option>
        
    </select>
    <Icon icon="mingcute:up-line" class="arrow" :class="{'arrow-down':!open}" />
    </div>
    
</template>
<script>
import { Icon } from '@iconify/vue';
export default {
    data(){
        return{
            open:false,
        }
    },
    name:"Selector",
    components:{
        Icon
    },
    props:{
        options:{
            type:Array,
            require:true
        },
        value:{
            type:String
        }
    },
    methods:{
        onchange(e){
            this.$emit('select',e.target.value)
        }
    },
    emits:['select']
}

</script>
<style scoped>
.selector{
    width: fit-content;
    height: fit-content;
    position: relative;
    display: flex;
    align-items: center;
}
.arrow{
    font-size: 1.5rem;
    position: absolute;
    right: 0.2rem;
    pointer-events: none;
    transition: .3s;
}
.arrow-down{
    transform: rotate(180deg);
}
.select{
  min-width: 10rem;
  width: fit-content;
  max-width: 40rem;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  outline: none;
  padding: 0.5rem 0.7rem;
  border-radius: 0.3rem;
  color: var(--text-color);
  background: var(--ui-dark);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  transition: .3s;
}
.select:hover{
  background: var(--hover);
}
.select option{
  font-size: 1rem;
}
.select:focus{
    outline: 1px solid var(--strong);
}
</style>