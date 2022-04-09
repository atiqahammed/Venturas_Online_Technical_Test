import { Entity, Column, OneToMany } from 'typeorm';
import { TransactionReceipt } from './transaction.receipt.entity';
import { NftInfo } from './nft.info.entity';
import { NftTransfer } from './nft.transfer.entity';
import { Proposal } from './proposal.entity';
import { Vote } from './vote.entity';
import { TokenDistributionType } from './token.distribution.type.entity';
import { FundRaising } from './fund.raising.entity';
import { BaseEntity } from './base.entity';
import { SupportProject } from './support.project.entity';

@Entity({ name: 'tblProject' })
export class Project extends BaseEntity {
  @Column({ type: 'varchar', length: 300, nullable: true })
  Name: string;

  @Column({type: 'int', nullable: false })
  Web2ProjectId: number;

  @Column({type: 'int', nullable: true })
  deploymentStep: number;

  @Column({ type: 'varchar', length: 300, nullable: true })
  ProjectTypeId: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  ContractAddress: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  TokenName: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  TokenSymbol: string;

  @Column({ type: 'int', nullable: false })
  maxToken: number;

  @Column({ type: 'varchar', length: 300, nullable: true })
  VotingPower: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  WhoCanVote: string;

  @Column({ type: 'boolean', default: false })
  FundRisingNeeded: boolean;

  @Column({ type: 'int', nullable: false })
  Status: number;

  @OneToMany(
    () => TransactionReceipt,
    (TransactionReceipt) => TransactionReceipt.Project
  )
  TransactionReceipt: TransactionReceipt[];


  @OneToMany(() => NftInfo, (NftInfo) => NftInfo.Project)
  NftInfo: NftInfo[];

  @OneToMany(() => NftTransfer, (NftTransfer) => NftTransfer.Project)
  NftTransfer: NftTransfer[];

  @OneToMany(() => Vote, (Vote) => Vote.Project)
  Vote: Vote[];

  @OneToMany(() => TokenDistributionType, (TokenDistributionType) => TokenDistributionType.Project)
  TokenDistributionType: TokenDistributionType[];

  @OneToMany(() => Proposal, (Proposal) => Proposal.Project)
  Proposal: Proposal[];

  @OneToMany(() => FundRaising, (FundRaising) => FundRaising.Project)
  FundRaising: FundRaising[];

  @OneToMany(() => SupportProject, (SupportProject) => SupportProject.Project)
  SupportProject: SupportProject[];
}
