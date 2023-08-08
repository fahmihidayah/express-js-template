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

    @httpPost("/create")
    public async create() {

    }

    @httpGet("/:id")
    public async getRole() {

    }

    @httpDelete("/:id")
    public async deleteRole() {
        
    }
}