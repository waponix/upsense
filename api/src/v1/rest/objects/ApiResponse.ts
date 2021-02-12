import {Status, RESPONSE_STATUS} from "../../../components/types/ResponseStatusTypes";


export class ApiResponse
{
    status: RESPONSE_STATUS = Status.Success;
    message: string | string[] = 'Operation Successful';
    result: any = null;
    error?: any;
    count?: number;
}
