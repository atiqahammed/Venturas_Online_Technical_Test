import { Entity, Column, ManyToOne,JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Project } from './project.entity';


@Entity({ name: 'tblCallbackRequest' })
export class CallbackRequest extends BaseEntity {

  @ManyToOne(() => Project, Project => Project.FundRaising, {
    nullable: false
  })
  @JoinColumn({ name: 'ProjectId' })
  Project: Project;  

  @Column({ type: 'varchar', length: 50,nullable:false })
  UUId: string;

  @Column({ type: 'varchar', nullable:false })
  Body: string;

  @Column({ type: 'varchar',nullable:false })
  Response: string;
  
  @Column({ type: 'varchar', length: 50,nullable:false })
  Status: string;

  @Column({ type: 'varchar',nullable:false })
  URL: string;
  
  @Column({ type: 'varchar', length: 50, nullable:false })
  CallbackName: string;
  
  @Column({ type: 'varchar', length: 50, nullable:false })
  Version: string;
}