import {Entity, Column, ManyToOne} from 'typeorm';
import BaseEntity from './base';
import Sensor from './sensor';
const serializer = require('jsonapi-serializer').Serializer;

@Entity({ name: 'temperature_readings' })
export default class temperatureReading extends BaseEntity
{
    @Column({ default: 0 })
    temp!: number;

    @ManyToOne(() => Sensor, sensor => sensor.temperatureReadings)
    sensor!: Sensor;
}
