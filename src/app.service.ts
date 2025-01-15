import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';
import { UserService } from './modules/user/user.service';
import { AlarmService } from './modules/alarm/alarm.service';
require('dotenv').config();

@Injectable()
export class AppService implements OnModuleInit {
  private bot: Telegraf;
  private userSteps: { [userId: number]: number } = {}; // ذخیره مرحله برای هر کاربر

  constructor(
    private readonly userService: UserService,
    private readonly alarmService: AlarmService,
  ) {
    const token = process.env.API_BOOT; // توکن بات تلگرام
    this.bot = new Telegraf(token);
  }

  async onModuleInit() {
    let objectAlarm = {
      name: '',
      date: '',
      time: '',
      userId: 0,
    };

    // فرمان /start
    this.bot.start(async (ctx) => {
      const userId = ctx.from.id; // شناسه کاربر
      const first_name = ctx.from.first_name || 'کاربر عزیز';
      const last_name = ctx.from.last_name || '';
      const username = ctx.from.username ;

      await this.userService.create({ userId, first_name, last_name,username });

      // نمایش منوی اصلی
      ctx.reply(
        `سلام ${first_name} عزیز! 🌟\n\nبه ربات یادآور خوش آمدید. 🙏\nلطفاً یکی از گزینه‌های زیر را برای شروع انتخاب کنید:`,
        Markup.inlineKeyboard([
          [Markup.button.callback('📅 افزودن یادآور', 'OPTION_1')],
          [Markup.button.callback('📋 لیست یادآورها', 'OPTION_2')],
          [Markup.button.callback('✏️ ویرایش یادآور', 'OPTION_3')],
          [Markup.button.callback('❌ حذف یادآور', 'OPTION_4')],
        ])
      );
    });

    // مدیریت رویداد کلیک روی گزینه‌ها
    this.bot.action('OPTION_1', async (ctx) => {
      const userId = ctx.from.id;
      objectAlarm['userId'] = userId;
      this.userSteps[userId] = 1; // تغییر وضعیت به مرحله اول

      // مرحله اول: پرسیدن نام یادآور
      await ctx.reply('🔔 لطفاً نام یادآور خود را وارد کنید:');
    });

    // مدیریت پاسخ‌های کاربر
    this.bot.on('text', async (ctx) => {
      const text = ctx.message?.text;
      const userId = ctx.from.id;

      try {
        // مرحله 1: ذخیره نام یادآور
        if (this.userSteps[userId] === 1) {
          objectAlarm['name'] = text;
          ctx.reply(
            `🗓️ چند روز یکبار؟\n*اگر نمی‌خواهید یادآور مکرر باشد، فقط تاریخ مورد نظر خود را به صورت زیر وارد نمایید:* (مثال: 1403/10/27)`,
            Markup.inlineKeyboard([
              [Markup.button.callback('🔁 هرروز', 'DAY')],
              [Markup.button.callback('2️⃣ دو روز یکبار', 'DAY_2')],
              [Markup.button.callback('3️⃣ سه روز یکبار', 'DAY_3')],
              [Markup.button.callback('7️⃣ هفته ای یکبار', 'WEEK')],
              [Markup.button.callback('⏺️ ماهی یکبار', 'MANET')],
            ])
          );
          this.userSteps[userId] = 2; // تغییر وضعیت به مرحله دوم
        }

        // مرحله 2: ذخیره تاریخ انتخابی
        else if (this.userSteps[userId] === 2) {
          objectAlarm['date'] = text;
          ctx.reply('⏰ لطفاً زمان یادآور را وارد کنید (مثال: 13:27):');
          this.userSteps[userId] = 3; // تغییر وضعیت به مرحله سوم
        }

        // مرحله 3: ذخیره زمان انتخابی
        else if (this.userSteps[userId] === 3) {
          objectAlarm['time'] = text;
          const alarm = await this.alarmService.create(objectAlarm);
          ctx.reply(alarm.message);

          // بازگشت به منوی اصلی
          this.userSteps[userId] = 0; // ریست کردن وضعیت
          ctx.reply(
            'برای بازگشت به منوی اصلی، روی دکمه زیر کلیک کنید:',
            Markup.inlineKeyboard([[Markup.button.callback('🔙 بازگشت به منوی اصلی', 'BACK_TO_MAIN_MENU')]])
          );
        }
      } catch (error) {
        console.error(error);
        ctx.reply('متاسفانه مشکلی پیش آمده است. برای بازگشت به منوی اصلی، روی دکمه زیر کلیک کنید:', Markup.inlineKeyboard([[Markup.button.callback('🔙 بازگشت به منوی اصلی', 'BACK_TO_MAIN_MENU')]]));
      }
    });

    // مدیریت بازگشت به منوی اصلی
    this.bot.action('BACK_TO_MAIN_MENU', (ctx) => {
      ctx.reply(
        '🌟 شما به منوی اصلی برگشتید! \n\nلطفاً یکی از گزینه‌های زیر را انتخاب کنید:',
        Markup.inlineKeyboard([
          [Markup.button.callback('📅 افزودن یادآور', 'OPTION_1')],
          [Markup.button.callback('📋 لیست یادآورها', 'OPTION_2')],
          [Markup.button.callback('✏️ ویرایش یادآور', 'OPTION_3')],
          [Markup.button.callback('❌ حذف یادآور', 'OPTION_4')],
        ])
      );
    });

    // برای دکمه‌های روزها
    this.bot.action('DAY', (ctx) => {
      const futureTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
      const futureDate = futureTime.toLocaleDateString('fa-IR'); // تاریخ به‌صورت شمسی
      objectAlarm['date'] = futureDate;
      ctx.reply(`تاریخ انتخابی: ${futureDate}`);
      this.userSteps[ctx.from.id] = 2; // تغییر مرحله به 2
    });

    this.bot.action('DAY_2', (ctx) => {
      const futureTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 48);
      const futureDate = futureTime.toLocaleDateString('fa-IR');
      objectAlarm['date'] = futureDate;
      ctx.reply(`تاریخ انتخابی: ${futureDate}`);
      this.userSteps[ctx.from.id] = 2; // تغییر مرحله به 2
    });

    this.bot.action('DAY_3', (ctx) => {
      const futureTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 72);
      const futureDate = futureTime.toLocaleDateString('fa-IR');
      objectAlarm['date'] = futureDate;
      ctx.reply(`تاریخ انتخابی: ${futureDate}`);
      this.userSteps[ctx.from.id] = 2; // تغییر مرحله به 2
    });

    this.bot.action('WEEK', (ctx) => {
      const futureTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 168);
      const futureDate = futureTime.toLocaleDateString('fa-IR');
      objectAlarm['date'] = futureDate;
      ctx.reply(`تاریخ انتخابی: ${futureDate}`);
      this.userSteps[ctx.from.id] = 2; // تغییر مرحله به 2
    });

    this.bot.action('MANET', (ctx) => {
      const futureTime = new Date(new Date().getTime() + 1000 * 60 * 60 * 720);
      const futureDate = futureTime.toLocaleDateString('fa-IR');
      objectAlarm['date'] = futureDate;
      ctx.reply(`تاریخ انتخابی: ${futureDate}`);
      this.userSteps[ctx.from.id] = 2; // تغییر مرحله به 2
    });

    // راه‌اندازی بات
    this.bot.launch();
    console.log('Bot is running...');
  }
}
