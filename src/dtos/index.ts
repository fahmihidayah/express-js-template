export interface BaseResponse<T> {
    message : string;
    error : boolean;
    code : number;
    data : T
}

export interface PaginateResponse<T> extends BaseResponse<T> {
    page : number;
    total : number;
}

export interface PaginateList<T>  {
    count : number;
    page : number;
    total : number;
    data : T
}