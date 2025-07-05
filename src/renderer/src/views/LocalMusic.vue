<template>
  <div class="page">
    <div class="head">
      <h1 class="title">本地音乐库</h1>
      <button @click="showGroupCreator = true"> 创建</button>
      <button> 目录</button>
    </div>
    <div class="groups g-shell-6">
      <div class="group" v-for="group in groups"
        @click="$router.push({ name: 'LocalMusicGroup', params: { id: group.groupId } })" :key="group.groupId">
        <div class="cover-shell">
          <img :src="getCover(group?.cover)" alt="" class="cover" v-if="group?.cover">
          <div class="no-cover" v-if="!group.cover" :style="{ background: getRandomLinearGradient() }">
          </div>
          <Icon icon="material-symbols:star-rounded" class="stared" v-if="group?.detail?.star" />
        </div>
        <h2 class="name">{{ group?.detail?.name }}</h2>
        <span class="count">共 {{ group?.songCount }} 首</span>

        <ContextMenu :menu="[
          { label: '重命名', act: 'rename', icon: 'fluent:rename-16-regular' },
          { label: group?.detail?.star ? '取消星标' : '设为星标', act: 'star', icon: 'material-symbols:star-rounded' },
          { label: '删除音乐集', act: 'del', icon: 'material-symbols:delete-outline' }
        ]" @select="(s) => handleGroupContextMenu(group?.groupId, s)" />
      </div>
    </div>
    <ModalWindow v-if="showGroupCreator" @close="showGroupCreator = false" :title="'创建本地音乐集'">
      <span class="modal-window-tip-span">请输入音乐集名称</span>
      <input type="text" class="modal-window-input" v-model="createGroupConfig.name">
      <div class="modal-window-display-flex-row-temp">
        <input type="checkbox" name="redheart" id="redheart" class="modal-window-checkbox"
          @change="($event) => { createGroupConfig.star = $event.target.checked }">
        <label for="redheart" style="color: var(--text-o-2);">标记为星标</label>

      </div>
      <div class="modal-window-button-group">
        <button @click="showGroupCreator = false">取消</button>
        <button class="strong" @click="createGroup()">创建</button>
      </div>
    </ModalWindow>



  </div>
</template>
<script setup>
import { localMusic } from '@/main';
import { onMounted } from 'vue';
import ModalWindow from '@/components/windows/ModalWindow.vue';
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { onActivated } from 'vue';
import ContextMenu from '@/components/ContextMenu/ContextMenu.vue';
import { showConfirmDialog, showInputConfirmDialog } from '@/components/notification/use_notification';

const showGroupCreator = ref(false)
const groups = ref([])
const createGroupConfig = ref({
  name: '',
  star: ''
})
onActivated(() => {
  load()

})
function createGroup() {
  if (createGroupConfig.value.name) {
    localMusic.createGroup(createGroupConfig.value).then(group => {
      groups.value.push(group)
      createGroupConfig.value = {
        name: '',
        star: ''
      }
      showGroupCreator.value = false
    })
  }

  // localMusic.createGroup('测试音频组').then(group=>{
  //   groups.value.push(group)
  // })
}
function load() {
  localMusic.getGroups().then((res) => {
    groups.value = res
  })

}
function clear() {
  localMusic.clearAllGroups().then((res) => {
    groups.value = []
  })
}
function getCover(array, mime = 'image/jpeg') {
  const blob = new Blob([array], { type: mime });
  const url = URL.createObjectURL(blob);
  return url
}
function getRandomLinearGradient() {
  const baseHue = Math.floor(Math.random() * 360);
  const baseSat = 70 + Math.floor(Math.random() * 30); // 70-100% 饱和度
  const baseLight = 40 + Math.floor(Math.random() * 30); // 40-70% 亮度
  const hueVariation = 10 + Math.floor(Math.random() * 20);
  const secondHue = (baseHue + hueVariation * (Math.random() > 0.5 ? 1 : -1)) % 360;
  const secondSat = Math.min(100, baseSat + (Math.random() * 20 - 10));
  const secondLight = Math.min(80, baseLight + (Math.random() * 20 - 10));
  const color1 = `hsl(${baseHue}, ${baseSat}%, ${baseLight}%)`;
  const color2 = `hsl(${secondHue}, ${secondSat}%, ${secondLight}%)`;
  const angle = Math.floor(Math.random() * 360);
  return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
}

async function handleGroupContextMenu(gid, e) {
  if (e.act === 'rename') {
    changeGroupName(gid)
  } else if (e.act === 'star') {
    let isStared = await localMusic.isGroupStared(gid)
    if (isStared) {
      localMusic.starGroup(gid, false)
    }
    else {
      localMusic.starGroup(gid, true)
    }
    modifyGroupDetial(gid, 'star', !isStared)
  }
  else if (e.act === 'del') {
    let choice = await showConfirmDialog("删除音乐集", "确定要删除这个音乐集吗，这不会删除本地文件,但是这个音乐集可能会消失很久,真的很久.......")
    if (choice === 'yes') {
      localMusic.deleteGroup(gid).then(() => {
        for (let i in groups.value) {
          if (groups.value[i].groupId === gid) {
            groups.value.splice(i, 1)
          }
        }
      })
    }
  }
}
async function changeGroupName(gid) {
  let input = await showInputConfirmDialog("重命名音乐集", "请输入音乐集名称")
  if (input?.act === 'yes') {
    let name = input?.value
    let time = await localMusic.renameGroup(gid, name)
    modifyGroupDetial(gid, 'name', name, time)
  }
}

function modifyGroupDetial(groupId, key, value, time) {
  for (let group of groups.value) {
    if (group.groupId === groupId) {
      group.detail[key] = value,
        group.detail.updated = time || Date.now()
    }
  }
}
</script>
<style scoped>
.page {
  gap: 1rem;
}

.head {
  width: 92%;
  height: fit-content;
  margin-top: 2rem;
  display: flex;
  flex-direction: row;
  gap: 1.2rem;

  .title {
    font-size: 1.8rem;
    letter-spacing: 2px;
    margin-left: 0;
    margin-right: auto;
  }

  button {
    width: fit-content;
    height: fit-content;
    padding: 0.5rem 1.5rem;
    background: var(--ui);
    color: var(--text-o-1);
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 15px;
  }

}

.groups {
  width: 92%;

}

.group {
  display: flex;
  flex-direction: column;
  min-width: 0;
  user-select: none;
  cursor: pointer;

  .cover-shell {
    width: 100%;
    height: fit-content;
    position: relative;

    .cover {
      width: 100%;
      aspect-ratio: 1/1;
      object-fit: cover;
      border-radius: var(--br-2);
    }

    .no-cover {
      width: 100%;
      aspect-ratio: 1/1;
      background-color: var(--ui);
      border-radius: var(--br-2);
      position: relative;

      .i {
        position: absolute;
        left: 0.6rem;
        bottom: 0.6rem;
      }
    }

  }

  .name {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--text-o-1);
    margin-left: 0;
    margin-right: auto;
    margin: 0;
  }

  .count {
    font-size: 0.8rem;
    color: var(--text-o-4);
    margin-left: 0;
    margin-right: auto;
  }

  .stared {
    font-size: 2.5rem;
    color: gold;
    position: absolute;
    right: 0.3rem;
    top: 0.3rem;
  }
}
</style>