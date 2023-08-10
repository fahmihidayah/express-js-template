import * as express from "express";
import { id, inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPost, httpPut, interfaces, next, request, requestBody, requestParam, response
} from "inversify-express-utils";
import { TYPE_SERVICE } from "../services";
import { AuthPermissionDto } from "../dtos/auth.permission";
import { AuthPermissionService } from "../services/authPermission.repository";

@controller("/auth_permissions")
export class AuthPermissionController extends BaseHttpController {
    constructor(@inject(TYPE_SERVICE.AuthPermissionService) private _authPermissionService : AuthPermissionService) {
        super()
    }

    @httpGet("/")
    public async index() {
        const query = this.httpContext.request.query
        const { page, take } = query
        const keyword : string = query.keyword as string
        return this.json({
            message: "Success load auth permission",
            status: 200,
            data: await this._authPermissionService.findAll({ page: Number(page??"1"), take: Number(take??"5"), keyword: keyword ?? "" })
        })
    }

    @httpPost("/")
    public async create() {
        const groupDto = this.httpContext.request.body;

        const role = await this._authPermissionService.create(groupDto)
        return this.json({
            message: "Success created auth permission",
            status: 200,
            data: role
        })
    }

    @httpGet("/:id")
    public async getRole() {
        const id = this.httpContext.request.params.id
        return this.json({
            message: "Success retrieve auth permission",
            status: 200,
            data: await this._authPermissionService.findById(Number(id))
        })
    }

    @httpDelete("/:id")
    public async deleteRole() {
        const id = this.httpContext.request.params.id
        return this.json({
            message: "Success delete auth permission",
            status: 200,
            data: await this._authPermissionService.delete(Number(id))
        })
    }
}