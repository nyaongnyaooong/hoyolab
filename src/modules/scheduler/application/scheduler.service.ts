import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { GenshinService } from 'src/modules/hoyolab/application/genshin.service';
import { HonkaiStarRailService } from 'src/modules/hoyolab/application/honkai-starrail.service';

@Injectable()
export class SchedulerService {
  logger = new Logger(SchedulerService.name);
  constructor(
    private readonly genshinService: GenshinService,
    private readonly starRailService: HonkaiStarRailService,
  ) {}

  async attendAll() {
    const genshin = await this.genshinService.attendance();
    const starRail = await this.starRailService.attendance();
    return { genshin, starRail };
  }
}
