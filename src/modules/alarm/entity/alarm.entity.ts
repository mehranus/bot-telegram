

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";



import { UserEntity } from "src/modules/user/entity/user.entity";



@Entity("alaram")
export class AlarmEntity {
   @PrimaryGeneratedColumn('increment')
   id:number
   @Column()
   name:string
   @Column()
   date:string
   @Column()
   time:string
   @Column()
   userrId:number
   @ManyToOne(()=>UserEntity,(user)=>user.alarm,{onDelete:"CASCADE"})
   user:UserEntity

  
}