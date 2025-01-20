import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
  Relation,
} from 'typeorm';
import { BaseEntity, BaseEntityNonePk } from '../base.entity';

@Entity('token')
export class TokenEntity extends BaseEntity('uuid') {
  @Column({ comment: '토큰 이름' })
  cookieToken: string;

  @Column({ comment: '토큰 이름' })
  ltoken: string;

  @Column({ comment: '토큰 이름' })
  ltuid: string;
}
