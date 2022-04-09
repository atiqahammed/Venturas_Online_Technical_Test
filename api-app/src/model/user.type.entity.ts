import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'tblUserType' })
export class UserType extends BaseEntity {

  @Column({ type: 'varchar', length: 300, nullable: true })
  Name: string;

}