import { BaseEntity } from 'src/common';
import { User } from 'src/users/entities/user.entity';
import { Column, JoinColumn, ManyToOne } from 'typeorm';

export class Post extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  @JoinColumn({ name: 'author_id' })
  author: User;
}
