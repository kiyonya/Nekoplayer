import { BrowserWindow } from "electron"
export default class WindowManager{
    constructor(){
        this.windows = new Map()
    }
    createWindow(id,options){
        if(this.windows.has(id)){
            console.warn('window',id,'has already exist');
            return
        }
        const defaultOptions = {
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
            },
            ...options,
        };
        const window = new BrowserWindow(defaultOptions)
        this.windows.set(id,window)
        window.on('ready-to-show',()=>window.show())
        window.on('closed',()=>{
            this.windows.delete(id)
        })
        return window
    }
    getWindow(id) {
        return this.windows.get(id);
    }
    closeWindow(id) {
        const window = this.windows.get(id);
        if (window) {
            window.close();
        }
    }
    closeAllWindows() {
        this.windows.forEach((window, id) => {
            window.close();
        });
        this.windows.clear();
    }
    maximize(id){
        const window = this.windows.get(id);
        if (window) {
            if(window.isMaximized()){
                window.restore()
            }
            else{
                window.maximize()
            }
        }
    }
    minimize(id){
        const window = this.windows.get(id);
        if(window){
            if(window.isMinimizable() || !window.isMinimized()){
                window.minimize()
            }
        }
    }
}