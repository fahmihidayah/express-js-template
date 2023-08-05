export const TYPE_REPOSITORY = {
    UserRepository: Symbol.for("UserRepository")
}

export interface PaginateQuery {
    page : number;
    take : number;
}

export interface UsersQuery extends PaginateQuery{

}