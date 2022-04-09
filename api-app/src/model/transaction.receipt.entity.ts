import { Entity, Column, ManyToOne, OneToMany, JoinColumn} from 'typeorm';
import { Project } from './project.entity';
import { BaseEntity } from './base.entity';
import { TransactionReceiptStatus } from './transaction.receipt.status.entity';
import { FunctionNames } from '../common/enums/function-names.enum';
import QueueStatus from '../common/enums/queue-status.enum';

@Entity({ name: 'tblTransactionReceipt' })
export class TransactionReceipt extends BaseEntity {

  @Column({ type: 'varchar', length: 300, nullable: false })
  UUId: string;

  @Column({ type: 'enum', enum: QueueStatus })
  QueueStatus: QueueStatus;

  @Column({ type: 'varchar', nullable: true })
  TxData: string;

  @Column({ type: 'varchar', nullable: true})
  TxValue: string;

  @Column({type: 'varchar', nullable: true, length: 300 })
  ToAddress: string;

  @Column({type: 'varchar', nullable: true, length: 300 })
  FromAddress: string;

  @Column({ type: 'enum', enum: FunctionNames })
  FunctionName: FunctionNames;

  @Column({ type: 'varchar', nullable: false })
  FunctionArguments: string;

  @Column({ type: 'varchar', nullable: false })
  FunctionArgumentsHash: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  SigningEOA: string;

  @Column({ type: 'varchar', nullable: true })
  SignedBytes: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  OwnerAddress: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ChainType: string;

  @Column({type: 'int', nullable: true })
  ChainId: number;

  @Column({type: 'int', nullable: true })
  TryCount: number;

  @Column({type: 'int', nullable: true })
  BlockedBy: number;

  @Column({type: 'int', nullable: true })
  Priority: number;

  @Column({ type: 'boolean', default: true })
  IsActive: boolean;

  @Column({type: 'int', nullable: true })
  ResendCount: number;

  @Column({type: 'int', nullable: true })
  BlockedTrxId: number;

  @ManyToOne(() => Project, Project => Project.TransactionReceipt, { nullable: true })
  @JoinColumn({name:'ProjectID'})
  Project: Project;

  @OneToMany(() => TransactionReceiptStatus, TransactionReceiptStatus => TransactionReceiptStatus.TransactionReceipt)
  TransactionReceiptStatus: TransactionReceiptStatus[];
}