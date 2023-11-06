// 4dir, mozda dodam opciju da ima da biras izmedju 4dir i 8dir

import { Coords, GridCell, ItemType } from "../../model"

export const coords: Coords[] = [[0, 1], [0, -1], [1, 0], [-1, 0]]

export const isValid = ([x, y]: Coords, grid: GridCell[][]): boolean => {
    return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length && grid[x][y] !== ItemType.Wall
}