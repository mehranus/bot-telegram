import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity, UserFalEntity, UserFalLoveEntity } from "./entity/user.entity";


import { UserService } from "./user.service";



@Module({
  imports:[TypeOrmModule.forFeature([UserEntity,UserFalEntity,UserFalLoveEntity])],

  providers:[UserService],
  exports:[UserService]
})
export class UserModule{}