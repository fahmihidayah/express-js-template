import { provide } from "inversify-binding-decorators";
import { TaskData, TaskFormDto } from "../dtos/task";
import { CountRepository, CreateRepository, DeleteRepository, BaseQuery, RetrieveRepository, UpdateRepository, createQueryAction } from "./base";
import { inject } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { Prisma, PrismaClient, Task } from "@prisma/client";
import { PaginateList } from "../dtos";

export interface TaskRepository extends
    CreateRepository<TaskFormDto, TaskData>,
    CountRepository<Task>,
    RetrieveRepository<TaskData>,
    UpdateRepository<TaskFormDto, TaskData, number>,
    DeleteRepository<TaskData, number>{

    findByIds(ids: number[]): Promise<Task[]>   
}

@provide(TaskRepositoryImpl)
export class TaskRepositoryImpl implements TaskRepository {

    private taskDelegate : Prisma.TaskDelegate;

    constructor (
        @inject(TYPE_PRISMA.PrismaClient) private _prisma : PrismaClient
    ) {
        this.taskDelegate = this._prisma.task;
    }

    public async create(form: TaskFormDto): Promise<TaskData | null> {
        const task = await this.taskDelegate.create({
            data: {
                title: form.title,
                description: form.description,
                completed: form.completed
            }
        });

        return new TaskData(task);
    }

    public async findAll(query: BaseQuery): Promise<TaskData[]> {
        const tasks = await this.taskDelegate.findMany({
            skip: query.page * query.take,
            take: query.take,
            orderBy: {
                [query.orderBy]: query.orderByDirection
            }
        });

        return tasks.map(task => new TaskData(task));
    }

    public async countByQuery(query: BaseQuery): Promise<number> {
        return await this.taskDelegate.count({
            where: {
                title: {
                    contains: query.keyword
                },
                description: {
                    contains: query.keyword
                }
            }
        });
    }
    public async count(): Promise<number> {
        return await this.taskDelegate.count();
    }

    public async findById(id: number): Promise<TaskData | null> {
        const task = await this.taskDelegate.findUnique({   
            where: {
                id: id
            }
        });
        if (task === null) return null;
        return new TaskData(task);
    }

    public async findAllPaginate(query: BaseQuery): Promise<PaginateList<TaskData[]>> {
        const queryaAction = await createQueryAction<TaskData>(query, this);
        console.log(queryaAction)
        const tasks = await this.taskDelegate.findMany({
            skip: queryaAction.skip,
            take: queryaAction.take,
            orderBy: {
                [query.orderBy]: query.orderByDirection
            }
        });

        return {
            count : queryaAction.count,
            page: query.page,
            total: queryaAction.total,
            data: tasks.map(task => new TaskData(task))
        }
    }


    public async update(id: number, form: TaskFormDto): Promise<TaskData | null> {
        const task = await this.taskDelegate.update({
            where: {
                id: id
            },
            data: {
                title: form.title,
                description: form.description,
                completed: form.completed
            }
        });

        return new TaskData(task);
    }

    public async delete(id: number): Promise<TaskData | null> {
        const task = await this.taskDelegate.delete({
            where: {
                id: id
            }
        });

        return new TaskData(task);
    }

    public async findByIds(ids: number[]): Promise<Task[]> {
        const task = await this.taskDelegate.findMany({
            where : {
                id : {
                    in : ids
                }
            }
        })
        return task;
    }

}