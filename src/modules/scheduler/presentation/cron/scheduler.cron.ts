import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, Interval, Timeout } from '@nestjs/schedule';
import { SchedulerService } from '../../application/scheduler.service';
import { DiscordService } from 'src/modules/discord/application/discord.service';
import { DateTime } from 'luxon';
import { SlackService } from 'src/modules/slack/application/slack.service';

@Injectable()
export class SchedulerCron {
  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly discordService: DiscordService,
    private readonly slackService: SlackService,
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

  @Cron('59 2/3 * * *')
  // @Cron(CronExpression.EVERY_10_SECONDS)
  async mabinogiBarrierAlarm() {
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
    if (this.testKey) return;
    this.testKey = 1;

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

            // fields: [
            //   {
            //     name: '상태',
            //     value: '✅ 성공',
            //     inline: true,
            //   },
            //   {
            //     name: '타입',
            //     value: '시스템 알림',
            //     inline: true,
            //   },
            // ],
            // thumbnail: {
            //   url: 'https://your-thumbnail-url.com/image.png',
            // },
            // image: {
            //   url: 'https://your-image-url.com/image.png',
            // },
            // author: {
            //   name: '시스템 봇',
            //   icon_url: 'https://your-icon-url.com/icon.png',
            // },
            footer: {
              text: `${DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')}`,
            },

            timestamp: new Date().toISOString(),
          },
        ],
      },
    });
    console.log(sendDiscordWebhook);

    const sendSlack = await this.slackService.sendMessageToChannel({
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      body: {
        // blocks: [
        //   {
        //     type: 'header',
        //     text: {
        //       type: 'plain_text',
        //       text: '📣 결계 알림',
        //       emoji: true,
        //     },
        //   },
        //   {
        //     type: 'section',
        //     text: {
        //       type: 'mrkdwn',
        //       text: message,
        //     },
        //   },
        //   {
        //     type: 'context',
        //     elements: [
        //       {
        //         type: 'mrkdwn',
        //         text: `🕐 ${DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')}`,
        //       },
        //     ],
        //   },
        // ],
        // text 필드는 알림이 올 때 보이는 폴백 메시지로 사용됩니다
        attachments: [
          {
            color: '#36a64f',
            fields: [
              {
                title: '📣 결계 알림',
                value: message,
                short: true,
              },
            ],
            footer: 'GitHub Actions',
            // footer_icon: 'https://github.githubassets.com/favicon.ico',
            ts: `🕐 ${DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss')}`,
          },
        ],
        text: message,
      },
    });
    console.log(sendSlack);

    return;
  }

  // 공식 리딤 코드 확인 후 입력
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async putOfficialCoupon() {
    return await this.schedulerService.putOfficialCoupon();
  }

  private testKey = 0;
}
