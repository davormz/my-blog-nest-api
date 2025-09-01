export class CreateCategoryDto {
  name: string;
  description?: string;
  slug: string;
}

export class UpdateCategoryDto {
  name?: string;
  description?: string;
  slug?: string;
}
