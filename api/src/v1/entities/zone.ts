import {Entity, Column, ManyToOne, OneToMany, ManyToMany} from 'typeorm';import BaseEntity from './base';import Branch from './branch';import Admin from './admin';import Hub from './hub';import NotificationSetting from './notificationSetting';const serializer = require('jsonapi-serializer').Serializer;@Entity({ name: 'zones' })export default class Zone extends BaseEntity{    @Column({ type: 'text', nullable: false, default: null })    name!: string;    @ManyToMany(() => Admin, admin => admin.zones, { cascade: ['insert', 'update' ]})    admins!: Admin[];    @ManyToOne(() => Branch, branch => branch.zones, { cascade: ['insert', 'update'] })    branch!: Branch;    @OneToMany(() => Hub, hub => hub.zone)    hubs!: Hub[];    @OneToMany(() => NotificationSetting, notificationSetting => notificationSetting.zone)    notificationSettings!: NotificationSetting[];}