import { Entity, Column, ManyToOne,JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Proposal } from './proposal.entity';



@Entity({ name: 'tblBlackListedProposalEOA' })
export class BlackListedProposalEOA extends BaseEntity {

  @ManyToOne(() => Proposal, Proposal => Proposal.BlackListedProposalEOA,{nullable:false})  
  @JoinColumn({ name: 'ProposalId' })  Proposal: Proposal;

  @Column({ type: 'varchar', length: 300 })
  EOA: string;
    
}
