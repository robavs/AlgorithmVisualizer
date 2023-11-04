import { ItemType } from "../model"

const algorithmOptions: string[] = ["Depth first search", "Breadth First Search"]
const icons: string[] = [ItemType.Cheese, ItemType.Wall, ItemType.Mouse]

export function createNavOptions(): void {
    const navbar = document.createElement("nav")
    navbar.classList.add("navbar-options")

    algorithmOptions.forEach(option => {
        const radioInput = document.createElement("input")
        radioInput.type = "radio"
        radioInput.id = option
        radioInput.name = "algorithm"
        radioInput.value = option.toLowerCase().trim()
        navbar.appendChild(radioInput)

        const label = document.createElement("label")
        label.textContent = option
        label.htmlFor = radioInput.id
        navbar.appendChild(label)
    })

    const startBtn = document.createElement("div")
    startBtn.classList.add("start-btn")
    startBtn.textContent = "Start"
    navbar.appendChild(startBtn)

    icons.forEach(icon => {
        const iconImage = document.createElement("img") as HTMLImageElement
        iconImage.classList.add("icon")
        iconImage.src = `src/assets/images/${icon.toLowerCase()}.png`
        iconImage.alt = icon
        navbar.appendChild(iconImage)
    })

    document.body.appendChild(navbar)
}