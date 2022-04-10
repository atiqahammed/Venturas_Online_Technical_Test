import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'tblInvitation' })
export class Invitation {
  @Column({ type: 'varchar', length: 300, nullable: true })
  UserType: string;

  @Column({type: "int", nullable: true })
  CompanyId: number;

  @Column({type: "int", nullable: true })
  InvitedBy: number;

  @Column({ type: 'varchar', length: 300, nullable: true })
  Status: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  TemporaryPassword: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  UUID: string;

  @PrimaryGeneratedColumn('increment')
  Id: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  CreateDate: Date;

  @Column({ type: 'varchar', length: 300, nullable: true })
  CreatedBy: string;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  ModifiedDate: Date;

  @Column({ type: 'varchar', length: 300, nullable: true })
  LastChangedBy: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  Email: string;
}
