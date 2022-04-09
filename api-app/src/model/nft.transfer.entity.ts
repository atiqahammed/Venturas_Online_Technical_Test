import { Entity, Column, ManyToOne,JoinColumn } from 'typeorm';
import { NftInfo } from './nft.info.entity';
import Operation from '../common/enums/operation.enum';
import { BaseEntity } from './base.entity';
import { Project } from './project.entity';



@Entity({ name: 'tblNftTransfer' })
export class NftTransfer extends BaseEntity {

  @ManyToOne(() => Project, Project => Project.NftTransfer,{nullable:false})  
  @JoinColumn({ name: 'ProjectId' })
  Project: Project;

  @Column({ type: 'varchar', length: 300 })
  UUId: string;

  @Column({type: 'varchar',length:2048})
  TokenId: string;

  @Column({ type: "enum", enum: Operation })
  Operation: Operation;

  @Column({ type: 'varchar', length: 300 })
  From: string;

  @Column({ type: 'varchar', length: 300 })
  To: string;

  @ManyToOne(() => NftInfo, NftInfo => NftInfo.NftTransfer,{nullable:false})  
  @JoinColumn({ name: 'NftInfoId' })
  NftInfo: NftInfo;
}