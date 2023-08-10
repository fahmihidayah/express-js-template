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
import { GroupService } from "../services/group.service";

@controller("/groups")
export class RoleController extends BaseHttpController {
    constructor(@inject(TYPE_SERVICE.GroupService) private _groupService: GroupService) {
        super()
    }

    @httpGet("/")
    public async index() {
        const { page, take, keyword } = this.httpContext.request.query
        return this.json({
            message: "Success load group",
            status: 200,
            data: await this._groupService.findAll({ page: Number(page??"1"), take: Number(take??"5"), keyword: String(keyword) })
        })
    }

    @httpPost("/")
    public async create() {
        const groupDto = this.httpContext.request.body;

        const role = await this._groupService.create(groupDto)
        return this.json({
            message: "Success created group",
            status: 200,
            data: role
        })
    }

    @httpGet("/:id")
    public async getRole() {
        const id = this.httpContext.request.params.id
        return this.json({
            message: "Success retrieve group",
            status: 200,
            data: await this._groupService.findById(Number(id))
        })
    }

    @httpDelete("/:id")
    public async deleteRole() {
        const id = this.httpContext.request.params.id
        return this.json({
            message: "Success delete group",
            status: 200,
            data: await this._groupService.delete(Number(id))
        })
    }
}