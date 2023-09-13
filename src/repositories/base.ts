import { PaginateList } from "../dtos";
import { request } from 'express';


export class BaseQuery {
    constructor(
        public page: number,
        public take: number,
        public keyword: string = "",
        public orderBy: string = "id",
        public orderByDirection: string = "asc",
        public _start: number = 0,
        public _end: number = 10,
        public isAdmin: boolean = false,
        public id: number[] = []) {

    }
}


export async function createQueryAction<T>(query: BaseQuery, repository: CountRepository<T>): Promise<QueryAction> {
    if (!query.isAdmin) {
        const skip: number = (query.page - 1) * query.take;
        const count: number = await repository.countByQuery(query)
        const total: number = Math.ceil(count / query.take)
        return {
            skip: skip,
            take: query.take,
            total: total,
            count: count
        }
    }
    else {
        const count: number = await repository.countByQuery(query)
        const skip = query._start
        const take = query._end - query._start
        const total: number = Math.ceil(count / query.take)
        return {
            skip: skip,
            take: take,
            total: total,
            count: count
        }
    }
}

export interface QueryAction {
    skip: number;
    take: number;
    total: number;
    count: number;
}

export interface Repository<F, T, I> {

    findAll(query: BaseQuery): Promise<PaginateList<Array<T>>>
    create(form: F): Promise<T | null>
    update(id: I, form: F): Promise<T | null>
    findById(id: I): Promise<T | null>
    delete(id: I): Promise<T | null>
    count(): Promise<number>

}


export interface RetrieveRepository<T> {
    findAllPaginate(query: BaseQuery): Promise<PaginateList<Array<T>>>
    findAll(query: BaseQuery): Promise<Array<T>>
    findById(id: number): Promise<T | null>
}

export interface CountRepository<T> {
    count(): Promise<number>
    countByQuery(query: BaseQuery): Promise<number>
}

export interface CreateRepository<F, T> {
    create(form: F): Promise<T | null>
}

export interface UpdateRepository<F, T, I> {
    update(id: I, form: F): Promise<T | null>
}

export interface DeleteRepository<T, I> {
    delete(id: I): Promise<T | null>
}