import { Controller, Get, Logger, Post } from '@nestjs/common';
import { SlackService } from '../../application/slack.service';

@Controller('slack')
export class SlackController {
  private readonly logger = new Logger(SlackController.name);
  constructor(private readonly slackService: SlackService) {}

  // @Get()
  // async getHello() {
  //   const channelId = process.env.DISCORD_CHANNEL_ID;
  //   console.log(channelId);
  //   return await this.discordService.sendMessageToChannel(
  //     channelId,
  //     'Hello World',
  //   );
  // }

  // @Get('embed')
  // async getEmbed() {
  //   const channelId = process.env.DISCORD_CHANNEL_ID;
  //   return await this.discordService.sendEmbedMessageToChannel({
  //     channelId,
  //     title: 'test title',
  //     message: 'Hello World',
  //   });
  // }

  // @Post('attend')
  // async attend() {
  //   const genshin = await this.genshinService.attendance();
  //   const starRail = await this.starRailService.attendance();
  //   const result = { genshin, starRail };
  //   let message = '';
  //   if (result.genshin.result) {
  //     message += '원신 출석체크에 성공했어요.\n';
  //   } else {
  //     message += `원신 : ${result.genshin?.message ? `${result.genshin.message}` : '출석 체크 실패'}\n`;
  //   }
  //   // message += '\n';
  //   if (result.starRail.result) {
  //     message += '스타레일 출석체크에 성공했어요.\n';
  //   } else {
  //     message += `스타레일 : ${result.starRail?.message ? `${result.starRail.message}` : '출석 체크 실패'}\n`;
  //   }

  //   const channelId = process.env.DISCORD_CHANNEL_ID;
  //   await this.discordService.sendEmbedMessageToChannel({
  //     channelId,
  //     title: 'test title',
  //     message,
  //   });
  // }
}
