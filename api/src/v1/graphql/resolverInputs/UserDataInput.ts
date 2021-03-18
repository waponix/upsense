import {InputType, Field, Int} from 'type-graphql';
import { User } from '../../shared/entities/User';

@InputType({ description: "Create admin" })
export class CreateUserInput implements Partial<User> {
    @Field(type => String,{ nullable: false })
    username!: string;

    @Field(type => String,{ nullable: false })
    password!: string;

    @Field(type => String,{ nullable: true })
    image?: string;

    @Field(type => String,{ nullable: false })
    firstName!: string;

    @Field(type => String,{ nullable: true })
    lastName!: string;

    @Field(type => String,{ nullable: false })
    email!: string;

    @Field(type => String,{ nullable: true })
    mobile?: string;
}

@InputType({ description: "Modify admin" })
export class UpdateUserInput implements Partial<User> {
    @Field(type => String,{ nullable: true })
    username?: string;

    @Field(type => String,{ nullable: true })
    password?: string;

    @Field(type => String,{ nullable: true })
    image?: string;

    @Field(type => String,{ nullable: true })
    firstName?: string;

    @Field(type => String,{ nullable: true })
    lastName?: string;

    @Field(type => String,{ nullable: true })
    email?: string;

    @Field(type => String,{ nullable: true })
    mobile?: string;
}

@InputType({ description: "Filters available for admin get list" })
export class UserFilterInput implements Partial<User> {
    @Field(type => String,{ nullable: true })
    username?: string;

    @Field(type => String,{ nullable: true })
    image?: string;

    @Field(type => String,{ nullable: true })
    firstName?: string;

    @Field(type => String,{ nullable: true })
    lastName?: string;

    @Field(type => String,{ nullable: true })
    email?: string;

    @Field(type => String,{ nullable: true })
    mobile?: string;
}
