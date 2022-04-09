import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

export abstract class BaseEntity {
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

    @Column({ type: 'varchar', length: 300, nullable: true })
    Name: string;

    @Column({ type: 'varchar', length: 300, nullable: false })
    Email: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    Remarks: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    ZipCode: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    Address: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    PhoneNumber: string;

    @Column({ type: 'varchar', length: 300, nullable: true })
    Image: string;
}