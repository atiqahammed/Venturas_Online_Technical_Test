import { Entity, Column, ManyToOne,JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Proposal } from './proposal.entity';
import { Project } from './project.entity';
import { TokenDistributionType } from './token.distribution.type.entity';



@Entity({ name: 'tblTokenDistribution' })
export class TokenDistribution extends BaseEntity {

  @ManyToOne(() => Project, Project => Project.TokenDistributionType,{nullable:false})  
  @JoinColumn({ name: 'ProjectId' })
  Project: Project;

  @Column({ type: 'varchar', length: 300 })
  EOA: string;

  @Column({type: "decimal",  nullable: true })
  Percent: number;

  @Column({ type: 'varchar', length: 100 })
  CalculatedBy: string;

  @ManyToOne(() => TokenDistributionType, TokenDistributionType => TokenDistributionType.TokenDistribution,{nullable:false})  
  @JoinColumn({ name: 'TokenDistributionTypeId' })
  TokenDistributionType: TokenDistributionType;

}
