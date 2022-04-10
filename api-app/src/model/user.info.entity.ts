import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'tblUserInfo' })
export class UserInfo extends BaseEntity {

  @Column({ type: 'varchar', length: 300, nullable: true })
  Department: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  DateOfBirth: string;

  @Column({type: "int", nullable: true })
  CompanyId: number;

  @Column({ type: 'varchar', length: 1024 })
  Password: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  UserType: string;
  
}