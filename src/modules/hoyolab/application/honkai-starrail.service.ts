import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { DateTime } from 'luxon';
import { HoyolabService } from './hoyolab.service';

@Injectable()
export class HonkaiStarRailService {
  constructor(private readonly hoyolabService: HoyolabService) {}

  async attendance() {
    const axiosInstance = this.hoyolabService.setAxiosInstance();
    const newCookie = this.hoyolabService.makeCookie();

    this.hoyolabService.updateCookie({ axiosInstance, newCookie });
    const body = {
      act_id: 'e202303301540311',
      lang: 'ko-kr',
    };
    try {
      const response = await axiosInstance.post(
        this._starRailUrl.attendance,
        body,
      );

      const setCookie = response.headers['set-cookie'];
      if (setCookie && setCookie.length) {
        this.hoyolabService.updateCookie({
          axiosInstance,
          newCookie: setCookie,
        });
      }

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return error.response?.data;
      }
      console.log(error);
      throw new Error('Failed to get genshin attendance');
    }
  }

  private _starRailUrl = {
    attendance: 'https://sg-public-api.hoyolab.com/event/luna/hkrpg/os/sign',
  };
}
