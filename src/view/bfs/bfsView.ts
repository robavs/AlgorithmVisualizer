import { gridTableFunctions } from "../../controller/baseFunctions";
import { ItemType } from "../../model";
import { createGridTable } from "./gridTable";

export function bfsView(): void {
    const icons: string[] = [ItemType.Cheese, ItemType.Wall, ItemType.Mouse]
    const startBtn = document.createElement("div")
    startBtn.classList.add("start-btn")
    startBtn.textContent = "Start"
    document.body.appendChild(startBtn)

    icons.forEach(icon => {
        const iconImage = document.createElement("img") as HTMLImageElement
        iconImage.classList.add("icon")
        iconImage.src = `src/assets/images/${icon.toLowerCase()}.png`
        iconImage.alt = icon
        document.body.appendChild(iconImage)
    })

    createGridTable()
    gridTableFunctions()
}