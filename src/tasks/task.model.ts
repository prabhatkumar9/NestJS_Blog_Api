export interface Task {
    id?: string,
    title?: string,
    description?: string,
    status?: TaskStatus
}

export enum TaskStatus {
    DONE = 'Done',
    IN_PROGRESS = 'In_Progress',
    OPEN='Open',
}