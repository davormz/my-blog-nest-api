import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Post } from '../entities/post.entity';
import { Category } from '../entities/category.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { categoryIds, ...postData } = createPostDto;

    const post = this.postRepository.create(postData);

    // Si se proporcionan categoryIds, buscar y asignar las categorías
    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoryRepository.find({
        where: { id: In(categoryIds) },
      });

      if (categories.length !== categoryIds.length) {
        throw new BadRequestException('One or more categories not found');
      }

      post.categories = categories;
    }

    return await this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: ['categories'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async findByCategory(categoryId: number): Promise<Post[]> {
    return await this.postRepository.createQueryBuilder('post').innerJoin('post.categories', 'category').where('category.id = :categoryId', { categoryId }).getMany();
  }

  async findPublished(): Promise<Post[]> {
    return await this.postRepository.find({
      where: { published: true },
      relations: ['categories'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const { categoryIds, ...postData } = updatePostDto;

    const post = await this.findOne(id);

    // Actualizar los campos del post
    Object.assign(post, postData);

    // Si se proporcionan categoryIds, actualizar las categorías
    if (categoryIds !== undefined) {
      if (categoryIds.length > 0) {
        const categories = await this.categoryRepository.find({
          where: { id: In(categoryIds) },
        });

        if (categories.length !== categoryIds.length) {
          throw new BadRequestException('One or more categories not found');
        }

        post.categories = categories;
      } else {
        post.categories = [];
      }
    }

    return await this.postRepository.save(post);
  }

  async remove(id: number): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepository.remove(post);
  }

  async addCategory(postId: number, categoryId: number): Promise<Post> {
    const post = await this.findOne(postId);
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    if (!post.categories) {
      post.categories = [];
    }

    // Verificar si la categoría ya está asignada
    const categoryExists = post.categories.some((cat) => cat.id === categoryId);
    if (categoryExists) {
      throw new BadRequestException('Category already assigned to this post');
    }

    post.categories.push(category);
    return await this.postRepository.save(post);
  }

  async removeCategory(postId: number, categoryId: number): Promise<Post> {
    const post = await this.findOne(postId);

    if (!post.categories || post.categories.length === 0) {
      throw new BadRequestException('Post has no categories assigned');
    }

    post.categories = post.categories.filter((cat) => cat.id !== categoryId);
    return await this.postRepository.save(post);
  }

  async getPostsCount(): Promise<number> {
    return await this.postRepository.count();
  }

  async getPublishedPostsCount(): Promise<number> {
    return await this.postRepository.count({ where: { published: true } });
  }
}
