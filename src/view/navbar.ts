import { BehaviorSubject, fromEvent, tap } from "rxjs"
import { bfsView } from "./bfs/bfsView"
import { sudokuView } from "./sudoku/sudokuView"

const algorithmOptions: string[] = ["Breadth First Search", "Sudoku"]
const navBtnActive$: BehaviorSubject<string> = new BehaviorSubject<string>("")

export function createNavbar(): void {
    const navbar = document.createElement("nav")
    navbar.classList.add("navbar")

    algorithmOptions.forEach((option, index) => {
        const navBtn = document.createElement("div")
        navBtn.textContent = option
        navBtn.classList.add("navbar-btn")
        navBtn.classList.add("inactive")
        fromEvent(navBtn, "click").pipe(
            tap(() => {
                navBtnActive$.next(navBtn.textContent!)
                document.body.innerHTML = ""
                document.body.appendChild(navbar)
                if (navBtn.textContent === "Breadth First Search") {
                    bfsView()
                }
                else sudokuView()
            })
        ).subscribe()
        navbar.appendChild(navBtn)
    })

    navBtnActive$.subscribe({
        next: (selectedBtnText) => {
            navbar.childNodes.forEach(btn => {
                (btn as HTMLDivElement).classList.add(selectedBtnText === btn.textContent ? "active" : "inactive");
                (btn as HTMLDivElement).classList.remove(selectedBtnText === btn.textContent ? "inactive" : "active")
            })
        }
    })

    document.body.appendChild(navbar)
}