import ColorThief from "colorthief";
import { rgb2Hsl } from "../../utils/color";
export async function getColor(img) {
    const colorthief = new ColorThief();
    const [colors, mainColor] = await Promise.all([
        colorthief.getPalette(img),
        colorthief.getColor(img, 6)
    ]);
    let matchColor = [255, 255, 255];
    const suitableColor = colors.find(rgbArr => {
        const [h, s, l] = rgb2Hsl(rgbArr);
        return l > 0.4 && l < 0.9 && s > 0.6;
    });
    if (suitableColor) {
        matchColor = suitableColor;
    }
    return { matchColor, mainColor, colors };
}