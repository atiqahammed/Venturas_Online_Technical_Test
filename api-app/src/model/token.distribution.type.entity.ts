import { Entity, Column, ManyToOne,JoinColumn,OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Proposal } from './proposal.entity';
import { Project } from './project.entity';
import { TokenDistribution } from './token.distribution.entity';



@Entity({ name: 'tblTokenDistributionType' })
export class TokenDistributionType extends BaseEntity {

  @ManyToOne(() => Project, Project => Project.TokenDistributionType,{nullable:false})  
  @JoinColumn({ name: 'ProjectId' })
  Project: Project;

  @Column({ type: 'varchar', length: 300 })
  Name: string;

  @Column({type: "decimal",  nullable: true })
  Allocation: number;

  @Column({ type: 'varchar', length: 100 })
  CalculatedBy: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  Type: string;

  @Column({ type: 'timestamptz', nullable: true })
  FundStartDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  FundEndDate: Date;

  @Column({type: "decimal",  nullable: true })
  FundTokenPrice: number;

  @Column({type: "int",  nullable: true })
  FundTargetAmount: number;

  @Column({type: "int", nullable: true })
  FundMinimumAmount: number;

  @Column({ type: "varchar", length: 300, nullable: true })
  FundUnit: string;
  
  @OneToMany(() => TokenDistribution, (TokenDistribution) => TokenDistribution.TokenDistributionType)
  TokenDistribution: TokenDistribution[];
  
}
