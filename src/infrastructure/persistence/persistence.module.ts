import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user/user.repository';
import { TokenRepository } from './repositories/user/token.repository';

const repositoryProviders = [UserRepository, TokenRepository];

@Module({})
export class PersistenceModule {
  static forRoot() {
    return {
      global: true,
      module: PersistenceModule,
      providers: [...repositoryProviders],
      exports: [...repositoryProviders],
    };
  }
}
