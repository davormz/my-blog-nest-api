import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Verificar si ya existe una categoría con el mismo nombre o slug
    const existingCategory = await this.categoryRepository.findOne({
      where: [{ name: createCategoryDto.name }, { slug: createCategoryDto.slug }],
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name or slug already exists');
    }

    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      relations: ['posts'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['posts'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['posts'],
    });

    if (!category) {
      throw new NotFoundException(`Category with slug '${slug}' not found`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    // Verificar si el nuevo nombre o slug ya existe en otra categoría
    if (updateCategoryDto.name || updateCategoryDto.slug) {
      const conflictConditions: Array<{ name?: string; slug?: string }> = [];
      if (updateCategoryDto.name) {
        conflictConditions.push({ name: updateCategoryDto.name });
      }
      if (updateCategoryDto.slug) {
        conflictConditions.push({ slug: updateCategoryDto.slug });
      }

      const existingCategory = await this.categoryRepository.findOne({
        where: conflictConditions,
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException('Category with this name or slug already exists');
      }
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  async getPostsCount(id: number): Promise<number> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['posts'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category.posts.length;
  }
}
