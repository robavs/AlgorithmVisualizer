import { BehaviorSubject, debounceTime, fromEvent, switchMap, tap } from "rxjs";
import { sudokuTable } from "./sudokuTable";
import { isValidSudoku } from "../../controller/algorithms/sudoku";
import { solveSudoku } from "../../controller/algorithms/sudoku";

export function sudokuView() {
    sudokuTable()

    const cells = [...document.querySelectorAll(".sudoku-cell")] as HTMLInputElement[]
    const sudokuTable$: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>(Array(9).fill(-1).map(() => Array(9).fill(-1)))
    const isSolvable$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

    const h1 = document.createElement("h1")
    h1.textContent = "Sudoku is solvable"
    document.body.appendChild(h1)

    const solveBtn = document.createElement("div")
    solveBtn.classList.add("solve-btn")
    solveBtn.textContent = "Solve"
    document.body.appendChild(solveBtn)

    fromEvent(solveBtn, "click")
        .pipe(
            switchMap(() => {
                return solveSudoku(sudokuTable$.value)
            }),
            tap((boardSolution) => {
                for (let i = 0; i < 9; i++) {
                    for (let j = 0; j < 9; j++) {
                        // i * 9 + j zato sto ih preuzima po rows seknvecijalno
                        cells[i * 9 + j].value = String(boardSolution[i][j])
                    }
                }
            })
        )
        .subscribe()


    fromEvent(cells, "keyup")
        .pipe(
            tap((cell) => {
                const element = cell.currentTarget as HTMLInputElement
                let value = Number(element.value)

                const x: number = Number(element.getAttribute("x"))
                const y: number = Number(element.getAttribute("y"))

                if (value < 0 || value > 9) {
                    element.style.border = "2px solid red"
                    isSolvable$.next(false)
                }
                else element.style.border = ""

                // jer kad se brise onda je value = 0
                value = value || -1

                sudokuTable$.value[x][y] = value
                sudokuTable$.next(sudokuTable$.value)
            })
        )
        .subscribe()

    sudokuTable$.subscribe({
        next: (sudokuTable) => {
            isSolvable$.next(isValidSudoku(sudokuTable))
        }
    })

    isSolvable$.subscribe({
        next: (isSolvable) => {
            solveBtn.style.pointerEvents = isSolvable ? "auto" : "none"
            solveBtn.style.opacity = isSolvable ? "1" : "0.5"
            h1.textContent = "Sudoku is " + (isSolvable$.value ? "solvable" : " not solvable")
        }
    })
}