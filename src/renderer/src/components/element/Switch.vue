<template>
    <input type="checkbox" name="" id="" class="switch" :style="`--w:${width}`" @change="onchange($event)" :checked="modelValue">
</template>
<script>
export default {
    name:"Switch",
    props:{
        width:{
            type:String,
            default:'2.8rem'
        },
        modelValue:{
            require:true,
            type:Boolean,
            default:false
        }
    },
    methods:{
        onchange(e){
            this.$emit('update:modelValue',e.target.checked)
        }
    },
    emits:['update:modelValue']
}
</script>
<style scoped>
.switch {
    width: var(--w);
    height: calc(var(--w) / 2);
    background: var(--ui);
    appearance: none;
    border-radius: 1.8rem;
    border: 1px solid #0000003f;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .2s ease-in-out;
}

.switch::before {
    height: 90%;
    aspect-ratio: 1/1;
    content: "";
    position: absolute;
    border-radius: 50%;
    left: calc(var(--w) / 2 * 0.05);
    top: calc(var(--w) / 2 * 0.05);
    background-color: #ffffff;

}

.switch:checked {
    background: var(--strong);
}

.switch:checked::before {
    left: auto;
    right: calc(var(--w) / 2 * 0.05);
}
</style>