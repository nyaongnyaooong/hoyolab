import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity('user')
export class UserEntity extends BaseEntity('uuid') {
  @Column({ comment: '캔들 단위(초)', primary: true })
  userId: string;

  @Column({
    comment: '마지막 캔들 시간',
    type: 'datetime',
  })
  password: string;
}
