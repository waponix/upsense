import {Column, Entity, BeforeInsert, AfterLoad, ManyToOne, OneToMany, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import BaseEntity from './base';
import Audit from './audit';
import Zone from './zone';
import hash from '../../components/helpers/hash';
const crypto = require('crypto');
const serializer = require('jsonapi-serializer').Serializer;

/**
 * The Admin Entity, this entity holds data for Admin, Manager and User
 */
@Entity({ name: 'admins' })
export default class Admin extends BaseEntity
{
    @Column({ type: 'enum', enum: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_USER'], nullable: false, default: 'ROLE_USER'})
    role!: string;

    @Column({ type: 'text', unique: true, nullable: false })
    username!: string;

    @Column({ type: 'text', unique: false, nullable: false })
    password!: string;

    @Column({ type: 'text', unique: true, nullable: false})
    salt!: string;

    @Column({ type: 'text', unique: true, nullable: true })
    picture!: string;

    @Column({ type: 'text', nullable: true, name: 'first_name' })
    firstName!: string;

    @Column({ type: 'text', nullable: true, name: 'last_name' })
    lastName!: string;

    @Column({ type: 'text', unique: true, nullable: true })
    email!: string;

    @Column({ type: 'text', nullable: true, name: 'mobile_number' })
    mobileNumber!: string;

    @ManyToMany(() => Zone, zone => zone.admins, { cascade: ['insert', 'update'] })
    zones!: Zone[];

    @OneToMany(() => Audit, audit => audit.admin)
    audits!: Audit[];

    /**
     * Before inserting the data, generate the salt and hash the password
     */
    @BeforeInsert()
    hashPassword()
    {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.password = hash.password(this.password, this.salt);
    }

    /**
     * Validate if the password provided matched
     * @param password
     */
    validatePassword(password: string)
    {
        return this.password === hash.password(password, this.salt);
    }

    /**
     * Create this function to serialize the data to show in the api response
     * Serialize the data for admin
     */
    adminSerialize()
    {
        return new serializer('admins', {
            id: 'uuid',
            keyForAttribute: 'camelCase',
            attributes: ['firstName', 'lastName', 'email', 'mobileNumber', 'createdAt', 'updatedAt']
        }).serialize(this);
    }
}
