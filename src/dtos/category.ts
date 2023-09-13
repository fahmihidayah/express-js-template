import { Category } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export class CategoryFormDto {
    
  @IsNotEmpty()
  @IsString()
  public name: string = "";
}

export class CategoryData {
  constructor(
    public category: Category
  ) {

  }
}