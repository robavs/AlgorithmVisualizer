export function sudokuTable() {
    const sudoku = document.createElement("table")
    sudoku.classList.add("sudoku-table")
    for (let i = 0; i < 9; i++) {
        const row = document.createElement("tr")
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement("input")
            cell.type = "number"
            cell.classList.add("sudoku-cell")
            cell.setAttribute("x", i.toString())
            cell.setAttribute("y", j.toString())
            row.appendChild(cell)
        }
        sudoku.appendChild(row)
    }
    document.body.appendChild(sudoku)
}