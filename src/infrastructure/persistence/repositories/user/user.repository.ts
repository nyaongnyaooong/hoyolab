import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { UserEntity } from '../../entities/user/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }
}
