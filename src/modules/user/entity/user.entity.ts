

import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


import { AdminStatus, UserStatus } from "../enum/user.enum";



@Entity("user")
export class UserEntity {
   @PrimaryGeneratedColumn('increment')
   id:number
   @Column({nullable:true})
   first_name:string
   @Column({nullable:true})
   last_name:string
   @Column({unique:true})
   username:string
   @Column({unique:true,nullable:true})
   userId:number

  
}