import {Field, InputType} from 'type-graphql';
import {Company} from '../entities/Company';

@InputType()
export class CompanyDataInput implements Partial<Company>
{
    @Field()
    name: string = '';
}
