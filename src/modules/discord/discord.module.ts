import { Module } from '@nestjs/common';
import { DiscordService } from './application/discord.service';
import { DiscordController } from './presentation/restful/discord.controller';
import { HoyolabModule } from '../hoyolab/hoyolab.module';
import { GenshinController } from '../hoyolab/presentation/restful/hoyolab.genshin.controller';

// https://discord.com/developers/applications
@Module({
  imports: [HoyolabModule],
  controllers: [DiscordController, GenshinController],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
