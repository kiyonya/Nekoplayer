<template>
    <div class="page">
        <button @click="join">加入</button>
    </div>
</template>
<script setup>
import { createRoom } from '@/api/listentogether';
import {LT} from './listentogether';
function join(){
    LT.join('948d52725afadda41dd1e026ff54100a_1739776104','1438117139')
}
</script>
<style scoped>

</style>