import { Controller, Get, Logger } from '@nestjs/common';
import { DiscordService } from '../../application/discord.service';

@Controller('discord')
export class DiscordController {
  private readonly logger = new Logger(DiscordController.name);
  constructor(private readonly discordService: DiscordService) {}

  @Get()
  async getHello() {
    const channelId = process.env.DISCORD_CHANNEL_ID;
    console.log(channelId);
    return await this.discordService.sendMessageToChannel(
      channelId,
      'Hello World',
    );
  }
}
