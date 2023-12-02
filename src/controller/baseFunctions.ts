import { BehaviorSubject, Observable, combineLatest, fromEvent, map, tap } from "rxjs"
import { GridCell, ItemType } from "../model"
import { bfs } from "./algorithms/bfs"
// treba napravim da mozes da dodas samo jednog misa i samo jedan sir!!!

export const gridTableFunctions = (): void => {
    const icons = [...document.querySelectorAll(".icon")] as HTMLImageElement[]
    const startBtn = document.querySelector(".start-btn") as HTMLDivElement

    const isMousePlaced$ = new BehaviorSubject<boolean>(false)
    const isCheesePlaced$ = new BehaviorSubject<boolean>(false)

    // razmisli da l mozda da stavim da mi tableCells bude BehaviourSubject
    const isPlacingAllowed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
    const tableCells = [...document.querySelectorAll(".cell")] as HTMLTableCellElement[]
    const grid: GridCell[][] = Array(15).fill(0).map(() => Array(40).fill(null))

    isCheesePlaced$.subscribe({
        next: (isPlaced: boolean) => {
            const cheese = icons.filter(img => img.alt === "Cheese")[0]
            cheese.style.opacity = isPlaced ? "0.5" : "1"
            cheese.style.pointerEvents = isPlaced ? "none" : "auto"
        }
    })

    isMousePlaced$.subscribe({
        next: (isPlaced: boolean) => {
            const mouse = icons.filter(img => img.alt === "Mouse")[0]
            mouse.style.opacity = isPlaced ? "0.5" : "1"
            mouse.style.pointerEvents = isPlaced ? "none" : "auto"
        }
    })

    // onemogucava da imas drag event za elemente koji se vec nalaze na tabeli
    fromEvent(tableCells, "dragstart")
        .pipe(
            tap((event) => event.preventDefault())
        )
        .subscribe()

    // brisanje se vrsi pomocu desnog klika
    // mozda da napravim da se prikaze neka ikonica na taj element kad predjem preko njega
    // da bi se obrisao
    fromEvent(tableCells, "contextmenu").pipe(
        tap(event => {
            event.preventDefault()
            const cell = event.currentTarget as HTMLTableCellElement
            if (!cell.childNodes.length) return

            if ((cell.childNodes[0] as HTMLImageElement).alt === "Cheese")
                isCheesePlaced$.next(false)
            else if ((cell.childNodes[0] as HTMLImageElement).alt === "Mouse")
                isMousePlaced$.next(false)

            // brisanje
            grid[Number(cell.getAttribute("x"))][Number(cell.getAttribute("y"))] = null
            cell.innerHTML = ""
        })
    ).subscribe()

    const selectedIcon$: Observable<HTMLImageElement> = fromEvent(icons, "dragstart")
        .pipe(
            tap(() => {
                isPlacingAllowed.next(false)
            }),
            map(event => event.currentTarget as HTMLImageElement)
        )

    // po deafaultu ne mogu elementi da se postavljaju preko drugih pa zato moras da disable
    fromEvent(tableCells, "dragover")
        .pipe(
            tap((event) => event.preventDefault())
        )
        .subscribe()

    const selectedCell$: Observable<HTMLTableCellElement> = fromEvent(tableCells, "drop")
        .pipe(
            tap(() => {
                isPlacingAllowed.next(true)
            }),
            map(event => event.currentTarget as HTMLTableCellElement)
        )

    combineLatest([selectedCell$, selectedIcon$])
        .subscribe({
            next: ([cell, selectedIcon]) => {
                if (!isPlacingAllowed.value || cell.childNodes.length) return
                const x: number = Number(cell.getAttribute("x"))
                const y: number = Number(cell.getAttribute("y"))

                if (selectedIcon.alt === "Cheese" && isCheesePlaced$.value ||
                    selectedIcon.alt === "Mouse" && isMousePlaced$.value
                )
                    return

                // mozda i ovo moze drugacije nekako
                if (selectedIcon.alt === "Cheese") {
                    grid[x][y] = ItemType.Cheese
                    isCheesePlaced$.next(true)
                }
                else if (selectedIcon.alt === "Wall") {
                    grid[x][y] = ItemType.Wall
                }
                else {
                    grid[x][y] = ItemType.Mouse
                    isMousePlaced$.next(true)
                }

                const imgIcon = document.createElement("img")
                imgIcon.classList.add("icon")
                imgIcon.alt = selectedIcon.alt
                imgIcon.src = selectedIcon.src
                cell.appendChild(imgIcon)
                isPlacingAllowed.next(false)
            }
        })

    fromEvent(startBtn, "click").subscribe({
        next: () => {
            bfs(grid)
        }
    })
}
