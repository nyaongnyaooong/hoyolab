import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      type: 'sqlite',
      database: 'db/database.sqlite', // 경로 수정
      synchronize:
        configService.getOrThrow<string>('DB_SYNCHRONIZE') === 'true',
      namingStrategy: new SnakeNamingStrategy(),
      autoLoadEntities: true,
      entities: [
        __dirname + '/../../persistence/entities/**/*.entity{.ts,.js}',
      ],
    };
  },
};
