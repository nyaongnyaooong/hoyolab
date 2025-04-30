import { Module } from '@nestjs/common';
import { HoyolabService } from './application/hoyolab.service';
import { GenshinService } from './application/genshin.service';
import { HonkaiStarRailService } from './application/honkai-starrail.service';
import { CodeRepository } from 'src/infrastructure/persistence/repositories/hoyolab/code.repository';

@Module({
  //   controllers: [],
  providers: [HoyolabService, GenshinService, HonkaiStarRailService, CodeRepository],
  exports: [HoyolabService, GenshinService, HonkaiStarRailService, CodeRepository],
})
export class HoyolabModule {}
