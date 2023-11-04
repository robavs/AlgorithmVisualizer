import { createNavOptions } from "./navOptions";
import { createGridTable } from "./gridTable";

export function generateView(): void {
    createNavOptions()
    createGridTable()
}