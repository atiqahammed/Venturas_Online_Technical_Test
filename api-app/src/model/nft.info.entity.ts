import { Entity, Column, OneToMany ,ManyToOne,JoinColumn} from 'typeorm';
import { BaseEntity } from './base.entity';
import { NftTransfer } from './nft.transfer.entity';
import { Project } from './project.entity';

@Entity({ name: 'tblNftInfo' })
export class NftInfo extends BaseEntity {

  @ManyToOne(() => Project, Project => Project.NftInfo,{nullable:false})  
  @JoinColumn({ name: 'ProjectId' })
  Project: Project;

  @Column({ type: 'varchar', length: 20 })
  TxStatus: string;

  @Column({type: 'varchar', length:2048})
  TokenId: string;

  @Column({ type: 'varchar' })
  MetaDataJson: string;

  @Column({ type: 'varchar',length:2048})
  Url: string;

  @Column({ type: 'varchar' })
  MetaDataHash: string;

  @Column({ type: 'varchar', length: 300 })
  CurrentOwner: string;

  @Column({ type: 'varchar', length: 300 })
  MinterContractAddress: string;

  @Column({ type: 'boolean', default: true })
  IsNewNFT: boolean;

  @OneToMany(() => NftTransfer, (NftTransfer) => NftTransfer.NftInfo)
  NftTransfer: NftTransfer[];
  
  
}