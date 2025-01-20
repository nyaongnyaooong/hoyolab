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
    await this.discordService.sendMessageToChannel(
      channelId,
      JSON.stringify(result),
    );
  }

  // 미리 정의된 표현식 사용
  @Cron(CronExpression.EVERY_10_SECONDS)
  async updatePrices() {
  }
}
