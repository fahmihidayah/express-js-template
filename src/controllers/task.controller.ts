import 'reflect-metadata';
import * as express from "express";
import { id, inject } from 'inversify';
import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPatch,
    httpPost, httpPut, interfaces, next, request, requestBody, requestParam, response
} from "inversify-express-utils";
import { TaskServiceImpl } from '../services/task.service';
import { BaseQuery } from '../repositories/base';
import { TaskFormDto } from '../dtos/task';
import { BaseAppController } from './app.controller';


@controller("/tasks")
export class TaskController extends BaseAppController {

    constructor(
        private _taskService : TaskServiceImpl
    ) {
        super()
    }

    @httpGet("/")
    public async findAll() {
        const query : BaseQuery = this.getQuery()
        return this.json({
            message: "Success get all tasks",
            status: 200,
            ... await this._taskService.findAllPaginate(query)
        })
    }

    @httpGet("/:id")
    public async findById() {
        const params = this.httpContext.request.params;
        const id = params.id ?? ""
        const task = await this._taskService.findById(Number(id))
        if(task === null) return this.json({
            message: "Failed get task by id",
            status: 500,
            data: null
        })
        return this.json({
            message: "Success get task by id",
            status: 200,
            data: task.task
        })
    }


    @httpPost("/")
    public async create() {
        const body : TaskFormDto = {
            title: this.httpContext.request.body.title,
            description: this.httpContext.request.body.description,
            completed : false
        }
        const task = await this._taskService.create(body)
        if(task === null) return this.json({
            message: "Failed create task",
            status: 500,
            data: null
        })

        return this.json({
            message: "Success create task",
            status: 200,
            data: task.task
        })
    }

    @httpPatch("/:id")
    public async update() {
        const params = this.httpContext.request.params;
        const body : TaskFormDto = this.httpContext.request.body;
        const id = params.id ?? ""
        const task = await this._taskService.update(Number(id), body)
        if(task === null) return this.json({
            message: "Failed update task",
            status: 500,
            data: null
        })
        return this.json({
            message: "Success update task",
            status: 200,
            data: task.task
        })
    }

    @httpDelete("/:id")
    public async delete() {
        const params = this.httpContext.request.params;
        const id = params.id ?? ""
        const task = await this._taskService.delete(Number(id))
        if(task === null) return this.json({
            message: "Failed delete task",
            status: 500,
            data: null
        })
        return this.json({
            message: "Success delete task",
            status: 200,
            data: task.task
        })
    }
}