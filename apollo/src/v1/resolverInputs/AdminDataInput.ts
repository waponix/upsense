import {InputType, Field, Int} from 'type-graphql';
import { Admin } from '../entities/Admin';

@InputType({ description: "Create admin" })
export class CreateAdmin implements Partial<Admin> {
    @Field(type => String,{ nullable: false })
    role!: string;

    @Field(type => String,{ nullable: false })
    username!: string;

    @Field(type => String,{ nullable: false })
    password!: string;

    @Field(type => String,{ nullable: false })
    picture!: string;

    @Field(type => String,{ nullable: false })
    firstName!: string;

    @Field(type => String,{ nullable: true })
    lastName!: string;

    @Field(type => String,{ nullable: false })
    email!: string;

    @Field(type => String,{ nullable: true })
    mobileNumber!: string;
}

@InputType({ description: "Modify admin" })
export class UpdateAdmin implements Partial<Admin> {
    @Field(type => String, { nullable: true })
    role?: string;

    @Field(type => String,{ nullable: true })
    username?: string;

    @Field(type => String,{ nullable: true })
    password?: string;

    @Field(type => String,{ nullable: true })
    picture?: string;

    @Field(type => String,{ nullable: true })
    firstName?: string;

    @Field(type => String,{ nullable: true })
    lastName?: string;

    @Field(type => String,{ nullable: true })
    email?: string;

    @Field(type => String,{ nullable: true })
    mobileNumber?: string;
}