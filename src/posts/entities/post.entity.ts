import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Category } from './category.entity';

@Entity({ name: 'posts' })
export class Post extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 100 })
  author: string;

  @Column({ type: 'boolean', default: false })
  published: boolean;

  @ManyToMany(() => Category, (category) => category.posts)
  @JoinTable({
    name: 'post_categories',
    joinColumn: { name: 'post_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];
}
