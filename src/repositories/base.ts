import { PaginateList } from "../dtos";

export interface Query {
    page : number;
    take : number;
    keyword : string | undefined;
}

export interface Repository<F, T, I> {

    findAll(query : Query ) : Promise<PaginateList<Array<T>>>
    create(form : F) : Promise<T | null>
    update(id : I, form : F) : Promise<T | null>
    findById(id : I) : Promise<T | null>
    delete(id : I) : Promise<T | null> 
    count() : Promise<number>

}