import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { DateTime } from 'luxon';

@Injectable()
export class DiscordService {
  private discordClient: Client;
  private discordToken: string;

  constructor() {
    // 토큰 초기화
    this.discordToken = process.env.DISCORD_BOT_TOKEN;

    // discord client 초기화
    this.discordClient = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
    this.discordClient.login(this.discordToken);

    // 3. 봇이 준비됐을때 한번만(once) 표시할 메시지
    this.discordClient.once(Events.ClientReady, (readyClient) => {
      console.log(`Ready!! Logged in as ${readyClient.user.tag}`);
    });

    // 4. 누군가 ping을 작성하면 pong으로 답장한다.
    this.discordClient.on('messageCreate', async (message) => {
      if (message.content === 'ping') {
        message.reply('pong');

        const channelId = process.env.DISCORD_CHANNEL_ID;
        const channel = this.discordClient.channels.cache.get(channelId);
        if (channel && channel.isSendable()) {
          await channel.send('pongpong');
        }
      }

      if (['망고야', '망고야~'].includes(message.content)) {
        message.reply('야옹~');
      }
    });
  }

  // 특정 채널에 메세지 전송
  async sendMessageToChannel(channelId: string, message: string) {
    const channel = await this.discordClient.channels.fetch(channelId);

    if (!channel || !channel.isSendable()) {
      throw new BadRequestException('채널을 찾을 수 없습니다.');
    }
    return await channel.send(message);
  }
}
