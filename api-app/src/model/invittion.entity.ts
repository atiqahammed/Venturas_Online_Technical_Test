import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'tblInvitation' })
export class Invitation extends BaseEntity {
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
}
