import { Coords, GridCell, ItemType } from "../../model";
import { coords, isValid } from "./utils";
import { matrixCell } from "../../view/bfs/gridTable";
import { BehaviorSubject, Observable, Subscription, filter, from, interval, of, switchMap, take, tap } from "rxjs";

export const bfs = (grid: GridCell[][]): void => {
    let queue$: Observable<Coords> = of([])
    const isCheeseFound$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
    const queueSize$: BehaviorSubject<number> = new BehaviorSubject<number>(1)
    const currentPath$: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>([])
    let shortestPath$: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>([])
    const gridPath: number[][][][] = []

    for (let i = 0; i < grid.length; i++) {
        gridPath[i] = []
        for (let j = 0; j < grid[i].length; j++) {
            gridPath[i][j] = [[i, j]]
            if (grid[i][j] === ItemType.Mouse) {
                queue$ = of([i, j])
                grid[i][j] = ItemType.Wall
            }
        }
    }

    const intervalSubscription$: Subscription = interval(250)
        .pipe(
            tap(() => {
                if (queueSize$.value)
                    nextSquares()
            })
        )
        .subscribe()

    // treba da se proveri ako nije uopste nadjen da se i tada ukine subsrkipcija

    isCheeseFound$.subscribe({
        next: (isFound: boolean) => {
            if (isFound) {
                intervalSubscription$.unsubscribe()

                // animacija za prikaz najkraceg puta
                const interval$: Subscription = interval(50).subscribe({
                    next: (index) => {
                        if (index < shortestPath$.value.length) {
                            const [x, y] = shortestPath$.value[index]
                            matrixCell[x][y].classList.add("shortest-path")
                        }
                        else interval$.unsubscribe()
                    }
                })
            }
        }
    })

    const nextSquares = (): void => {
        // moguce da cak i ovo moze preko nekog operatora da se uradi
        const newCoords: Coords[] = []

        queue$
            .pipe(
                take(queueSize$.value),
                switchMap(([x, y]: Coords) => {
                    currentPath$.next(gridPath[x][y])

                    const nextSquares: Coords[] = []
                    for (const [dx, dy] of coords) {
                        const newX: number = x + dx
                        const newY: number = y + dy
                        nextSquares.push([newX, newY])
                    }
                    return from(nextSquares)
                }),
                // mozda da vidim da se ne prosleduje grid nego da ga negde stavim u neki type
                filter(coords => isValid(coords, grid)),
                tap(([x, y]: Coords) => {
                    if (isCheeseFound$.value) return
                    gridPath[x][y] = [...currentPath$.value, [x, y]]
                    if (grid[x][y] === ItemType.Cheese) {
                        matrixCell[x][y].classList.add("found")
                        shortestPath$.next(gridPath[x][y])
                        isCheeseFound$.next(true)
                    }
                    else {
                        matrixCell[x][y].classList.add("visited")
                        grid[x][y] = ItemType.Wall
                        newCoords.push([x, y])
                    }
                })
            )
            .subscribe()

        queueSize$.next(newCoords.length)
        queue$ = from(newCoords)
    }
}