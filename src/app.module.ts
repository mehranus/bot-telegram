import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UserService } from './modules/user/user.service';




@Module({

  imports: [TypeOrmModule.forRoot(typeOrmConfig()),UserModule],
  providers: [AppService],


})
export class BotModule {}
