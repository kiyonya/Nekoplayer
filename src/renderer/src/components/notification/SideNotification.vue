<template>
    <Teleport to="body">
        <div class="notification" @click="handleClick">
            <span class="title">{{ title }}</span>
            <span class="content">{{ content }}</span>
        </div>
    </Teleport>
</template>
<script>
export default {
    name: 'SideNoticification',
    props: {
        title: {
            type: String,
            default: '通知信息'
        },
        content: {
            type: String,
            default: "通知内容"
        }
    },
    emits: ['click'],
    methods: {
        handleClick() {
            this.$emit('click', () => {
                this.visible = false;
            });
        }
    },
    data() {
        return {
            visible: true
        };
    },
}
</script>
<style scoped>
.notification {
    width: fit-content;
    height: fit-content;
    min-width: 16rem;
    min-height: 6rem;
    box-sizing: border-box;
    padding: 1rem;
    border-radius: var(--br-2);
    background-color: var(--component);
    box-shadow: var(--shadow);
    position: fixed;
    right: 1.5rem;
    bottom: 5rem;
    z-index: 9999999;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    animation: slide-in .3s;
}

.title {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--strong);
    
}

.content {
    font-size: 1rem;
    font-weight: 500;
    color: var(--text-o-3);
}

@keyframes slide-in {
    from {
        transform: translateX(100%);
    }

    to {
        transform: translateX(0);
    }
}
</style>