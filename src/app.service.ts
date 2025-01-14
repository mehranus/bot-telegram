




    // const token = '7401231480:AAFqWVn9XWdm-OT3RVIwHepdbjhbpgNtl9o'; // توکن بات تلگرام

    


    import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf, Context, Markup } from 'telegraf';
import { UserService } from './modules/user/user.service';
require('dotenv').config()

interface Reminder {
  userId: number;
  text: string;
  time: Date;
}

@Injectable()
export class AppService implements OnModuleInit {
  private bot: Telegraf;
  private reminders: Reminder[] = []; // آرایه‌ای برای ذخیره یادآورها

  constructor(
    private readonly userService:UserService
  ) {

    const token = process.env.API_BOOT; // توکن بات تلگرام
    this.bot = new Telegraf(token);
  }

  async onModuleInit() {
    // فرمان /start
    this.bot.start(async(ctx) => {
      const userId = ctx.from.id; // شناسه کاربر
      const username = ctx.from.username ;
      const first_name = ctx.from.first_name || 'نام ندارد';
      const last_name = ctx.from.last_name || 'نام خانوادگی ندارد';
        
      await this.userService.create({userId,first_name,last_name,username})

      ctx.reply(
        `سلام${first_name} ${last_name} به بات تلگرام خوش آمدید. لطفاً یکی از گزینه‌های زیر را انتخاب کنید:`,
        Markup.inlineKeyboard([
          [Markup.button.callback('اطلاعات حساب کاربری', 'OPTION_1')],
          [Markup.button.callback('اضافه کردن یاد آور', 'OPTION_2')],
          [Markup.button.callback('گزینه 3', 'OPTION_3')],
        ]),
      );

       // مدیریت رویداد کلیک روی گزینه‌ها
    this.bot.action('OPTION_1', async(ctx) => {
     const user= await this.userService.getUser(username)
      ctx.reply(`نام شما : ${user.first_name} ${user.last_name} 
        id:${user.username}`);
    });

    this.bot.action('OPTION_2', (ctx) => {
      ctx.reply('شما گزینه 2 را انتخاب کردید.');
    });

    this.bot.action('OPTION_3', (ctx) => {
      ctx.reply('شما گزینه 3 را انتخاب کردید.');
    });

   
    });
        // راه‌اندازی بات
    await this.bot.launch();
    console.log('Bot is running...');
  
  }

 
}


