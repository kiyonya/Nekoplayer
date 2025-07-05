<template>
    <div class="voice-card" @click="$router.push({
        name: 'Program',
        params: {
            id: id
        }
    })">
        <img :src="cover" class="cover" >
        <div class="detail">
            <div class="sub-info">
                <span class="label" v-if="label && label[0]">{{ label[0] }}</span>
                <span class="playcount">{{ formatCount(count) }}</span>
            </div>

            <h3 class="name">{{ name }}</h3>
        </div>
    </div>
</template>
<script>
export default {
    name: "VoiceCard",
    props: ["name", "cover", "label", "count", "id"],
    methods: {
        formatCount(count) {
            if (count < 1000) { return count }
            else return (count / 10000).toFixed(1).toString() + "万"
        }
    }
}
</script>
<style scoped>
.voice-card {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    border-radius: var(--br-2);
    background: var(--component-diff);
    box-sizing: border-box;
    padding: 0.5rem;
    box-shadow: var(--shadow);
    backdrop-filter: blur(4px);
    .cover {
        width: 100%;
        aspect-ratio: 1/1;
        object-fit: cover;
        border-radius: var(--br-2);
    }

    .detail {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;

        .name {
            font-size: 1rem;
            font-weight: bold;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            color: var(--text-o-2);
        }

        .label {
            font-size: 0.8rem;
            color: var(--strong);
            box-sizing: border-box;
            padding: 0px 5px;
            border: var(--strong) 1px solid;
            width: fit-content;
            height: fit-content;
            border-radius: var(--br-1);
        }

        .sub-info {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .playcount {
            font-size: 0.8rem;
            color: var(--text-o-2);
            margin-left: auto;
            margin-right: 0;
        }
    }
}

.voice-card:hover {
    .cover {
        filter: brightness(0.7);
    }
}
</style>