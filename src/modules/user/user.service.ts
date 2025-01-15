import { BadGatewayException, BadRequestException, ConflictException, Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entity/user.entity";
import { DeepPartial, Repository } from "typeorm";

import { CreatUserDto } from "./dto/user.dto";





@Injectable()
export class UserService{
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository:Repository<UserEntity>,

  ){}



  async create(createDto:CreatUserDto){
    const {first_name,last_name,userId,username}=createDto
    const user= await this.userRepository.findOneBy({username})
    if(!user){
      await this.userRepository.insert({first_name,last_name,userId,username})
    }
  }

  async getUser(username:string){
    const user= await this.userRepository.findOneBy({username})
    return user
  }



}