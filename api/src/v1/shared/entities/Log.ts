import { Entity, Column, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import {Sensor} from "./Sensor";
import {Field} from "type-graphql";

@Entity({ name: 'logs' })
export class Log extends BaseEntity
{
    @Field()
    @Column({type: 'mediumint'})
    duration!: number;

    @Field()
    @Column({name: 'min_temp', type: 'mediumint', default: 0})
    minTemp!: number

    @Field()
    @Column({name: 'max_temp', type: 'mediumint', default: 0})
    maxTemp!: number

    @Field()
    @Column({name: 'alert_datetime', type: 'datetime', nullable: true})
    alertDatetime!: string

    @ManyToOne(() => Sensor, sensor => sensor.logs, { onDelete: 'SET NULL'})
    sensor!: Sensor;
}
