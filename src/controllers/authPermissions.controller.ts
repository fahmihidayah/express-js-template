import 'reflect-metadata';
import * as express from "express";
import { id, inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPost, httpPut, interfaces, next, request, requestBody, requestParam, response
} from "inversify-express-utils";
import { AuthPermissionDto, AuthPermissionNameDto, AuthPermissionWithUser } from "../dtos/auth.permission";
import { AuthPermissionService, AuthPermissionServiceImpl } from "../services/authPermission.service";
import { TYPE_MIDDLWARE_VALIDATION } from "../modules/validation.middleware.module";

@controller("/auth_permissions")
export class AuthPermissionController extends BaseHttpController {
    private _authPermissionService: AuthPermissionService
    constructor(
        authPermissionService: AuthPermissionServiceImpl
    ) {
        super()
        this._authPermissionService = authPermissionService
    }

    @httpPost("/:id/add_user", TYPE_MIDDLWARE_VALIDATION.AuthPermissionWithUserValidationMiddleware)
    public async addUser() {
        const params = this.httpContext.request.params;
        const body: AuthPermissionWithUser = this.httpContext.request.body
        const authPermissionid = params.id ?? ""
        return this.json({
            message: "Success add user to permission",
            status: 200,
            data: await this._authPermissionService.addUser(Number(authPermissionid), Number(body.user_id))
        })
    }

    @httpPost("/:id/remove_user", TYPE_MIDDLWARE_VALIDATION.AuthPermissionWithUserValidationMiddleware)
    public async removeUser() {
        const params = this.httpContext.request.params;
        const body: AuthPermissionWithUser = this.httpContext.request.body
        const authPermissionid = params.id ?? ""
        return this.json({
            message: "Success add user to permission",
            status: 200,
            data: await this._authPermissionService.removeUser(Number(authPermissionid), Number(body.user_id))
        })
    }



    @httpGet("/")
    public async index() {
        const query = this.httpContext.request.query
        const page = Number(query.page ?? "1")
        const take = Number(query.take ?? "5")
        const orderBy = ( query.order_by ?? "id") as string
        const orderByDirection = (query.order_type ?? "asc") as "asc" | "desc"
        const keyword = (query.keyword??"") as string
        const result = await this._authPermissionService.findAllPaginate({page, take, keyword, orderBy, orderByDirection})
        return this.json({
            message: "Success load auth permission",
            status: 200,
            ... result
        })
    }

    @httpPost("/create_name", TYPE_MIDDLWARE_VALIDATION.AuthPermissionNameValidationMiddleware)
    public async createName() {
        const form: AuthPermissionNameDto = this.httpContext.request.body;
        const data = await this._authPermissionService.createFromName(form);
        return this.json({
            message: "Success create collection auth permission",
            status: 200,
            data: data
        })
    }

    @httpDelete("/delete_name", TYPE_MIDDLWARE_VALIDATION.AuthPermissionNameValidationMiddleware)
    public async deleteName() {
        const form: AuthPermissionNameDto = this.httpContext.request.body;
        const data = await this._authPermissionService.deleteByName(form.name);
        return this.json({
            message: "Success delete collection auth permission",
            status: 200,

        })
    }

    @httpPost("/", TYPE_MIDDLWARE_VALIDATION.AuthPermissionValidationMiddleware)
    public async create() {
        const form: AuthPermissionDto = this.httpContext.request.body;
        const data = await this._authPermissionService.create(form)
        return this.json({
            message: "Success created auth permission",
            status: 200,
            data: data
        })
    }

    @httpGet("/:id")
    public async get() {
        const id = this.httpContext.request.params.id
        return this.json({
            message: "Success retrieve auth permission",
            status: 200,
            data: await this._authPermissionService.findById(Number(id))
        })
    }

    @httpPut("/:id", TYPE_MIDDLWARE_VALIDATION.AuthPermissionValidationMiddleware)
    public async update() {
        const id = this.httpContext.request.params.id
        const form: AuthPermissionDto = this.httpContext.request.body;
        const data = await this._authPermissionService.update(Number(id), form)
        return this.json({
            message: "Success retrieve auth permission",
            status: 200,
            data: data
        })
    }

    @httpDelete("/:id")
    public async delete() {
        const id = this.httpContext.request.params.id
        return this.json({
            message: "Success delete auth permission",
            status: 200,
            data: await this._authPermissionService.delete(Number(id))
        })
    }
}