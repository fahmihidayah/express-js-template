import { Task } from "@prisma/client";
import { PaginateList } from "../dtos";
import { TaskData, TaskFormDto } from "../dtos/task";
import { Query } from "../repositories/base";
import { provide } from "inversify-binding-decorators";
import { TaskRepositoryImpl } from "../repositories/task.repository";

export interface TaskService {
    findAllPaginate(query: Query): Promise<PaginateList<Array<Task>>>
    create(form: TaskFormDto): Promise<TaskData | null>
    update(id: number, form: TaskFormDto): Promise<TaskData | null>
    findById(id: number): Promise<TaskData | null>
    delete(id: number): Promise<TaskData | null>
}

@provide(TaskServiceImpl)
export class TaskServiceImpl implements TaskService {

    constructor(
        private _taskRepository: TaskRepositoryImpl
    ) {

    }


    public async findAllPaginate(query: Query): Promise<PaginateList<Array<Task>>> {
        const paginateList = await this._taskRepository.findAllPaginate(query);
        return {
            data: paginateList.data.map(task => task.task),
            page: query.page,
            total: paginateList.total
        }
    }

    public async create(form: TaskFormDto): Promise<TaskData | null> {
        return await this._taskRepository.create(form);
    }

    public async update(id: number, form: TaskFormDto): Promise<TaskData | null> {
        return await this._taskRepository.update(id, form);
    }

    public async findById(id: number): Promise<TaskData | null> {
        return await this._taskRepository.findById(id);
    }

    public async delete(id: number): Promise<TaskData | null> {
        return await this._taskRepository.delete(id);
    }

}