import { Module } from '@nestjs/common';
import { SlackService } from './application/slack.service';
import { SlackController } from './presentation/restful/slack.controller';

// https://discord.com/developers/applications
@Module({
  controllers: [SlackController],
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {}
