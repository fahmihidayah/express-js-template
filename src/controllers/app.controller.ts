import { BaseHttpController } from "inversify-express-utils";
import { JsonResult } from "inversify-express-utils/lib/results";
import { BaseQuery } from "../repositories/base";

export class BaseAppController extends BaseHttpController { 

    protected json(content: any, statusCode?: number): JsonResult {
        if(this.httpContext.request.headers['format'] === 'admin') {
            if(content.count)
                this.httpContext.response.setHeader('x-total-count', content.count)
            return super.json(content.data, statusCode)
        }
        return super.json(content, statusCode)
    }

    public getQuery() : BaseQuery {
        const query : BaseQuery = new BaseQuery(
            Number(this.httpContext.request.query.page ?? "1"),
            Number(this.httpContext.request.query.take ?? "10"),
            String(this.httpContext.request.query.orderBy ?? "id"),
            String(this.httpContext.request.query.orderByDirection ?? "asc"),
            Number(this.httpContext.request.query._start ?? "0"),
            Number(this.httpContext.request.query._end ?? "5"),
            this.httpContext.request.headers['format'] === 'admin',
            String(this.httpContext.request.query._sort ?? "id"),
            String(this.httpContext.request.query._order ?? "asc"),
        )
        return query
    }

}