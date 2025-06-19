export function paralleTask(tasks,paralleCount = 2){
  return new Promise((resolve,reject)=>{
    if(tasks.length < 0){
      resolve()
      return
    }
    let taskIndex = 0
    let fincount = 0
    function _run(){
      const task = tasks[taskIndex]
      taskIndex++
      task().then(()=>{
        fincount ++
        if(taskIndex < tasks.length){
          _run()
        }
        else if(fincount === tasks.length){
          resolve()
        }
      })
    }
    for(let i = 0;i < paralleCount && i< tasks.length;i++){
      _run()
    }
})
}