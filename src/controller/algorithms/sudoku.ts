import { BehaviorSubject, Observable, fromEvent, of, tap } from "rxjs"

function getSet(i: number, j: number, board: number[][]): number[] {
    const set: Set<number> = new Set(Array(9).fill(0).map((_, index) => index + 1))
    const a: number = 3 * Math.floor(i / 3)
    const b: number = 3 * Math.floor(j / 3)

    for (let x = 0; x < 9; x++) {
        set.delete(board[i][x])
        set.delete(board[x][j])
    }

    for (let x = a; x < a + 3; x++)
        for (let y = b; y < b + 3; y++)
            set.delete(board[x][y])
    return [...set]
}

export function solveSudoku(board: number[][]): Observable<number[][]> {
    const emptyCells: Array<[number, number]> = []
    let flag: boolean = true

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === -1)
                emptyCells.push([i, j])
        }
    }

    const backtrack = (index: number): void => {
        if (index >= emptyCells.length) {
            flag = false
            return
        }

        const set: number[] = getSet(emptyCells[index][0], emptyCells[index][1], board)

        if (set.length === 0) return

        for (let i = 0; i < set.length; i++) {
            let number: number = set[i]
            if (flag) {
                board[emptyCells[index][0]][emptyCells[index][1]] = number
                backtrack(index + 1)
                if (flag)
                    board[emptyCells[index][0]][emptyCells[index][1]] = -1
            }
        }
    }
    backtrack(0)

    return of(board)
};

export function isValidSudoku(board: number[][]): boolean {
    for (let i = 0; i < 9; i++) {
        const rowSet: Set<number> = new Set()
        const columnSet: Set<number> = new Set()
        const square3x3Set: Set<number> = new Set()

        for (let j = 0; j < 9; j++) {
            if (board[i][j] !== -1) {
                if (rowSet.has(board[i][j]))
                    return false
                rowSet.add(board[i][j])
            }
            if (board[j][i] !== -1) {
                if (columnSet.has(board[j][i]))
                    return false
                columnSet.add(board[j][i])
            }
            const x: number = 3 * ~~(i / 3) + ~~(j / 3)
            const y: number = 3 * ~~(i % 3) + j % 3
            const element: number = board[x][y]
            if (element !== -1) {
                if (square3x3Set.has(element)) return false
                square3x3Set.add(element)
            }
        }
    }
    return true
}