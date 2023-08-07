export const TYPE_REPOSITORY = {
    UserRepository: Symbol.for("UserRepository"),
    UserTokenRepository: Symbol.for("UserTokenRepository")
}

export interface PaginateQuery {
    page : number;
    take : number
}

export interface UsersQuery extends PaginateQuery{

}