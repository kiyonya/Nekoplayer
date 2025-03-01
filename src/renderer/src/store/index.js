import state from './state'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'
import { createStore } from 'vuex'
const store = createStore({
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters
})
export {store};