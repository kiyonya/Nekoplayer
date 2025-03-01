<template>
    <div class="artist-card" @click="this.jump()">
        <img :src="this.cover + `?param=300y300`" alt="" class="bg" @error="this.$refs.ava.src = 'http://p3.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg?param=300y300'" ref="ava">
        <span class="name">{{ this.name }}</span>
    </div>
</template>
<script>
    export default{
        data(){
            return{

            }
        },
        methods:{
            jump(){
                this.$router.push({
                    name:'Artist',
                    params:{
                        id:this.id
                    }
                })
            }
        },
        props:['cover','name','id']
    }
</script>
<style scoped>
.artist-card{
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    transition: .2s;
}
.bg{
    width: 100%;
    aspect-ratio: 1/1;
    object-fit: cover;
    border-radius: 50%;
    box-shadow: 2px 2px 5px #00000014;
}
.name{
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: 0.5rem;
}
</style>