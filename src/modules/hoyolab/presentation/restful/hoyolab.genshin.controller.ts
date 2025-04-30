import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { GenshinService } from 'src/modules/hoyolab/application/genshin.service';
import { HonkaiStarRailService } from 'src/modules/hoyolab/application/honkai-starrail.service';

@Controller('hoyolab/genshin')
export class GenshinController {
  private readonly logger = new Logger(GenshinController.name);
  constructor(
    private readonly genshinService: GenshinService,
    private readonly starRailService: HonkaiStarRailService,
  ) {}

  @Post('code')
  async addCode(@Body() body: { code: string }) {
    const { code } = body;

    return await this.genshinService.addCoupon({
      code,
      type: 'genshin',
    });
  }

  @Post('code/string')
  async addCodeString(@Body() body: { string: string }) {
    const { string } = body;

    return await this.genshinService.addCouponString({
      string,
      type: 'genshin',
    });
  }
}
