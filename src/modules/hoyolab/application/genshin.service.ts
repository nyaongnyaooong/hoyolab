import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { DateTime } from 'luxon';
import { HoyolabService } from './hoyolab.service';

@Injectable()
export class GenshinService {
  constructor(private readonly hoyolabService: HoyolabService) {}

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
}
