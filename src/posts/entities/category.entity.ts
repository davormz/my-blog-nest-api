import { BaseEntity } from 'src/common';
import { Column, Entity, ManyToMany } from 'typeorm';
import { Post } from './post.entity';

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  slug: string;

  @ManyToMany(() => Post, (post) => post.categories)
  posts: Post[];
}
