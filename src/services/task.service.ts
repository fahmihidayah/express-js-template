import { Task } from "@prisma/client";
import { PaginateList } from "../dtos";
import { TaskData, TaskFormDto } from "../dtos/task";
import { BaseQuery } from "../repositories/base";
import { provide } from "inversify-binding-decorators";
import { TaskRepositoryImpl } from "../repositories/task.repository";
import { CategoryRepositoryImpl } from "../repositories/category.repository";

export interface TaskService {
    findAllPaginate(query: BaseQuery): Promise<PaginateList<Array<Task>>>
    create(form: TaskFormDto): Promise<TaskData | null>
    update(id: number, form: TaskFormDto): Promise<TaskData | null>
    findById(id: number): Promise<TaskData | null>
    delete(id: number): Promise<TaskData | null>
    findByIds(ids: number[]): Promise<Task[]>
}

@provide(TaskServiceImpl)
export class TaskServiceImpl implements TaskService {

    constructor(
        private _taskRepository: TaskRepositoryImpl,
        private _categoryRepository: CategoryRepositoryImpl
    ) {

    }


    public async findAllPaginate(query: BaseQuery): Promise<PaginateList<Array<Task>>> {
        
        const paginateList = await this._taskRepository.findAllPaginate(query);
        return {
            data: paginateList.data.map(task => task.task),
            page: query.page,
            total: paginateList.total,
            count : paginateList.count
        }
    }

    public async create(form: TaskFormDto): Promise<TaskData | null> {
        const category = await this._categoryRepository.findById(Number(form.category_id));

        return await this._taskRepository.create({
            title: form.title,
            description: form.description,
            completed: form.completed,
            category_id : form.category_id,
            category : category?.category!
        });
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

    public async findByIds(ids: number[]): Promise<Task[]> {
        return await this._taskRepository.findByIds(ids);
    }

}