export const TYPE_REPOSITORY = {
    UserRepository: Symbol.for("UserRepository")
}

export interface PaginateQuery {
    page : string;
    take : string;
}

export interface UsersQuery extends PaginateQuery{

}