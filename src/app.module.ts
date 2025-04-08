import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { ConfigModule } from '@nestjs/config';
import { DiscordModule } from './modules/discord/discord.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './infrastructure/config/db/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: [`.env.${process.env.ENV}`],
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    DiscordModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
