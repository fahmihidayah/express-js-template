import * as express from "express";
import { inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPost, httpPut, interfaces, next, request, requestBody, requestParam, response
} from "inversify-express-utils";
import { TYPE_SERVICE } from "../services";
import { RoleService } from "../services/role.service";

@controller("/roles")
export class RoleController extends BaseHttpController {
    constructor(@inject(TYPE_SERVICE.RoleService) private _roleService : RoleService) {
        super()
    } 

    @httpGet("/")
    public async index() {
        return this.json({
            message : "Success Load data",
            status : 200,
            data : await this._roleService.findAll()
        })
    }

    @httpPost("/")
    public async create() {
        const roleDto = this.httpContext.request.body;

        const role = await this._roleService.create(roleDto)
        return this.json({
            message : "Success created role",
            status : 200,
            data : role
        })
    }

    @httpGet("/:id")
    public async getRole() {
        const idNumber = this.httpContext.request.params.id
        return this.json({
            message : "Success retrieve role",
            status : 200,
            data : await this._roleService.findById(Number(idNumber))
        })
    }

    @httpDelete("/:id")
    public async deleteRole() {
        
        const idNumber = this.httpContext.request.params.id
        return this.json({
            message : "Success delete role",
            status : 200,
            data : await this._roleService.delete(Number(idNumber))
        })
    }
}