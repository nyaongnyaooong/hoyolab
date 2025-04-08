import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { Client, EmbedBuilder, Events, GatewayIntentBits } from 'discord.js';
import { DateTime } from 'luxon';

@Injectable()
export class DiscordService {
  private discordClient: Client;
  private discordToken: string;
  private answerList: string[] = [
    '망고여',
    '망고얌',
    '망고양',
    '망고야',
    '망고야~',
  ];

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

      if (this.answerList.includes(message.content)) {
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

  async sendEmbedMessageToChannel(input: {
    channelId: string;
    title: string;
    message: string;
  }) {
    const { channelId, title, message } = input;

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(message)
      .setColor('#00FF00')
      .setDescription(`\`\`\`fix\n${message}\`\`\``);

    const channel = await this.discordClient.channels.fetch(channelId);
    if (!channel || !channel.isSendable()) {
      throw new BadRequestException('채널을 찾을 수 없습니다.');
    }
    return await channel.send({ embeds: [embed] });
  }

  async sendWebhookMessage(input: {
    webhookUrl: string;
    body: {
      content?: string;
      embeds?: any[];
      attachments?: any[];
    };
  }) {
    const { webhookUrl, body } = input;

    try {
      await axios.post(webhookUrl, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

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
