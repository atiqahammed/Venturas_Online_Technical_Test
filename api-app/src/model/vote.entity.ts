import { Entity, Column, ManyToOne,JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Project } from './project.entity';
import { Proposal } from './proposal.entity';

@Entity({ name: 'tblVote' })
export class Vote extends BaseEntity {

  @ManyToOne(() => Proposal, Proposal => Proposal.Vote,{nullable:false})  
  @JoinColumn({ name: 'ProposalId' })
  Proposal: Proposal;

  @ManyToOne(() => Project, Project => Project.Vote,{nullable:false})  
  @JoinColumn({ name: 'ProjectId' })
  Project: Project;

  @Column({ type: 'int', nullable: true })
  GroupId: number; 

  @Column({ type: 'varchar', length: 300 })
  EOA: string;

  @Column({ type: 'varchar' ,length:300})
  Vote: string;

  @Column({ type: 'timestamp'})
  Date: Date; 
  
}
