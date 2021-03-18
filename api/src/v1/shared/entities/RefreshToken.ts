import { BaseEntity } from './BaseEntity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';
import { User } from './User';

@ObjectType()
@Entity({name: 'refresh_tokens'})
export class RefreshToken extends BaseEntity
{
    @Field(() => String)
    @Column({nullable: false})
    token!: string;

    @OneToOne(() => User, user => user.refreshToken, {onDelete: 'CASCADE', cascade: ['insert', 'update']})
    @JoinColumn({name: 'user_id'})
    user!: User
}
