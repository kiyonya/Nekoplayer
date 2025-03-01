<template>
    <div class="page">
        <h1 >尚在开发，暂不可用</h1>
        <div class="catelist">
        <div class="cates" :style="`overflow-y:${moreCate ? '' : 'hidden'}`">
            <span class="cate">精选</span>
            <span v-for="cate in catlist" class="cate">{{ cate?.name }}</span>
        </div>
        <button class="cate" @click="moreCate = !moreCate">{{ moreCate ? '收起' : '展开' }}</button>
    </div>
    <div class="body">
        <h2 class="title">猜你喜欢</h2>
        <div class="g-shell-6">
            <ProgramCard v-for="program in recommedProgram" :name="program?.name" :cover="program?.picUrl" :playcount="program?.subCount" :id="program?.id" :key="program?.id"></ProgramCard>
        </div>
    </div>
    </div>
</template>
<script setup>
import { getDjCatlist,getDjPersonalizeRecommend } from '@/api/dj';
import state from '@/store/state';
import { store } from '@/store';
import ProgramCard from '@/components/ProgramCard.vue';
import { computed } from 'vue';
import { ref } from 'vue';
import { onBeforeMount } from 'vue';
const dss = computed(()=>{
    return store.state.deviceScreenSize
})
const moreCate = ref(false)
const catlist = ref([])
const recommedProgram = ref([])
function load() {
    getDjCatlist().then(data => {
        console.log(data)
        catlist.value = data?.categories
    })
    getDjPersonalizeRecommend().then(data=>{
        recommedProgram.value = data?.data
    }) 
}
onBeforeMount(() => {
    load()
    
})
</script>
<style scoped>
.page{
    --page-width:92%;
    gap: 2rem;
}
.body{
    width: var(--page-width);
}
.title{
    font-size: 1.3rem;
    margin-bottom: 0.7rem;
}
.catelist{
    width: var(--page-width);
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    
}
.catelist button{
    width: fit-content;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: var(--text);
    .icon{
        width: 2em;
        height: 2em;
    }
}
.catelist button:hover{
    background: var(--hover);
}
.cates{
    flex: 1;
    display: inline-flex;
    flex-wrap: wrap;
    line-height: 1.5rem;
    height: calc(1.5rem + 1.1rem);
    gap: 1.2rem 1.5rem;
}.cates::-webkit-scrollbar{display: none;}
.catelist .cate{
    width: fit-content;
    height: fit-content;
    display: block;
    box-sizing: border-box;
    font-size: 1.1rem;
    padding: 0.5rem 0.6rem;
    background: var(--component-diff);
    border-radius: var(--br-1);
    line-break: loose;
    font-weight: 600;
    color: var(--text-o-2);
}
.catelist .cate:hover{
    background: var(--hover);
}
</style>