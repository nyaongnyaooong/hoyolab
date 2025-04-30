import { Injectable, NotFoundException } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { DateTime } from 'luxon';
import { HoyolabService } from './hoyolab.service';
import { CodeRepository } from 'src/infrastructure/persistence/repositories/hoyolab/code.repository';

@Injectable()
export class GenshinService {
  constructor(
    private readonly hoyolabService: HoyolabService,
    private readonly codeRepository: CodeRepository,
  ) {}

  async attendance() {
    const axiosInstance = this.hoyolabService.setAxiosInstance();
    const newCookie = this.hoyolabService.makeCookie();

    this.hoyolabService.updateCookie({ axiosInstance, newCookie });
    const body = {
      act_id: 'e202102251931481',
    };
    try {
      const response = await axiosInstance.post(
        this._genshinUrl.attendance,
        body,
      );

      const setCookie = response.headers['set-cookie'];
      if (setCookie && setCookie.length) {
        this.hoyolabService.updateCookie({
          axiosInstance,
          newCookie: setCookie,
        });
      }
      console.log(response.data);

      if (this.isSuccess(response.data)) {
        return {
          result: true,
          message: response?.data?.message,
        };
      }

      return {
        result: false,
        message: response?.data?.message,
      };
    } catch (error) {
      // if (error instanceof AxiosError) {
      //   return error.response?.data;
      // }
      console.log(error);
      throw new Error('Failed to get genshin attendance');
    }
  }

  async getOfficialCoupon() {
    const axiosInstance = this.hoyolabService.setAxiosInstance();

    const { data: body } = await axiosInstance.get(this._genshinUrl.guide);

    const { data: guideData } = body;
    const { modules } = guideData;

    const couponCodes: string[] = [];
    for (const module of modules) {
      const { exchange_group } = module;
      if (!exchange_group) continue;

      const { bonuses } = exchange_group;
      if (!bonuses) continue;

      for (const bonus of bonuses) {
        const { exchange_code } = bonus;
        if (exchange_code) couponCodes.push(exchange_code);
      }
    }

    return couponCodes;
  }

  async addCoupon(input: { code: string; type: 'genshin' }) {
    return await this.codeRepository.addCoupon(input);
  }

  async addCouponString(input: { string: string; type: 'genshin' }) {
    const { string } = input;
    const codes = this.parseCodes(string);

    let successCount = 0;
    for (const code of codes) {
      try {
        await this.addCoupon({ code, type: 'genshin' });
        successCount++;
      } catch (error) {
        console.log(error);
      }
    }

    if (!successCount) {
      throw new NotFoundException(`No available codes found : ${codes}`);
    }

    return 'OK';
    // return await this.codeRepository.addCoupon(input);
  }

  async getNotRedeemedCoupons() {
    return await this.codeRepository.getNotRedeemedCoupons();
  }

  async redeemCoupon(couponCode: string) {
    const axiosInstance = this.hoyolabService.setAxiosInstance();
    const newCookie = this.hoyolabService.makeCookie();

    this.hoyolabService.updateCookie({ axiosInstance, newCookie });

    const params = {
      uid: '895558371',
      region: 'os_asia',
      lang: 'ko',
      cdkey: couponCode,
      game_biz: 'hk4e_global',
      sLangKey: 'en-us',
    };

    const response = await axiosInstance.get(this._genshinUrl.redeemCoupon, {
      params,
    });
    return response.data;
  }

  async setRedeemed(couponCode: string) {
    return await this.codeRepository.setRedeemed(couponCode);
  }

  async setExpired(couponCode: string) {
    return await this.codeRepository.setExpired(couponCode);
  }

  async setDelete(couponCode: string) {
    return await this.codeRepository.setDelete(couponCode);
  }

  private isSuccess(responseData: any) {
    return responseData?.retcode === 0;
  }

  private _genshinUrl = {
    attendance: 'https://sg-hk4e-api.hoyolab.com/event/sol/sign',
    guide:
      'https://bbs-api-os.hoyolab.com/community/painter/wapi/circle/channel/guide/material?game_id=2',
    redeemCoupon:
      'https://public-operation-hk4e.hoyoverse.com/common/apicdkey/api/webExchangeCdkey',
  };

  private parseCodes = (string: string): string[] => {
    const regex = /code=([A-Z]+)/g;
    const matches = [...string.matchAll(regex)];
    return matches.map((match) => match[1]);
  };
}
