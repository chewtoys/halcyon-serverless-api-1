import { APIGatewayEvent, Context } from 'aws-lambda';
import mongoose from 'mongoose';
import { validate } from './validators';
import config from './config';

export type IHttpHandler = (request: IHttpRequest) => Promise<IHttpResponse>;

export interface IHttpRequest {
    body: any;
    query: any;
    params: any;
    currentUserId?: string;
}

export interface IHttpResponse {
    statusCode: number;
    headers: { [index: string]: string | boolean };
    body: string;
}

export const handleRequest = (
    handler: IHttpHandler,
    requestSchema?: {}
) => async (event: APIGatewayEvent, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    const body = getBody(event);
    const query = event.queryStringParameters || {};
    const params = event.pathParameters || {};

    const currentUserId =
        event.requestContext.authorizer &&
        event.requestContext.authorizer.principalId;

    if (requestSchema) {
        const errors = validate(body, requestSchema);
        if (errors) {
            return generateResponse(400, errors);
        }
    }

    await mongoose.connect(
        config.MONGODB,
        { useNewUrlParser: true, useCreateIndex: true }
    );

    mongoose.Promise = global.Promise;

    const connection = mongoose.connection;
    connection.on(
        'error',
        console.error.bind(console, 'MongoDB connection error:')
    );

    return await handler({ body, query, params, currentUserId });
};

const getBody = <T = any>(event: APIGatewayEvent): T => {
    if (!event.body) {
        return undefined;
    }

    return JSON.parse(event.body) as T;
};

export const generateResponse = (
    statusCode: number,
    messages: string[],
    data?: any
): IHttpResponse => ({
    statusCode,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
        messages,
        data
    })
});
