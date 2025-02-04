import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { SchedulerService } from '../../application/scheduler.service';
import { DiscordService } from 'src/modules/discord/application/discord.service';

@Injectable()
export class SchedulerCron {
  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly discordService: DiscordService,
    // private readonly logger: Logger,
  ) {}

  // 매일 오전 5시 실행
  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async attendAll() {
    const channelId = process.env.DISCORD_CHANNEL_ID;
    const result = await this.schedulerService.attendAll();
    let message = '';
    if (result.genshin.result) {
      message += '원신 출석체크에 성공했어요.\n';
    } else {
      message += `원신 : ${result.genshin?.message ? `${result.genshin.message}` : '출석 체크 실패'}\n`;
    }
    
    if (result.starRail.result) {
      message += '스타레일 출석체크에 성공했어요.\n';
    } else {
      message += `스타레일 : ${result.starRail?.message ? `${result.starRail.message}` : '출석 체크 실패'}\n`;
    }

    await this.discordService.sendEmbedMessageToChannel({
      channelId,
      title: '출석체크 결과',
      message,
    });
  }

  // 공식 리딤 코드 확인 후 입력
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async putOfficialCoupon() {
    return await this.schedulerService.putOfficialCoupon();
  }
}
