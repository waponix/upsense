import {Entity, Column, ManyToOne, OneToOne} from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Zone } from './Zone';
import {User} from "./User";

@Entity({ name: 'notification_settings' })
export class NotificationSetting extends BaseEntity
{
    // @Column({ type: 'enum', enum: ['sms', 'email', 'push_notifications'], nullable: false, default: 'email' })
    // type!: string;

    @Column({ type: 'tinyint', name: 'send_email', nullable: false, default: 1 })
    sendEmail!: boolean;

    @Column({ type: 'tinyint', name: 'send_sms', nullable: false, default: 0 })
    sendSms!: boolean;

    // @Column({ type: 'tinyint', name: 'send_push_notification', nullable: false, default: 0 })
    // sendPushNotification!: boolean;

    @Column({ type: 'smallint', name: 'max_repeat', default: 5 })
    maxRepeat!: number;

    @OneToOne(() => User, user => user.notificationSetting, { cascade: true })
    user!: User;

    public serialize()
    {
        let serialized: any = {
            sendEmail: this.sendEmail,
            sendSendSms: this.sendSms,
            maxRepeat: this.maxRepeat,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };

        if (this.user) {
            serialized.zone = this.user.serialize();
        }

        return serialized;
    }
}
