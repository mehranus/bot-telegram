import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AlarmModule } from './modules/alarm/alarm.module';
import { AlarmEntity } from './modules/alarm/entity/alarm.entity';
import { BotService } from './bot.service';
import { FallService } from './fall.service';




@Module({

  imports: [TypeOrmModule.forRoot(typeOrmConfig()),UserModule,AlarmModule],
  providers: [FallService],


})
export class BotModule {}
