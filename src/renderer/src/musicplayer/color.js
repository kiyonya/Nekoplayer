
import ColorThief from "colorthief";
import { rgb2Hsl } from "../utils/color";
export async function getColor(img){

    let matchColor;
    let mainColor;
    let colors;
    const colorthief = new ColorThief(); 
    colors = await colorthief.getPalette(img);
    mainColor = await colorthief.getColor(img,6)
    for(const rgbArr of colors){
        matchColor = [255,255,255]
        if(rgb2Hsl(rgbArr)[2] > 0.4 && rgb2Hsl(rgbArr)[2] < 0.9 && rgb2Hsl(rgbArr)[1] > 0.6){
          matchColor = rgbArr
          break
        }
      }
    
    return {matchColor,mainColor,colors}  
}