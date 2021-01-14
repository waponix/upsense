import {Entity, Column, OneToMany} from 'typeorm';
import BaseEntity from './base';
import Branch from './branch';
const serializer = require('jsonapi-serializer').Serializer;

@Entity({ name: 'companies' })
export default class Company extends BaseEntity
{
    @Column({ type: 'text', nullable: false, default: null })
    name!: string;

    @OneToMany(() => Branch, branch => branch.company, { cascade: true })
    branches!: Branch[];

    /**
     * Create this function to serialize the data to show in the api response
     */
    serialize()
    {
        return new serializer('companies', {
            id: 'uuid',
            keyForAttribute: 'camelCase',
            attributes: ['name', 'createdAt', 'updatedAt']
        }).serialize(this);
    }
}
