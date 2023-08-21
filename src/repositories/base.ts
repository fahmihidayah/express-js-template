import { PaginateList } from "../dtos";

export interface Query {
    page : number;
    take : number;

    keyword : string | undefined;
    orderBy : string | undefined;
    orderByDirection : string | "asc" | "desc"
}

export interface Repository<F, T, I> {

    findAll(query : Query ) : Promise<PaginateList<Array<T>>>
    create(form : F) : Promise<T | null>
    update(id : I, form : F) : Promise<T | null>
    findById(id : I) : Promise<T | null>
    delete(id : I) : Promise<T | null> 
    count() : Promise<number>

}

export interface RetrieveRepository<T> {
    findAllPaginate(query : Query) : Promise<PaginateList<Array<T>>>
    findAll(query : Query) : Promise<Array<T>>
    countByQuery(query : Query) : Promise<number>
    count() : Promise<number>
    findById(id : number) : Promise<T | null>
}

export interface CreateRepository<F, T> {
    create(form : F) : Promise<T | null>
}

export interface UpdateRepository<F, T, I> {
    update(id : I, form : F) : Promise<T | null>
}

export interface DeleteRepository<T, I> {
    delete(id : I) : Promise<T | null>  
}