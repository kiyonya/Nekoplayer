<template>
    <div class="podcast">
        <div class="headimg-ctn">
            <img :src="resize(cover,500)" alt="">
        </div>
        <div class="content">
            <h2 class="name">{{ name }}</h2>
            <span class="dj">{{ dj }}</span>
            <div class="songs">


            </div>
            <div class="bottom">
                <div class="chnnel text-limit">{{ channel }}</div>
                <div class="time">{{ getDate(updateTime) }}</div>
            </div>  
        </div>
    </div>
</template>
<script>
import { resize } from '@/utils/imageProcess';
import { getDate, mmss } from '@/utils/timers';

export default{
    props:['id','cover','songs','name','dj','channel','updateTime'],
    
}

</script>
<style scoped></style>