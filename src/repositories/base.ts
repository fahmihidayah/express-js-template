import { PaginateList } from "../dtos";

export class Query {
    constructor(
        public page: number,
        public take: number,
        public keyword: string = "",
        public orderBy: string = "id",
        public orderByDirection: string = "asc") {

    }
}

export async function createQueryAction<T>(query: Query, repository: RetrieveRepository<T>): Promise<QueryAction> {
    const skip: number = (query.page - 1) * query.take;
    const count: number = await repository.countByQuery(query)
    const total: number = Math.ceil(count / query.take)
    return {
        skip: skip,
        take: query.take,
        total: total
    }
}

export interface QueryAction {
    skip: number;
    take: number;
    total: number;
}

export interface Repository<F, T, I> {

    findAll(query: Query): Promise<PaginateList<Array<T>>>
    create(form: F): Promise<T | null>
    update(id: I, form: F): Promise<T | null>
    findById(id: I): Promise<T | null>
    delete(id: I): Promise<T | null>
    count(): Promise<number>

}

export interface RetrieveRepository<T> {
    findAllPaginate(query: Query): Promise<PaginateList<Array<T>>>
    findAll(query: Query): Promise<Array<T>>
    countByQuery(query: Query): Promise<number>
    count(): Promise<number>
    findById(id: number): Promise<T | null>
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