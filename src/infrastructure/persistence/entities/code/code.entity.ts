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

@Entity('code')
export class CodeEntity extends BaseEntityNonePk() {
  @PrimaryColumn({ comment: '리딤코드' })
  code: string;

  @PrimaryColumn({ comment: '리딤코드 타입' })
  type: string;

  @Column({ comment: '리딤코드 상태 (false: 사용가능, true: 사용완료)' })
  isRedeemed: boolean;

  @Column({ comment: '만료 여부' })
  isExpired: boolean;
}
