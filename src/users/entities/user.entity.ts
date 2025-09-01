import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Profile } from './profile.entity';
import { Post } from 'src/posts/entities/post.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
