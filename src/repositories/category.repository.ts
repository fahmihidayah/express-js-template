import { Category, Prisma, PrismaClient } from "@prisma/client";
import { CategoryData, CategoryFormDto } from "../dtos/category";
import { BaseQuery, CountRepository, CreateRepository, DeleteRepository, RetrieveRepository, UpdateRepository, createQueryAction } from "./base";
import { provide } from "inversify-binding-decorators";
import { inject } from "inversify";
import { TYPE_PRISMA } from "../modules/prisma.container";
import { GetResult } from "@prisma/client/runtime/library";
import { PaginateList } from "../dtos";

export interface CategoryRepository extends 
    CreateRepository<CategoryFormDto, CategoryData>,
    RetrieveRepository<CategoryData>,
    CountRepository<Category>,
    UpdateRepository<CategoryFormDto, CategoryData, number>,
    DeleteRepository<CategoryData, number> {

}

@provide(CategoryRepositoryImpl)
export class CategoryRepositoryImpl implements CategoryRepository {

    private categoryDelegate : Prisma.CategoryDelegate;

    constructor(
        @inject(TYPE_PRISMA.PrismaClient) private prisma : PrismaClient
    ) {
        this.categoryDelegate = this.prisma.category;
    }

    async create(categoryFormDto: CategoryFormDto): Promise<CategoryData> {
        const result = await this.categoryDelegate.create({
            data: categoryFormDto
        });

        return new CategoryData(result);
    }

    async count(): Promise<number> {
        return await this.categoryDelegate.count();
    }

    async countByQuery(query: BaseQuery): Promise<number> {
        const whereInput : Prisma.CategoryWhereInput [] = [];
        query.extraQueries.forEach((value, key) => {
            whereInput.push({
                [String(key)] : {
                    contains : value
                }
            })
        })
        const categoryWhereInputs : Prisma.CategoryWhereInput | undefined = whereInput.length > 0 ? {
            OR : whereInput} : undefined
        return await this.categoryDelegate.count({
            where: categoryWhereInputs
        });
    }

    async findAll(query: BaseQuery): Promise<CategoryData[]> {
        const queryAction = await createQueryAction(query, this);
        const whereInput : Prisma.CategoryWhereInput [] = [];
        query.extraQueries.forEach((value, key) => {
            whereInput.push({
                [String(key)] : {
                    contains : value
                }
            })
        })
        const categoryWhereInputs : Prisma.CategoryWhereInput | undefined = whereInput.length > 0 ? {
            OR : whereInput} : undefined
        const result = await this.categoryDelegate.findMany({
            skip: queryAction.skip,
            take: queryAction.take,
            orderBy: {
                [query.orderBy]: query.orderByDirection
            },
            where: categoryWhereInputs
        });

        return result.map(category => new CategoryData(category));

    }

    async findAllPaginate(query: BaseQuery): Promise<PaginateList<CategoryData[]>> {
        const queryAction = await createQueryAction(query, this);
        const whereInput : Prisma.CategoryWhereInput [] = [];
        query.extraQueries.forEach((value, key) => {
            whereInput.push({
                [String(key)] : {
                    contains : value
                }
            })
        })
        const categoryWhereInputs : Prisma.CategoryWhereInput | undefined = whereInput.length > 0 ? {
            OR : whereInput} : undefined
        const result = await this.categoryDelegate.findMany({
            skip: queryAction.skip,
            take: queryAction.take,
            orderBy: {
                [query.orderBy]: query.orderByDirection
            },
            // where: categoryWhereInputs
        });
        return {
            data: result.map(category => new CategoryData(category)),
            total:  0, //queryAction.total,
            page: query.page,
            count : 1//queryAction.count
        }
    }

    async findById(id: number): Promise<CategoryData | null> {
        const result = await this.categoryDelegate.findUnique({
            where: {
                id: id
            }
        });
        return result === null ? null : new CategoryData(result);
    }

    async update(id: number, categoryFormDto: CategoryFormDto): Promise<CategoryData> {
        const result = await this.categoryDelegate.update({
            where: {
                id: id
            },
            data: categoryFormDto
        });
        return new CategoryData(result);
    }

    async delete(id: number): Promise<CategoryData> {
        const result =  await this.categoryDelegate.delete({
            where: {
                id: id
            }
        });
        return new CategoryData(result);
    }
}
