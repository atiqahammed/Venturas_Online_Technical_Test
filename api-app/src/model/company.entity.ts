import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'tblCompany' })
export class Company extends BaseEntity {
  @Column({ type: 'varchar', length: 300, nullable: true })
  CopanyNameKana: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  URLOfHP: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  DateOfEstablishment: string;

  @Column({type: 'int', nullable: false })
  OwnerId: number;
}
