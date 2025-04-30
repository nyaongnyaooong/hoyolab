import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { SchedulerService } from '../../application/scheduler.service';
import { DiscordService } from 'src/modules/discord/application/discord.service';
import { DateTime } from 'luxon';
import { SlackService } from 'src/modules/slack/application/slack.service';
import { GenshinService } from 'src/modules/hoyolab/application/genshin.service';

@Injectable()
export class SchedulerCron {
  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly discordService: DiscordService,
    private readonly slackService: SlackService,
    private readonly genshinService: GenshinService,
    // private readonly logger: Logger,
  ) {}

  // 매일 오전 5시 실행
  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async hoyolabAttend() {
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

  // 평일
  @Cron('58 8,17,19,20,21,23 * * 1-5')
  async mabinogiAlarmWeekday() {
    const barrierTime = DateTime.now()
      .plus({ minutes: 30 })
      .startOf('hour')
      .toFormat('HH:mm');

    const message = `${barrierTime} 결계 알림`;

    // const sendDiscord = await this.discordService.sendEmbedMessageToChannel({
    //   channelId,
    //   title: '결계 알림',
    //   message,
    // });
    // console.log(sendDiscord);

    const sendDiscordWebhook = await this.discordService.sendWebhookMessage({
      webhookUrl: process.env.DISCORD_WEBHOOK_URL,
      body: {
        // content: '결계 알림',
        embeds: [
          {
            title: '📣 결계 알림',
            description: message,
            // description: `@everyone\n${message}`,
            color: 0x00ff00, // 초록색 (성공)
            // color: 0xff0000,  // 빨간색 (에러)
            // color: 0xffff00,  // 노란색 (경고)
            footer: {
              text: `${DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')}`,
            },

            timestamp: new Date().toISOString(),
          },
        ],
      },
    });

    // const sendSlack = await this.slackService.sendMessageToChannel({
    //   webhookUrl: process.env.SLACK_WEBHOOK_URL,
    //   body: {
    //     // text 필드는 알림이 올 때 보이는 폴백 메시지로 사용됩니다
    //     attachments: [
    //       {
    //         color: '#36a64f',
    //         fields: [
    //           {
    //             title: '📣 결계 알림',
    //             value: message,
    //             short: true,
    //           },
    //         ],
    //         footer: 'GitHub Actions',
    //         // footer_icon: 'https://github.githubassets.com/favicon.ico',
    //         ts: `🕐 ${DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')}`,
    //       },
    //     ],
    //     text: message,
    //   },
    // });

    return;
  }

  // 주말
  @Cron('58 2,5,8,11,14,17,19,20,21,23 * * 0,6')
  async mabinogiAlarmWeekend() {
    const barrierTime = DateTime.now()
      .plus({ minutes: 30 })
      .startOf('hour')
      .toFormat('HH:mm');

    const message = `${barrierTime} 결계 알림`;

    // const sendDiscord = await this.discordService.sendEmbedMessageToChannel({
    //   channelId,
    //   title: '결계 알림',
    //   message,
    // });
    // console.log(sendDiscord);

    const sendDiscordWebhook = await this.discordService.sendWebhookMessage({
      webhookUrl: process.env.DISCORD_WEBHOOK_URL,
      body: {
        // content: '결계 알림',
        embeds: [
          {
            title: '📣 결계 알림',
            description: message,
            // description: `@everyone\n${message}`,
            color: 0x00ff00, // 초록색 (성공)
            // color: 0xff0000,  // 빨간색 (에러)
            // color: 0xffff00,  // 노란색 (경고)
            footer: {
              text: `${DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')}`,
            },

            timestamp: new Date().toISOString(),
          },
        ],
      },
    });

    // const sendSlack = await this.slackService.sendMessageToChannel({
    //   webhookUrl: process.env.SLACK_WEBHOOK_URL,
    //   body: {
    //     // text 필드는 알림이 올 때 보이는 폴백 메시지로 사용됩니다
    //     attachments: [
    //       {
    //         color: '#36a64f',
    //         fields: [
    //           {
    //             title: '📣 결계 알림',
    //             value: message,
    //             short: true,
    //           },
    //         ],
    //         footer: 'GitHub Actions',
    //         // footer_icon: 'https://github.githubassets.com/favicon.ico',
    //         ts: `🕐 ${DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')}`,
    //       },
    //     ],
    //     text: message,
    //   },
    // });

    return;
  }

  // 공식 리딤 코드 확인 후 입력
  @Cron(CronExpression.EVERY_DAY_AT_9PM)
  async putOfficialCoupon() {
    return await this.schedulerService.putOfficialCoupon();
  }

  // 미입력 리딤 코드 확인 후 입력
  @Cron(CronExpression.EVERY_10_SECONDS)
  async putNotRedeemedCoupon() {
    const coupons = await this.genshinService.getNotRedeemedCoupons();

    if (coupons.length === 0) {
      console.log('[Auto Redeem] No coupons found');
      return;
    }

    console.log(`[Auto Redeem] Found ${coupons.length} coupons`);

    let totalMsg = '';
    for (const coupon of coupons) {
      await new Promise((resolve) => setTimeout(resolve, 6000));

      const result = await this.genshinService.redeemCoupon(coupon.code);
      console.log(result);
      const resultCode = result?.retcode;
      let msg = '';

      if (!resultCode) {
        msg = `[Auto Redeem] Successfully redeemed coupon: ${coupon.code}`;
        await this.genshinService.setRedeemed(coupon.code);
      }

      if (resultCode === -2017) {
        msg = `[Auto Redeem] Already redeemed coupon: ${coupon.code}`;
      }

      if (resultCode === -2001) {
        msg = `[Auto Redeem] Expired coupon: ${coupon.code}`;
        await this.genshinService.setExpired(coupon.code);
      }

      if (resultCode === -2003) {
        msg = `[Auto Redeem] Invalid redeem coupon: ${coupon.code}`;
        await this.genshinService.setDelete(coupon.code);
      }

      if (resultCode === -2016) {
        console.log(`[Auto Redeem] timeout to redeem coupon: ${coupon.code}`);
        await new Promise((resolve) => setTimeout(resolve, 6000));
        continue;
      }

      if (!msg) {
        msg = `[Auto Redeem] Failed to redeem coupon: ${coupon.code}`;
      }

      console.log(msg);
      totalMsg += msg + '\n';
    }

    const channelId = process.env.DISCORD_CHANNEL_ID;
    await this.discordService.sendEmbedMessageToChannel({
      channelId,
      title: '리딤 코드 자동 입력 결과',
      message: totalMsg,
    });

    return;
  }

  private testKey = 0;
}
