import { Module } from '@nestjs/common';
import { HoyolabService } from './application/hoyolab.service';
import { GenshinService } from './application/genshin.service';
import { HonkaiStarRailService } from './application/honkai-starrail.service';

@Module({
  //   controllers: [],
  providers: [HoyolabService, GenshinService, HonkaiStarRailService],
  exports: [HoyolabService, GenshinService, HonkaiStarRailService],
})
export class HoyolabModule {}
