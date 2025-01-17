import { Injectable, OnModuleInit } from "@nestjs/common";
import { Markup, session, Telegraf } from "telegraf";
import { MyContext } from "./types/telgraf";
import { UserService } from "./modules/user/user.service";
import { map } from "rxjs";
import { text } from "stream/consumers";

// ایجاد یک Map برای ذخیره وضعیت کاربران
const userStates = new Map<number, { step: number; objectfall: any }>();

require("dotenv").config();

@Injectable()
export class FallService implements OnModuleInit {
  private bot: Telegraf;

  constructor(private readonly userService: UserService) {
    const token = process.env.API_BOOT; // توکن بات تلگرام
    this.bot = new Telegraf(token);
  }

  async onModuleInit() {
    this.bot.start(async (ctx) => {
      const userId = ctx.from.id; // شناسه کاربر
      const first_name = ctx.from.first_name || "کاربر عزیز";
      const last_name = ctx.from.last_name || "";
      const username = ctx.from.username;
      // نمایش منوی اصلی
      ctx.reply(
        `سلام ${first_name} عزیز! 🌟\n\nبه دنیای فال‌ها خوش آمدید. 🙌\nلطفاً یکی از گزینه‌های زیر را انتخاب کنید و سفر خود را آغاز کنید:`,
        Markup.inlineKeyboard([
          [
            Markup.button.callback("🔮 فال روزانه", "OPTION_1"), // مناسب برای پیش‌بینی‌های روزانه
            ,
            Markup.button.callback("📖 فال حافظ", "OPTION_2"), // مرتبط با کتاب و اشعار
          ],
          [
            Markup.button.callback("🎴 فال تاروت", "OPTION_3"), // مرتبط با کارت تاروت
            ,
            Markup.button.callback("❤️ فال عشق", "OPTION_4"), // مرتبط با عشق و روابط
          ],
        ])
      );
    });

    // تنظیم دکمه‌های منو
    this.bot.telegram.setMyCommands([
      { command: "start", description: "✨ شروع ربات" },
      { command: "main_menu", description: "📋 منوی اصلی" },
      { command: "back", description: "🔙 بازگشت به مرحله قبل" },
    ]);

    // پاسخ به دستور /main_menu
    this.bot.command("main_menu", async (ctx) => {
      const first_name = ctx.from.first_name || "کاربر عزیز";
      await ctx.reply(
        `سلام ${first_name} عزیز! 🌟\n\nبه دنیای فال‌ها خوش آمدید. 🙌\nلطفاً یکی از گزینه‌های زیر را انتخاب کنید و سفر خود را آغاز کنید:`,
        Markup.inlineKeyboard([
          [
            Markup.button.callback("🔮 فال روزانه", "OPTION_1"), // مناسب برای پیش‌بینی‌های روزانه
            ,
            Markup.button.callback("📖 فال حافظ", "OPTION_2"), // مرتبط با کتاب و اشعار
          ],
          [
            Markup.button.callback("🎴 فال تاروت", "OPTION_3"), // مرتبط با کارت تاروت
            ,
            Markup.button.callback("❤️ فال عشق", "OPTION_4"), // مرتبط با عشق و روابط
          ],
        ])
      );
    });

    // پاسخ به دستور /back
    this.bot.command("back", (ctx) => {
      ctx.reply("🔙 شما به مرحله قبلی بازگشتید.");
    });

    this.bot.action("main_menu", async (ctx) => {
      const first_name = ctx.from.first_name || "کاربر عزیز";
      await ctx.reply(
        `سلام ${first_name} عزیز! 🌟\n\nبه دنیای فال‌ها خوش آمدید. 🙌\nلطفاً یکی از گزینه‌های زیر را انتخاب کنید و سفر خود را آغاز کنید:`,
        Markup.inlineKeyboard([
          [
            Markup.button.callback("🔮 فال روزانه", "OPTION_1"), // مناسب برای پیش‌بینی‌های روزانه
            ,
            Markup.button.callback("📖 فال حافظ", "OPTION_2"), // مرتبط با کتاب و اشعار
          ],
          [
            Markup.button.callback("🎴 فال تاروت", "OPTION_3"), // مرتبط با کارت تاروت
            ,
            Markup.button.callback("❤️ فال عشق", "OPTION_4"), // مرتبط با عشق و روابط
          ],
        ])
      );
    });

    this.bot.action("OPTION_4", async (ctx) => {
      const userId = ctx.from.id;

      // اگر وضعیت قبلی وجود نداشت، مقدار اولیه تنظیم شود
      if (!userStates.has(userId)) {
        userStates.set(userId, {
          step: 4,
          objectfall: {
            name: "",
            date: "",
            love: "",
            username: ctx.from.username || "",
            userId: userId,
          },
        });
      }

      // دریافت وضعیت کاربر
      const userState = userStates.get(userId);
      if (!userState) return;

      const { step, objectfall } = userState;

      if (step === 4) {
        await ctx.reply("لطفاً اسم خود را وارد کنید:");

        userState.step = 5; // انتقال به مرحله 2
      }
    });
    this.bot.action("OPTION_1", async (ctx) => {
      const userId = ctx.from.id;
      const isUser = await this.userService.getFallUser(ctx.from.username);

      if (!isUser) {
        // اگر وضعیت قبلی وجود نداشت، مقدار اولیه تنظیم شود
        if (!userStates.has(userId)) {
          userStates.set(userId, {
            step: 1,
            objectfall: {
              name: "",
              date: "",
              username: ctx.from.username || "",
              userId: userId,
            },
          });
        }

        // دریافت وضعیت کاربر
        const userState = userStates.get(userId);
        if (!userState) return;

        const { step, objectfall } = userState;

        if (step === 1) {
          await ctx.reply("لطفاً نام خانوادگی خود را وارد کنید:");
          userState.step = 2; // انتقال به مرحله 2
        }
      } else {
        const { fall } = await this.userService.createFall(isUser);

        // ارسال فال روزانه
        const processingMessage = await ctx.reply('⏳ در حال پردازش... لطفاً کمی صبر کنید.');

        // ایجاد تایمر ۵ ثانیه‌ای
        setTimeout(async () => {
          // حذف پیام "در حال پردازش..."
          await ctx.deleteMessage(processingMessage.message_id);

          // ارسال پیام فال روزانه
          await ctx.reply(
            `🌟 فال روزانه شما:\n\nسلام ${fall.name} عزیز!\n` +
            `${fall.fortune}\n` +
            `منتظر روزهای بهتر باشید. همیشه فرصت‌های جدید در پیش است! 🌞`,
            Markup.inlineKeyboard([
              [Markup.button.callback('🔙 بازگشت به منوی اصلی', 'main_menu')]
            ])
          );

          // حذف وضعیت کاربر از لیست
          userStates.delete(userId);
        }, 3000); // 5000 میلی‌ثانیه = 5 ثانیه
        await processingMessage;
        userStates.delete(userId);
      }
    });

    // شنیدن پیام‌های متنی (برای دریافت ورودی‌ها)
    this.bot.on("text", async (ctx) => {
      const userId = ctx.from.id;
      const userState = userStates.get(userId);
      if (!userState) return;

      const { step, objectfall } = userState;

      if (step === 2) {
        // دریافت نام خانوادگی
        objectfall.name = ctx.message.text;
        await ctx.reply(
          "لطفاً تاریخ تولد خود را وارد کنید (به صورت YYYY-MM-DD):"
        );
        userState.step = 3; // انتقال به مرحله 3
      } else if (step === 3) {
        // دریافت تاریخ تولد
        objectfall.date = ctx.message.text;

        const { fall } = await this.userService.createFall(objectfall);

        // ارسال فال روزانه
       
        // نمایش پیام "در حال پردازش..."
        const processingMessage = await ctx.reply('⏳ در حال پردازش... لطفاً کمی صبر کنید.');

        // ایجاد تایمر ۵ ثانیه‌ای
        setTimeout(async () => {
          // حذف پیام "در حال پردازش..."
          await ctx.deleteMessage(processingMessage.message_id);

          // ارسال پیام فال روزانه
          await ctx.reply(
            `🌟 فال روزانه شما:\n\nسلام ${fall.name} عزیز!\n` +
            `${fall.fortune}\n` +
            `منتظر روزهای بهتر باشید. همیشه فرصت‌های جدید در پیش است! 🌞`,
            Markup.inlineKeyboard([
              [Markup.button.callback('🔙 بازگشت به منوی اصلی', 'main_menu')]
            ])
          );

          // حذف وضعیت کاربر از لیست
          userStates.delete(userId);
        }, 3000); // 5000 میلی‌ثانیه = 5 ثانیه
        await processingMessage;





        // پاک کردن وضعیت کاربر پس از تکمیل
        userStates.delete(userId);
      }

      if (step === 5) {
        objectfall.name = ctx.message.text;
        await ctx.reply("لطفاً اسم عشق خود را وارد کنید:");
        userState.step = 6; // انتقال به مرحله 2
      } else if (step === 6) {
        objectfall.love=ctx.message.text
        const { fall } = await this.userService.createFalLove({
          love: objectfall.love,
          name: objectfall.name,
          username: objectfall.username,
          userId: objectfall.userId,
        });
        objectfall.love = ctx.message.text;
        if(objectfall.love === objectfall.name){
          await ctx.reply("به نظر می‌رسه که اشتباهی اسم خودت رو به جای اسم عشق‌ت وارد کردی! 😄 هرچند که ممکنه این هم یه نوع محبت خاص باشه! 💖 لطفاً اسم خودت و عشق‌ت رو دوباره وارد کن تا فال به درستی اجرا بشه. 🌹"
            ,
            Markup.inlineKeyboard([
              [Markup.button.callback("🔙 بازگشت به منوی اصلی", "main_menu")],
            ]))
        }else{
        // نمایش پیام "در حال پردازش..."
const processingMessage = await ctx.reply('💖 در حال پردازش فال عشق شما... کمی صبر کنید.');

// ایجاد تایمر ۵ ثانیه‌ای
        setTimeout(async () => {
          // حذف پیام "در حال پردازش..."
          await ctx.deleteMessage(processingMessage.message_id);

          // ارسال پیام فال روزانه
          await ctx.reply(
            ` 
            فال عشق ${objectfall.name} و ${objectfall.love} 🌹❤️
✨ اینه که  
${fall.fortune} 💞🔮

            `,
            Markup.inlineKeyboard([
              [Markup.button.callback("🔙 بازگشت به منوی اصلی", "main_menu")],
            ])
          );

          // حذف وضعیت کاربر از لیست
          userStates.delete(userId);
        }, 5000); // 5000 میلی‌ثانیه = 5 ثانیه
        await processingMessage;
      }
        userStates.delete(userId);
      }
    });

    // راه‌اندازی بات
    this.bot.launch();
  }
}
