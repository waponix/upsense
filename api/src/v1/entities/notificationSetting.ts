import {Entity, Column, ManyToOne} from 'typeorm';
import BaseEntity from './base';
import Zone from './zone';
const serializer = require('jsonapi-serializer').Serializer;

@Entity({ name: 'notification_settings' })
export default class NotificationSetting extends BaseEntity
{
    @Column({ type: 'enum', enum: ['sms', 'email', 'push_notif'], nullable: false, default: 'email' })
    type!: string;

    @Column({ name: 'trigger_time', default: 0 })
    triggerTime!: number;

    @Column({ name: 'repeat_time', default: 0 })
    repeatTime!: number;

    @Column({ name: 'max_repeat', default: 0 })
    maxRepeat!: number;

    @ManyToOne(() => Zone, zone => zone.notificationSettings)
    zone!: Zone;
}
