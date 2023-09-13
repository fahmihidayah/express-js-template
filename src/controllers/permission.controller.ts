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
import { BaseAppController } from './app.controller';

import { PermissionFormDto, AuthPermissionNameDto, AuthPermissionWithUser } from "../dtos/permission";
import { PermissionService, PermissionServiceImpl } from "../services/permission.service";
// import { TYPE_MIDDLWARE_VALIDATION } from "../modules/validation.middleware.module";

@controller("/auth_permissions")
export class AuthPermissionController extends BaseAppController {
    private _authPermissionService: PermissionService
    constructor(
        authPermissionService: PermissionServiceImpl
    ) {
        super()
        this._authPermissionService = authPermissionService
    }

    @httpPost("/:id/add_user")
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

    @httpPost("/:id/remove_user")
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
        const result = await this._authPermissionService.findAllPaginate(this.getQuery())
        return this.json({
            message: "Success load auth permission",
            status: 200,
            ... result
        })
    }

    @httpPost("/create_name")
    public async createName() {
        const form: AuthPermissionNameDto = this.httpContext.request.body;
        const data = await this._authPermissionService.createFromName(form);
        return this.json({
            message: "Success create collection auth permission",
            status: 200,
            data: data
        })
    }

    @httpDelete("/delete_name")
    public async deleteName() {
        const form: AuthPermissionNameDto = this.httpContext.request.body;
        const data = await this._authPermissionService.deleteByName(form.name);
        return this.json({
            message: "Success delete collection auth permission",
            status: 200,

        })
    }

    @httpPost("/")
    public async create() {
        const form: PermissionFormDto = this.httpContext.request.body;
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

    @httpPut("/:id")
    public async update() {
        const id = this.httpContext.request.params.id
        const form: PermissionFormDto = this.httpContext.request.body;
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