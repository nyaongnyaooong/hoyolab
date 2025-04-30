import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { DateTime } from 'luxon';

@Injectable()
export class HoyolabService {
  constructor() {}

  setAxiosInstance() {
    return axios.create({
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'x-rpc-app_version': '1.5.0',
        'x-rpc-client_type': '5',
        'x-rpc-env': 'default',
        'x-rpc-lang': 'ko-kr',
        'x-rpc-language': 'ko-kr',
        'x-rpc-page': 'v5.3.0-gr-sea_#/ys',
        'x-rpc-platform': '4',
      },
    });
  }

  /**
   * 쿠키가 설정되어 있는지 확인하는 메소드
   * @returns 쿠키가 설정되어 있으면 true, 아니면 false
   */
  isCookieSet(input: { axiosInstance: AxiosInstance }) {
    const { axiosInstance } = input;
    if ('cookie' in axiosInstance.defaults.headers.common) {
      // 보안을 위해서 true로 리턴할 것
      return axiosInstance.defaults.headers.common['cookie'];
      return true;
    }
    return false;
  }
  /**
   * 최초 요청 전 토큰 정보 업데이트
   * @param input 토큰 정보
   */
  initToken(input: { cookieToken?: string; ltoken?: string; ltuid?: string }) {
    const { cookieToken, ltoken, ltuid } = input;
    // todo 어디서 토큰 정보를 저장할 것인가?
  }
  /**
   * axios instance에 넣을 쿠키 정보를 생성한다
   * @returns 쿠키 정보
   */
  makeCookie() {
    // todo 토큰 가져와야함
    const cookieToken = process.env.COOKIE_TOKEN_V2;
    const ltoken = process.env.LTOKEN;
    const ltuid = process.env.LTUID;
    const accountMidV2 = process.env.MID_V2;

    return [
      `cookie_token_v2=${cookieToken};`,
      `ltoken_v2=${ltoken};`,
      `ltuid_v2=${ltuid};`,
      `account_id_v2=${ltuid};`,
      `account_mid_v2=${accountMidV2};`,
    ];
  }
  /**
   * axios instance에 쿠키를 업데이트하여 다음 요청에는 새로운 쿠키 정보로 서버에 요청하도록 한다
   * @param input 새로운 쿠키 정보
   */
  updateCookie(input: { axiosInstance: AxiosInstance; newCookie: string[] }) {
    const { axiosInstance, newCookie } = input;
    // 기존 쿠키 가져오기
    const existingCookies =
      axiosInstance.defaults.headers.common['cookie'] || '';
    // 새로운 쿠키 값만 추출하여 세미콜론으로 구분된 문자열 생성
    const newCookies = input.newCookie
      .map((cookie) => cookie.split(';')[0])
      .join('; ');
    // 기존 쿠키와 새로운 쿠키 결합
    const updatedCookies = [existingCookies, newCookies]
      .filter(Boolean)
      .join('; ');

      console.log(updatedCookies)

    axiosInstance.defaults.headers.common['cookie'] = updatedCookies;
    return axiosInstance;
  }

  
}
