export const matrixCell: HTMLTableCellElement[][] = []

export function createGridTable(): void {
    const gridTable = document.createElement("table")
    gridTable.classList.add("grid-table")
    for (let i = 0; i < 15; i++) {
        const row = document.createElement("tr")
        matrixCell[i] = []
        for (let j = 0; j < 40; j++) {
            const cell = document.createElement("th")
            cell.classList.add("cell")
            cell.setAttribute("x", i.toString())
            cell.setAttribute("y", j.toString())
            matrixCell[i].push(cell)
            row.appendChild(cell)
        }
        gridTable.appendChild(row)
    }
    document.body.appendChild(gridTable)
}