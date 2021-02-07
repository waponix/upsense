import {Field, ObjectType} from "type-graphql";
import {RESPONSE_STATUS, Status} from "../../components/types/ResponseStatusTypes";

@ObjectType()
export abstract class Response {
    @Field(() => String)
    status?: RESPONSE_STATUS = Status.Success;

    @Field(() => String)
    message: string = 'Operation successful';
}
