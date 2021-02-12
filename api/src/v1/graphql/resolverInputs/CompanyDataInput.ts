import {Field, InputType} from 'type-graphql';
import {Company} from '../../entities/Company';

@InputType()
export class CreateCompanyInput implements Partial<Company>
{
    @Field()
    name: string = '';
}
