import { Entity, Column, ManyToOne,JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Project } from './project.entity';

@Entity({ name: 'tblSupportProject' })
export class SupportProject extends BaseEntity {

  @Column({ type: 'int', nullable: true })
  Amount: number; 

  @Column({ type: 'varchar', length: 300 })
  EOA: string;

  @Column({ type: "varchar", length: 300, nullable: true })
  Unit: string;

  @Column({ type: 'timestamp'})
  Date: Date; 

  @ManyToOne(() => Project, Project => Project.SupportProject,{nullable:false})  
  @JoinColumn({ name: 'ProjectId' })
  Project: Project;
  
}
