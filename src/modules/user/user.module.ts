import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity, UserFalEntity } from "./entity/user.entity";


import { UserService } from "./user.service";



@Module({
  imports:[TypeOrmModule.forFeature([UserEntity,UserFalEntity])],

  providers:[UserService],
  exports:[UserService]
})
export class UserModule{}