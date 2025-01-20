import { Module } from '@nestjs/common';
import { DiscordService } from './application/discord.service';
import { DiscordController } from './presentation/restful/discord.controller';

// https://discord.com/developers/applications
@Module({
  controllers: [DiscordController],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
