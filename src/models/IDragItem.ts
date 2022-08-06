import { ITask } from "./ITask";

export interface IDragItem {
    task: ITask,
    oldIndex: number,
    index: number
}