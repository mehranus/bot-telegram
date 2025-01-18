import { BadGatewayException, BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity, UserFalEntity, UserFalLoveEntity } from "./entity/user.entity";
import { DeepPartial, Repository } from "typeorm";

import { CreatUserDto, FallLoveDto, FallUserDto } from "./dto/user.dto";
import { fortunes } from "./db/day.db";
import { loveFortunes } from "./db/love.db";
import { fallHafez } from "./db/hafez.db";





@Injectable()
export class UserService{
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository:Repository<UserEntity>,
    @InjectRepository(UserFalEntity) private readonly fallRepository:Repository<UserFalEntity>,
    @InjectRepository(UserFalLoveEntity) private readonly fallloveRepository:Repository<UserFalLoveEntity>,

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
  async createFalLove(createDto:FallLoveDto){
    
    const {love,name,userId,username}=createDto
   
    let user=await this.fallloveRepository.findOne({where:{userId}})
    if(!user){
      user= this.fallloveRepository.create({name,love,userId,username})
      user=await this.fallloveRepository.save(user)
      const fall=this.generateLoveFortune(user.name,user.love)
      
      return{
        status:201,
        fall
      }
    }else{
      user.name=name
      user.love=love
      await this.fallloveRepository.save(user)
      const fall=this.generateLoveFortune(user.name,user.love)
      return{
        status:200,
        fall
      }
    }
    
  }

  async crateHafez(){
    return await this.generateHafezFortune()
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
   generateHafezFortune = () => {
   
  
    // انتخاب یک فال تصادفی از لیست
    const randomFortune = Math.floor(Math.random() * fallHafez.length);
   
  
    return fallHafez[randomFortune];
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