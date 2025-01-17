

import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";



import { AlarmEntity } from "src/modules/alarm/entity/alarm.entity";



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
   @Column({unique:true})
   userId:number
   @OneToMany(()=>AlarmEntity,alarm=>alarm.user)
   alarm:AlarmEntity[]

  
}
@Entity("userfal")
export class UserFalEntity {
   @PrimaryGeneratedColumn('increment')
   id:number
   @Column()
   name:string
   @Column()
   date:string
   @Column({unique:true})
   username:string
   @Column({unique:true})
   userId:number 
}
@Entity("userfallove")
export class UserFalLoveEntity {
   @PrimaryGeneratedColumn('increment')
   id:number
   @Column()
   name:string
   @Column()
   love:string
   @Column({unique:true})
   username:string
   @Column({unique:true})
   userId:number 
}