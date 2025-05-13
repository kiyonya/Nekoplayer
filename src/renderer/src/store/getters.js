export default{
    getScroll(state,key){
        return state.viewScrollY[key] || 0
    }
}