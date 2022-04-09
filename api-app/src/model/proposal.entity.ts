import { Entity, Column, ManyToOne,JoinColumn,OneToMany} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Project } from './project.entity';
import { Vote } from './vote.entity';
import { BlackListedProposalEOA } from './blacklisted.proposal.eoa.entity';


@Entity({ name: 'tblProposal' })
export class Proposal extends BaseEntity {

  @ManyToOne(() => Project, Project => Project.Proposal, {
    nullable: false
  })
  @JoinColumn({ name: 'ProjectId' })
  Project: Project;  

  @Column({type: "int", nullable: true })
  Web2ProposalId: number; 

  @Column({type: "int", nullable: true })
  GroupId: number; 

  @Column({ type: 'varchar' ,length:300})
  ProposalType: string;

  @Column({ type: 'varchar' ,length:300})
  ProposalText: string;

  @Column({ type: 'varchar' ,length:300})
  Action: string;

  @Column({type: "int", nullable: true })
  MinimumThreshold: number;

  @Column({ type: 'timestamp'})
  ExpiryDate: Date;

  @Column({ type: 'timestamp'})
  ActionPerformDate: Date;

  @Column({ type: 'varchar' })
  InstantTrigger: string;

  @Column({ type: 'varchar' })
  Data: string;

  @Column({ type: 'varchar',length:2048, nullable: true })
  Url: string;  

  @OneToMany(() => Vote, (Vote) => Vote.Proposal)
  Vote: Vote[];

  @OneToMany(() => BlackListedProposalEOA, (BlackListedProposalEOA) => BlackListedProposalEOA.Proposal)
  BlackListedProposalEOA: BlackListedProposalEOA[];
  
}
