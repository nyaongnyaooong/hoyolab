import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerCron } from './presentation/cron/scheduler.cron';
import { SchedulerService } from './application/scheduler.service';
import { GenshinService } from '../hoyolab/application/genshin.service';
import { HoyolabService } from '../hoyolab/application/hoyolab.service';
import { HoyolabModule } from '../hoyolab/hoyolab.module';
import { DiscordModule } from '../discord/discord.module';
import { SlackModule } from '../slack/slack.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HoyolabModule,
    DiscordModule,
    SlackModule,
  ],
  //   controllers: [],
  providers: [SchedulerCron, SchedulerService],
})
export class SchedulerModule {}
