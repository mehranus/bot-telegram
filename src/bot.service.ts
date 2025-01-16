import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import * as ytdl from 'ytdl-core';

require('dotenv').config();

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Telegraf;

  constructor() {
    const token = process.env.API_BOOT; // توکن بات تلگرام
    this.bot = new Telegraf(token);
  }

  async onModuleInit() {
    this.bot.start(async (ctx) => {
      // پیام خوش‌آمدگویی
      await ctx.reply(`
        لینکو بفرست
      `);
    });

    this.bot.on('text', async (ctx) => {
      const chatId = ctx.chat.id; // دریافت chatId

      // بررسی اینکه آیا پیام متنی است
      const text = ctx.message?.text;

      if (!text) {
        // اگر پیام متنی نباشد
        await ctx.telegram.sendMessage(chatId, 'لطفاً یک لینک معتبر ارسال کنید.');
        return;
      }

      const url = text; // لینک ارسال‌شده توسط کاربر

      // let info = await ytdl.getInfo(url);
      // console.log(info)

      // بررسی اعتبار لینک یوتیوب
      console.log('url:',); // برای بررسی اعتبار لینک
      if (ytdl.validateURL(url)) {
        const info = await ytdl.getInfo(url);
        console.log("info",info)
        const videoUrl = ytdl.chooseFormat(info.formats, { quality: 'highest' }).url;
        console.log("url",videoUrl)

        // ارسال لینک دانلود
        await ctx.telegram.sendMessage(chatId, `🎥 لینک مستقیم دانلود: ${videoUrl}`);
      } else {
        // ارسال پیام خطا در صورت نادرست بودن لینک
        
        await ctx.telegram.sendMessage(chatId, '❌ لینک معتبری نیست.');
      }
    });

    // راه‌اندازی بات
    this.bot.launch();
  }
}
