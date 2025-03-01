<template>
    <img src="" alt="" class="music-cover">
    <div class="song-info">
        <p class="song-name">{{ this.songName }}</p>
        <p class="song-artist">{{ this.so }}</p>
    </div>
    <img src="@/assets/images/play-solid.svg" alt="" class="play-btn">
</template>
<script>
export default {
    props: ['songName','songArtist']
}
</script>
<style></style>