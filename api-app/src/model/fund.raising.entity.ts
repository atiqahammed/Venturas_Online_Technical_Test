import { Entity, Column, ManyToOne,JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Project } from './project.entity';


@Entity({ name: 'tblFundRising' })
export class FundRaising extends BaseEntity {

  @ManyToOne(() => Project, Project => Project.FundRaising, {
    nullable: false
  })
  @JoinColumn({ name: 'ProjectId' })
  Project: Project;  

  @Column({type: "decimal",  nullable: true })
  TokenPrice: number;

  @Column({type: "int",  nullable: true })
  TargetAmount: number;

  @Column({type: "int", nullable: true })
  MinimumAmount: number;

  @Column({ type: "varchar", length: 300, nullable: true })
  Unit: string;

  @Column({ type: 'timestamptz' })
  StartDate: Date;

  @Column({ type: 'timestamptz' })
  EndDate: Date;
}