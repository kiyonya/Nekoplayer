<template>
    <div class="page">
        <!--<MyStyleReport></MyStyleReport>-->
        <div class="style-list" >
            <div class="p-title"><img src="@/assets/images/styles.svg" alt=""><span>曲风列表</span>
            </div>
            <div class="style-tag-shell">
                <RouterLink style="margin-right: 1rem;" class="strong" :to="{path:`/discover/musicstyle/0`}">我的曲风</RouterLink>
                <RouterLink v-for="style in ms" :to="{path:`/discover/musicstyle/${style.id}`}">{{ style.name }}</RouterLink>
            </div>
        </div>
            <MusicStyleViewer class="page" :key="route.params.id"></MusicStyleViewer>
    </div>
</template>
<script setup>
import MusicStyleViewer from '@/components/MusicStyleViewer.vue';
import { useRoute } from 'vue-router';
import ms from '@/assets/data/musicstyle.json'
const route = useRoute()
const warpStyles = true
</script>
<style scoped>
.style-list {
    width: 95%;
    height: fit-content;
    flex-direction: column;
    display: flex;align-items: center;justify-content: center;
    padding: 1.5rem 0 1.5rem 0;
}
.style-list::-webkit-scrollbar{
    display: none;
} 
.style-list .style-tag-shell {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
}
.style-list .style-tag-shell  a{
    width: fit-content;
    background-color: var(--app-theme-component);
    text-align: center;
    font-size: 1.1cqw;
    padding: 0.45rem 1.2rem;
    border-radius: 5px;
    font-weight: bold;
    opacity: var(--text-opacity-3);
    cursor: pointer;
    box-shadow: 1px 1px 8px #0000001c;
    border: var(--app-theme-component) 1px solid;
    text-decoration: none;
    color: var(--app-text);
}
.style-list .style-tag-shell .strong{
    background-color: var(--app-theme-strong-background);
    border:  none;
    opacity: var(--text-opacity-2);
}
</style>