import {Status, RESPONSE_STATUS} from "../../../components/types/ResponseStatusTypes";
import {OperationSuccess} from "../../../messages/messages";


export class ApiResponse
{
    status: RESPONSE_STATUS = Status.Success;
    message: string | string[] = OperationSuccess;
    result: any = null;
    error?: any;
    count?: number;
}
