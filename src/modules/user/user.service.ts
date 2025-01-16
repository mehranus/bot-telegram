import { BadGatewayException, BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity, UserFalEntity } from "./entity/user.entity";
import { DeepPartial, Repository } from "typeorm";

import { CreatUserDto, FallUserDto } from "./dto/user.dto";
import { fortunes } from "./db/day.db";
import { loveFortunes } from "./db/love.db";





@Injectable()
export class UserService{
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository:Repository<UserEntity>,
    @InjectRepository(UserFalEntity) private readonly fallRepository:Repository<UserFalEntity>,

  ){}



  async create(createDto:CreatUserDto){
    const {first_name,last_name,userId,username}=createDto
    const user= await this.userRepository.findOneBy({username})
    if(!user){
      await this.userRepository.insert({first_name,last_name,userId,username})
    }
  }
  async createFall(createDto:FallUserDto){
    const {date,name,userId,username}=createDto
    const user=await this.fallRepository.findOne({where:{userId}})
    if(!user){
      let uss= this.fallRepository.create({date,name,userId,username})
      uss=await this.fallRepository.save(uss)
      const fall=this.generateDailyFortune(uss.name,uss.date)
      
      return{
        status:201,
        fall
      }
    }else{
      const fall=this.generateDailyFortune(user.name,user.date)
      return{
        status:200,
        fall
      }
    }
    
  }
  async createFalLove(createDto:FallUserDto){
    const {date,name,userId,username}=createDto
    const user=await this.fallRepository.findOne({where:{userId}})
    if(!user){
      let uss= this.fallRepository.create({date,name,userId,username})
      uss=await this.fallRepository.save(uss)
      const fall=this.generateLoveFortune(uss.name,uss.date)
      
      return{
        status:201,
        fall
      }
    }else{
      const fall=this.generateLoveFortune(user.name,user.date)
      return{
        status:200,
        fall
      }
    }
    
  }

  async getUser(username:string){
    const user= await this.userRepository.findOneBy({username})
    return user
  }
  async getFallUser(username:string){
    const user= await this.fallRepository.findOneBy({username})
    return user
  }







   generateDailyFortune = (name: string, date: string) => {
   
  
    // انتخاب یک فال تصادفی از لیست
    const randomFortune = Math.floor(Math.random() * fortunes.length);
   
  
    return {
      name,
      date,
      fortune:  fortunes[randomFortune],
    };
  };
   generateLoveFortune = (name: string, love: string) => {
   
  
    // انتخاب یک فال تصادفی از لیست
    const randomFortune = Math.floor(Math.random() * loveFortunes.length);
   
  
    return {
      name,
      love,
      fortune:  loveFortunes[randomFortune],
    };
  };



}