import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { CategoriesService } from '../service/categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';
import { Category } from '../entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return await this.categoriesService.findOne(id);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<Category> {
    return await this.categoriesService.findBySlug(slug);
  }

  @Get(':id/posts-count')
  async getPostsCount(@Param('id', ParseIntPipe) id: number): Promise<{ count: number }> {
    const count = await this.categoriesService.getPostsCount(id);
    return { count };
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.categoriesService.remove(id);
  }
}
