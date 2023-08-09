export const TYPE_REPOSITORY = {
    UserRepository: Symbol.for("UserRepository"),
    UserTokenRepository: Symbol.for("UserTokenRepository"),
    RoleRepository: Symbol.for("RoleRepository")
}

export interface PaginateQuery {
    page : number;
    take : number;
    keyword : string | undefined;
}

export interface UsersQuery extends PaginateQuery{

}