import { createI18n } from 'vue-i18n'
import zh_cn from './lang/zh_cn'
import zh_wy from './lang/zh_wy'
import en_us from './lang/en_us'
import ja_jp from './lang/ja_jp'
import mi_mi from './lang/mi_mi'
const i18n = createI18n({
  legacy: true, // 设置为 false，启用 composition API 模式
  locale: 'zh_cn',
  messages: {
    zh_cn,
    zh_wy,
    en_us,
    ja_jp,
    mi_mi,
  },
})
export default i18n
