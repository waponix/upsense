import { Entity, Column, ManyToOne } from 'typeorm';import { BaseEntity } from './BaseEntity';import { Admin } from './Admin';@Entity({ name: 'audits' })export class Audit extends BaseEntity{    @Column({ name: 'operation_type', default: '', nullable: false })    operationType!: string;    @Column({ name: 'operation_info', default: '', nullable: false })    operationInfo!: string;    @ManyToOne(() => Admin, admin => admin.audits, { cascade: ['insert', 'update'] })    admin!: Admin;}