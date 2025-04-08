import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Client, EmbedBuilder, Events, GatewayIntentBits } from 'discord.js';
import { DateTime } from 'luxon';

@Injectable()
export class SlackService {
  constructor() {}

  // 특정 웹훅을 이용하여 메세지 전송
  async sendMessageToChannel(input: {
    webhookUrl: string;
    body: {
      blocks?: {
        type: string;
        text?: {
          type: string;
          text: string;
          emoji?: boolean;
        };
        elements?: {
          type: string;
          text: string;
        }[];
      }[];
      attachments?: any[];
      text?: string;
    };
  }) {
    const { webhookUrl, body } = input;
    try {
      await axios.post(webhookUrl, body);

      return {
        resCode: 0,
        message: '메세지 전송 성공',
      };
    } catch (error) {
      return {
        resCode: -1000,
        message: `메세지 전송 실패 - ${error.message}}`,
      };
    }
  }
}
