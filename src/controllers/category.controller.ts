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
import { BaseAppController } from './app.controller';
import { CategoryServiceImpl } from '../services/category.service';

@controller("/categories")
export class CategoryController extends BaseAppController {

    constructor(
        private _categoryService: CategoryServiceImpl
    ) {
        super()
    }

    @httpGet("/")
    public async index() {
        const result = await this._categoryService.findAll(this.getQuery())
        return this.json({
            message: "Success load categories",
            status: 200,
            ... result
        })
    }

    @httpPost("/")
    public async create() {
        const body = this.httpContext.request.body
        const result = await this._categoryService.create(body)
        return this.json({
            message: "Success create category",
            status: 200,
            data: result.category
        })
    }

    @httpGet("/:id")
    public async show() {
        const params = this.httpContext.request.params;
        const result = await this._categoryService.findById(Number(params.id))
        return this.json({
            message: "Success load category",
            status: 200,
            data: result?.category
        })
    }

    @httpPatch("/:id")
    public async update() {
        const params = this.httpContext.request.params;
        const body = this.httpContext.request.body
        const result = await this._categoryService.update(Number(params.id), body)
        return this.json({
            message: "Success update category",
            status: 200,
            data: result.category
        })
    }

    @httpDelete("/:id")
    public async delete() {
        const params = this.httpContext.request.params;
        const result = await this._categoryService.delete(Number(params.id))
        return this.json({
            message: "Success delete category",
            status: 200,
            data: result.category
        })
    }

    
}