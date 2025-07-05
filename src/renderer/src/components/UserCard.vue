<template>
    <div class="user" @click="$router.push({name:'User',params:{id:id}})">
        <img class="avatar" :src="resize(avatar,150)" alt="">
        <div class="info">
            <p class="name text-limit">{{ name }}</p>
            <p class="sign text-limit" style="max-width: 10rem;">{{ sign }}</p>
        </div>
    </div>
</template>
<script>
import { resize } from '@/utils/imageProcess';
export default {
    props:['id','name','sign','avatar'],
    methods:{
        resize
    }
}
</script>
<style scoped>
.user {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 10px;
    min-width: 0;
}
.user .avatar {
    width: 8.5rem;
   aspect-ratio: 1/1;
   object-fit: cover;
    border-radius: 50%;
}
.user .info {
    text-align: center;
    margin-top: 10px;
}
.user .name {
    font-size: 1.3rem;
    font-weight: bold;
    color: var(--text-o-1);
}
.user .sign {
    font-size: 0.9rem;
    color: var(--text-o-3);
}
</style>