// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
// import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
//   imports: [ConfigModule],
//   inject: [ConfigService],
//   useFactory: async (configService: ConfigService) => {
//     return {
//       type: 'postgres',
//       host: configService.getOrThrow<string>('DB_HOST'),
//       port: configService.getOrThrow<number>('DB_PORT'),
//       database: configService.getOrThrow<string>('DB_DATABASE'),
//       username: configService.getOrThrow<string>('DB_USER'),
//       password: configService.getOrThrow<string>('DB_PASSWORD'),
//       synchronize:
//         configService.getOrThrow<string>('DB_SYNCHRONIZE') === 'true',
//       namingStrategy: new SnakeNamingStrategy(),
//       autoLoadEntities: true,
//       entities: [
//         __dirname + '/../../persistence/entities/**/*.entity{.ts,.js}',
//       ],
//     };
//   },
// };
