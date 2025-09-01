import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './service/posts.service';
import { PostsController } from './controller/posts.controller';
import { CategoriesService } from './service/categories.service';
import { CategoriesController } from './controller/categories.controller';
import { Post } from './entities/post.entity';
import { Category } from './entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Category])],
  controllers: [PostsController, CategoriesController],
  providers: [PostsService, CategoriesService],
  exports: [PostsService, CategoriesService],
})
export class PostsModule {}
