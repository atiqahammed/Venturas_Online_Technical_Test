import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TransactionReceipt } from './transaction.receipt.entity';

@Entity({ name: 'tblTransactionReceiptStatus' })
export class TransactionReceiptStatus extends BaseEntity {

  @Column({ type: 'varchar', length: 300, nullable: true })
  TxHash: string;

  @Column({ type: "varchar", nullable: false, length: 20})
  MiningStatus: string;

  @Column({ type: 'varchar', nullable: true })
  TxFee: string;

  @Column({ type: "varchar",nullable: true, length: 20 })
  Result: string;

  @Column({ type: 'varchar', nullable: true ,length: 255 })
  ErrorReason: string;

  @Column({ type: 'varchar', nullable: true })
  Receipt: string;

  @Column({type: "int", nullable: true })
  AdminEoaNonce: number;

  @Column({type: "int", nullable: true })
  AdminKuwNonce: number;

  @Column({type: "int", nullable: true })
  ForwarderNonce: number;

  @Column({type: "int", nullable: true })
  GasPriceLevel: number;

  @Column({type: "int", nullable: true })
  GasPriceGwei: number;

  @ManyToOne(() => TransactionReceipt, TransactionReceipt => TransactionReceipt.TransactionReceiptStatus)
  TransactionReceipt: TransactionReceipt;
}