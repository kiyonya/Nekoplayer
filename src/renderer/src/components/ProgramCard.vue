<template>
    <div class="program-card">
        <div class="cover">
            <img :data-src="cover" alt="" class="main" v-lazy>
            <img :data-src="cover" alt="" class="blur" v-lazy>
            <div class="playcount">
                <Icon icon="ri:headphone-line" class="icon" />
                <span>{{ playcount }}</span>
            </div>
        </div>
        <h1 class="name">{{ name }}</h1>
    </div>
</template>

<script>
import { Icon } from '@iconify/vue';
    export default{
        props:['name','cover','id','playcount'],
        components:{Icon}
    }
</script>
<style scoped>
.program-card{
    width: 100%;
    height: fit-content;
    min-width: 0;
    position: relative;
  display: flex;
  flex-direction: column;
  color: var(--text-o-1);
  backdrop-filter: blur(4px);
}
.program-card:hover .blur {
  bottom: -0.6rem;
  opacity: 0.4;
  transition: 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.program-card:hover .main {
  transform: scale(1.01);
  transition: 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.cover {
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 5px;
  box-shadow: 1px 1px 5px #00000010;
  filter: brightness(0.95);
  transition: 0.2s;
  position: relative;
  display: flex;
  justify-content: center;
}
.cover img {
  width: 100%;
  aspect-ratio: 1/1;
  position: absolute;
  border-radius: 5%;
}
.cover .blur {
  width: 95% !important;
  filter: blur(10px);
  z-index: -1;
  bottom: -0.2rem;
  opacity: 0.3;
}
.playcount{
    position: absolute;
    z-index: 5;
    right: 0.8rem;
    top: 0.8rem;
    color: inherit;
    display: flex;
    align-items: center;
    gap: 0.3rem;

    .icon{
        width: 1.3em;
        height: 1.3em;
        color: inherit;
    }

    span{
        font-size: 0.9rem;
    }
}
.name{
    font-size: 1.1rem;
    margin-top: 0.5rem;
    position: relative;

z-index: 6}
</style>