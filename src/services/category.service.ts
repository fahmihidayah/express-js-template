import { provide } from "inversify-binding-decorators";
import { PaginateList } from "../dtos";
import { CategoryData, CategoryFormDto } from "../dtos/category";
import { BaseQuery } from "../repositories/base";
import { CategoryRepositoryImpl } from "../repositories/category.repository";
import { Category } from "@prisma/client";

export interface CategoryService {
    create(categoryFormDto: CategoryFormDto): Promise<CategoryData>;
    findAll(query: BaseQuery): Promise<PaginateList<Category[]>>;
    findById(id: number): Promise<CategoryData | null>;
    update(id: number, categoryFormDto: CategoryFormDto): Promise<CategoryData>;
    delete(id: number): Promise<CategoryData>;
    count(): Promise<number>;
    countByQuery(query: BaseQuery): Promise<number>;
}

@provide(CategoryServiceImpl)
export class CategoryServiceImpl implements CategoryService {
    constructor(
        private categoryRepositoryImpl : CategoryRepositoryImpl
    ) {

    }

    async create(categoryFormDto: CategoryFormDto): Promise<CategoryData> {
        const category = await this.categoryRepositoryImpl.create(categoryFormDto);
        return category;
    }

    async findAll(query: BaseQuery): Promise<PaginateList<Category[]>> {
        const paginateListCategories = await this.categoryRepositoryImpl.findAllPaginate(query);
        return {
            data: paginateListCategories.data.map(category => category.category),
            total: paginateListCategories.total,
            count: paginateListCategories.count,
            page: paginateListCategories.page,
        }
    }

    async findById(id: number): Promise<CategoryData | null> {
        const category = await this.categoryRepositoryImpl.findById(id);
        return category;
    }

    async update(id: number, categoryFormDto: CategoryFormDto): Promise<CategoryData> {
        const category = await this.categoryRepositoryImpl.update(id, categoryFormDto);
        return category;
    }

    async delete(id: number): Promise<CategoryData> {
        const category = await this.categoryRepositoryImpl.delete(id);
        return category;
    }

    async count(): Promise<number> {
        return await this.categoryRepositoryImpl.count();
    }

    async countByQuery(query: BaseQuery): Promise<number> {
        return await this.categoryRepositoryImpl.countByQuery(query);
    }



}