import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {

    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    createTask(title: string, description: string): Task {
        const tsk: Task = {
            id: '1',
            title,
            description,
            status: TaskStatus.OPEN
        }

        this.tasks.push(tsk);
        return tsk;
    }
}
