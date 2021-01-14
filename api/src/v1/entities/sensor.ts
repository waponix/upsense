import {Entity, Column, OneToMany, OneToOne} from 'typeorm';
import BaseEntity from './base';
import Hub from './hub';
import TemperatureReading from './temperatureReading';
import NotificationSetting from './notificationSetting';
const serializer = require('jsonapi-serializer').Serializer;

@Entity({ name: 'sensors' })
export default class Sensor extends BaseEntity
{
    @Column({ nullable: false })
    name!: string;

    @Column({ nullable: false })
    serial!: string;

    @Column({ name: 'curent_temp', type: 'decimal', nullable: false })
    currentTemp!: number;

    @Column({ name: 'signal_strength', nullable: false })
    signalStrength!: number;

    @Column({ name: 'battery_status', nullable: false })
    batteryStatus!: number;

    @Column({ name: 'is_connected', type: 'smallint', nullable: false, default: 0 })
    isConnected!: number;

    @Column()
    description!: string;

    @Column()
    type!: string;

    @OneToOne(() => Hub, hub => hub.sensor, { cascade: ['insert', 'update'] })
    hub!: Hub;

    @OneToMany(() => TemperatureReading, temperatureReading => temperatureReading.sensor)
    temperatureReadings!: TemperatureReading[];
}
