import { Module } from '@nestjs/common';
import { DiscordService } from './application/discord.service';
import { DiscordController } from './presentation/restful/discord.controller';
import { HoyolabModule } from '../hoyolab/hoyolab.module';

// https://discord.com/developers/applications
@Module({
  imports: [HoyolabModule],
  controllers: [DiscordController],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
