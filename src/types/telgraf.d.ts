// // import { Scenes } from 'telegraf';
// // import { Context } from 'telegraf/typings/context';

// // // تعریف نوع جلسه (Session)
// // interface SessionData extends Scenes.SceneSession {
// //   objectAlarm?: {
// //     name?: string;
// //   };
// // }

// // // گسترش نوع Context
// // export interface MyContext extends Scenes.SceneContext,Scenes.WizardScene {
// //   session: SessionData; // گسترش نوع Session
// //   scene: Scenes.SceneContextScene<MyContext>; // اضافه کردن قابلیت صحنه‌ها
// //   wizard: Scenes.WizardContextWizard<MyContext>; // اضافه کردن قابلیت ویزارد
// //   cursor?: string;  // ویژگی لازم برای ویزارد
// // }



// import { Scenes } from 'telegraf';
// import { Context } from 'telegraf/typings/context';

// // تعریف تایپ داده‌های جلسه (Session)
// interface SceneSessionData extends Scenes.SceneSession,Scenes.SceneSessionData {
//   objectAlarm?: {
//     name?: string;
//   };
// }


// interface WizardSessionData extends SceneSessionData {
//   cursor: string;  // ویژگی لازم برای ویزارد
// }

// // گسترش Context با افزودن صحنه و ویژگی‌های دیگر
// export interface MyContext extends Context {
  

//   wizard: Scenes.WizardContextWizard<MyContext>; // اضافه کردن قابلیت ویزارد
//   cursor?: string;  // ویژگی لازم برای ویزارد

//   session: WizardSessionData;  // استفاده از WizardSessionData برای ذخیره داده‌های جلسه
//   scene: Scenes.SceneContextScene<MyContext, WizardSessionData>;  // اضافه کردن ویژگی scene با استفاده از WizardSessionData

// }



import { Context, Scenes } from 'telegraf';
import { SessionContext } from '@telegraf/session';

// تعریف اینترفیس برای داده‌های session
interface MySessionData {
  step?: number;
  objectfall?: {
    name: string;
    date: string;
    username: string;
    userId: number;
  };
}

// گسترش Context برای استفاده از session
interface MyContext extends Context, SessionContext<MySessionData> {}
