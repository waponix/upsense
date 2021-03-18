import { Entity } from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity({ name: 'alerts' })
export class Alert extends BaseEntity
{
}
