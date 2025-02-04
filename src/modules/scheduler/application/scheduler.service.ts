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

    const couponResult = {};
    let index = 0;
    for (const couponCode of couponCodes) {
      couponResult[couponCode] =
        await this.genshinService.redeemCoupon(couponCode);

      if (index === couponCodes.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
      index++;
    }
    const text = JSON.stringify(couponResult);

    const channelId = process.env.DISCORD_CHANNEL_ID;
    return await this.discordService.sendEmbedMessageToChannel({
      channelId,
      title: '공식 쿠폰 리딤 결과',
      message: text,
    });
  }
}
