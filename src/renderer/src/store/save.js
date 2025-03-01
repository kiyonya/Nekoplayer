import {store} from ".";
const needSaveKey = ["playerData",'equalizerData','config','audioStatus']


export default function saveData(){
    for(let key in needSaveKey){
        localStorage(key,store.state[key].value)
        console.log(key,"已保存")
    }
}

function localStorage(key,value){
    localStorage.setItem(`neko_${key}`,JSON.stringify(value))
}