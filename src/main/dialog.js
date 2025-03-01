import { dialog } from "electron";
export async function useDialog(opt) {
    const dlg = dialog.showOpenDialog(opt)
}
