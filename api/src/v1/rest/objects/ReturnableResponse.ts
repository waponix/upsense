import {ApiResponse} from "./ApiResponse";

export class ReturnableResponse {
    statusCode: number;
    body: ApiResponse;

    constructor(statusCode: number, body: ApiResponse) {
        this.statusCode = statusCode;
        this.body = body;
    }
}
