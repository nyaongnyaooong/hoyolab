import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

type IdType = 'increment' | 'uuid' | 'rowid' | 'identity';
export function BaseEntity<T extends IdType>(idType: T) {
  @Entity()
  abstract class _BaseEntity {
    @PrimaryGeneratedColumn(idType as any)
    id: T extends 'increment' | 'rowid' | 'identity' ? number : string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;

    @DeleteDateColumn({
      name: 'deleted_at',
      type: 'timestamptz',
      nullable: true,
    })

    deletedAt: Date;
  }

  return _BaseEntity;
}

export function BaseEntityNonePk() {
  @Entity()
  abstract class _BaseEntity {
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createAt: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date;

    @DeleteDateColumn({
      name: 'deleted_at',
      type: 'timestamptz',
      nullable: true,
    })
    deletedAt: Date;
  }
  
  return _BaseEntity;
}
/**
 * Usage: BaseEntity를 상속받아서 사용한다. (EN: Inherit BaseEntity)
 *  - class CourseEntity extends BaseEntity('increment') {}
 *  - class CourseEntity extends BaseEntity('uuid') {}
 *  - class CourseEntity extends BaseEntity('rowid') {}
 *  - class CourseEntity extends BaseEntity('identity') {}
 */
