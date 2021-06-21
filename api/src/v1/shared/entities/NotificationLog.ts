import {Entity, Column, ManyToOne, JoinColumn} from 'typeorm';
import { BaseEntity } from './BaseEntity';
import {Sensor} from "./Sensor";
import {Field} from "type-graphql";

@Entity({ name: 'notification_logs' })
export class NotificationLog extends BaseEntity
{
    @Field()
    @Column({name: 'min_temp', type: 'mediumint', default: 0})
    minTemp!: number

    @Field()
    @Column({name: 'max_temp', type: 'mediumint', default: 0})
    maxTemp!: number

    @Column({name: 'recorded_temp', type: 'mediumint', default: 0})
    recordedTemp!: number

    @Column({type: 'text', default: ''})
    message!: string

    @ManyToOne(() => Sensor, { cascade: ['insert', 'update'], onDelete: 'SET NULL'})
    @JoinColumn({name: 'sensor_id'})
    sensor!: Sensor;

    serialize()
    {
        let serialized = {
            minTemp: this.minTemp,
            maxTemp: this.maxTemp,
            recordedTemp: this.recordedTemp,
            message: this.message,
            sensor: 'N/A',
            company: 'N/A',
            createdAt: this.createdAt
        }

        if (this.sensor) {
            serialized.sensor = this.sensor.name;
        }

        return serialized;
    }
}
