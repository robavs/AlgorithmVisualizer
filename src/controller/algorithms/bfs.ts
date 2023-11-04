import { GridCell, ItemType } from "../../model";
import { coords, isValid } from "./utils";
import { matrixCell } from "../../view/gridTable";
import { BehaviorSubject, Observable, Subscription, interval, of, tap } from "rxjs";

// mora vidim kako da ne porsledjujem kao argument vec da ih prensem preko import/export
export const bfs = (grid: GridCell[][], tableCells: HTMLTableCellElement[]): void => {
    const queue: Array<[number, number]> = []
    const isCheeseFound$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === ItemType.Mouse)
                queue.push([i, j])
        }
    }

    const intervalSubsription: Subscription = interval(500)
        .pipe(
            tap(() => {
                if (queue.length)
                    findSafeCells()
            })
        )
        .subscribe()

    // treba da se proveri ako nije uopste nadjen da se i tada ukine subsrkipcija
    isCheeseFound$.subscribe({
        next: (isFound: boolean) => {
            if (isFound)
                intervalSubsription.unsubscribe()
        }
    })

    const findSafeCells = () => {
        const size: number = queue.length
        for (let i = 0; i < size; i++) {
            const [x, y] = queue.shift() as [number, number]
            for (const [dx, dy] of coords) {
                const newX: number = x + dx
                const newY: number = y + dy
                if (isValid(newX, newY, grid) && grid[newX][newY] !== ItemType.Wall) {
                    if (grid[newX][newY] === ItemType.Cheese) {
                        matrixCell[newX][newY].classList.add("found")
                        isCheeseFound$.next(true)
                        return
                    }
                    if (!grid[newX][newY]) {
                        matrixCell[newX][newY].classList.add("visited")
                        queue.push([newX, newY])
                        grid[newX][newY] = ItemType.Wall
                    }
                }
            }
        }
    }
}