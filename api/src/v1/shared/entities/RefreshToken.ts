import { BaseEntity } from './BaseEntity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { Admin } from './Admin';

@ObjectType()
@Entity({name: 'refresh_tokens'})
export class RefreshToken extends BaseEntity
{
    @Field(() => String)
    @Column({nullable: false})
    token!: string;

    @OneToOne(() => Admin, admin => admin.refreshToken, {onDelete: 'CASCADE', cascade: ['insert', 'update']})
    @JoinColumn({name: 'admin_id'})
    admin!: Admin
}
