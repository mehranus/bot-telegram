import {

  Injectable,

} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreatAlarmDto } from "./dto/alarm.dto";
import { AlarmEntity } from "./entity/alarm.entity";
import { Repository } from "typeorm";





@Injectable()
export class AlarmService {
  constructor(
    @InjectRepository(AlarmEntity)
    private readonly alarmRepository: Repository<AlarmEntity>
  ) {}

  async create(createDto: CreatAlarmDto) {
    
   const {date,name,time,userId}=createDto
   console.log(typeof(date),typeof(name),typeof(time),typeof(userId))
   const alaram=await this.alarmRepository.find({
    where:{
      name:name,
      userrId:userId
    }
   })

   if(alaram.length>=1){ return {message:"این یادآور از قبل موجود است"}}else{
   const saveA= this.alarmRepository.create({date,name,time,userrId:userId})
   await this.alarmRepository.save(saveA)
   return {message:'✅ یادآور شما با موفقیت ایجاد شد!'}
  }
  }

  async getAlaram(userId: number) {
    const list=await this.alarmRepository.find({
      where:{
        userrId:userId
      }
    })
    if(!list){
      return{
        message:"شما هنو یادآوری را ایجاد نکرده اید"
      }
    }else{
      return{
        list
      }
    }
  }
}
