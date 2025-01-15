


    import { Injectable, OnModuleInit } from '@nestjs/common';
import { Telegraf, Context, Markup, Scenes, session } from 'telegraf';
import { UserService } from './modules/user/user.service';
import { AlarmService } from './modules/alarm/alarm.service';
import { AlarmEntity } from './modules/alarm/entity/alarm.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { MyContext } from './types/telgraf';
import { CreatAlarmDto } from './modules/alarm/dto/alarm.dto';
require('dotenv').config()



@Injectable()
export class AppService implements OnModuleInit {
  private bot: Telegraf;


  constructor(
    private readonly userService:UserService,
    private readonly alarmService:AlarmService,
  
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
let step = 0; // پیگیری مراحل ایجاد یادآور

// فرمان /start
this.bot.start(async (ctx) => {
  const userId = ctx.from.id; // شناسه کاربر
  const username = ctx.from.username;
  const first_name = ctx.from.first_name || 'کاربر عزیز';
  const last_name = ctx.from.last_name || '';

  await this.userService.create({ userId, first_name, last_name, username });

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
  let objectAlarm = {
    name: '',
    date: '',
    time: '',
    userId: 0,
  };
  // ذخیره userId
  objectAlarm['userId'] = userId;
});

// مدیریت رویداد کلیک روی گزینه‌ها
this.bot.action('OPTION_1', async (ctx) => {
  objectAlarm['userId'] = ctx.from.id;

  // مرحله اول: پرسیدن نام یادآور
  await ctx.reply('🔔 لطفاً نام یادآور خود را وارد کنید:');
  step = 1; // تغییر وضعیت به مرحله اول
});

this.bot.action('OPTION_2',async(ctx)=>{
  console.log("hii")
  const list =await this.alarmService.getAlaram(ctx.from.id)
  const llist=[]
  for (const ll of list.list) {
    llist.push(ll)
  }
  ctx.reply(`${llist}` || `${list.message}`)
})

// مدیریت پاسخ‌های کاربر
this.bot.on('text', async (ctx) => {
  try{
  const text = ctx.message?.text;

  if (step === 1) {
    // ذخیره نام یادآور در مرحله اول
    objectAlarm['name'] = text;
    ctx.reply(`
      🗓️ چند روز یکبار؟\n
*اگر نمی‌خواهید یادآور مکرر باشد، فقط تاریخ مورد نظر خود را به صورت زیر وارد نمایید:* 
(مثال: 1403/10/27)  
    `);
    step = 2; // تغییر وضعیت به مرحله دوم
  } else if (step === 2) {
    // ذخیره تاریخ در مرحله دوم
    objectAlarm['date'] = text;
    ctx.reply(`
      ⏰ لطفاً زمان یادآور را وارد کنید (مثال: 13:27):
    `);
    step = 3; // تغییر وضعیت به مرحله سوم
  } else if (step === 3) {
    // ذخیره زمان در مرحله سوم
    objectAlarm['time'] = text;
    const alarm=await this.alarmService.create(objectAlarm);
   
    ctx.reply(alarm.message);

    // ذخیره اطلاعات یادآور

    // ارسال دکمه برای بازگشت به منوی اصلی
    if(alarm.message){
    ctx.reply('برای بازگشت به منوی اصلی، روی دکمه زیر کلیک کنید:', Markup.inlineKeyboard([
      [Markup.button.callback('🔙 بازگشت به منوی اصلی', 'BACK_TO_MAIN_MENU')]
    ]));
  }

 
    step = 0; // ریست کردن مرحله
  }
}catch (error) {
  console.error(error);

  ctx.reply('متاسفانه مشکلی پیش آمده است. برای بازگشت به منوی اصلی، روی دکمه زیر کلیک کنید:', Markup.inlineKeyboard([
    [Markup.button.callback('🔙 بازگشت به منوی اصلی', 'BACK_TO_MAIN_MENU')]
  ]));
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

// راه‌اندازی بات
this.bot.launch();
console.log('Bot is running...');


 }
}


