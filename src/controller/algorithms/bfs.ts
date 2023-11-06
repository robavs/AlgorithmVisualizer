import { Coords, GridCell, ItemType } from "../../model";
import { coords, isValid } from "./utils";
import { matrixCell } from "../../view/gridTable";
import { BehaviorSubject, Observable, Subscription, count, distinctUntilChanged, elementAt, filter, first, from, interval, last, map, of, scan, skip, switchMap, take, takeLast, takeUntil, tap } from "rxjs";

// mora vidim kako da ne porsledjujem kao argument vec da ih prensem preko import/export
export const bfs = (grid: GridCell[][]): void => {
    let queue$: Observable<Coords> = of([])
    const isCheeseFound$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
    const queueSize$: BehaviorSubject<number> = new BehaviorSubject<number>(1)

    for (let i = 0; i < grid.length; i++)
        for (let j = 0; j < grid[i].length; j++)
            if (grid[i][j] === ItemType.Mouse)
                queue$ = of([i, j])

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
            if (isFound)
                intervalSubscription$.unsubscribe()
        }
    })

    // mora i da se rekonstruise put pa da se onda pokrene neka nova animacija
    const nextSquares = (): void => {
        // moguce da cak i ovo moze preko nekog operatora da se uradi
        const newCoords: Coords[] = []

        queue$
            .pipe(
                take(queueSize$.value),
                switchMap(([x, y]: Coords) => {
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
                    if (grid[x][y] === ItemType.Cheese) {
                        matrixCell[x][y].classList.add("found")
                        isCheeseFound$.next(true)
                    }
                    if (!grid[x][y]) {
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