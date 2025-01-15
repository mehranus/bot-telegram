import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";



import { AlarmEntity } from "./entity/alarm.entity";
import { AlarmService } from "./alarm.service";

@Module({
  imports: [TypeOrmModule.forFeature([AlarmEntity])],

  providers: [AlarmService],
  exports: [AlarmService],
})
export class AlarmModule {}
