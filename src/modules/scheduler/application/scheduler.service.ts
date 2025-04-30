import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { DiscordService } from 'src/modules/discord/application/discord.service';
import { GenshinService } from 'src/modules/hoyolab/application/genshin.service';
import { HonkaiStarRailService } from 'src/modules/hoyolab/application/honkai-starrail.service';

@Injectable()
export class SchedulerService {
  logger = new Logger(SchedulerService.name);
  constructor(
    private readonly genshinService: GenshinService,
    private readonly starRailService: HonkaiStarRailService,
    private readonly discordService: DiscordService,
  ) {}

  async attendAll() {
    const genshin = await this.genshinService.attendance();
    const starRail = await this.starRailService.attendance();
    return { genshin, starRail };
  }

  async putOfficialCoupon() {
    const couponCodes = await this.genshinService.getOfficialCoupon();
    if (!couponCodes.length)
      return { result: false, message: '쿠폰 코드가 없습니다.' };

    for (const couponCode of couponCodes) {
      await this.genshinService.addCoupon({
        code: couponCode,
        type: 'genshin',
      });
    }
  }
}
