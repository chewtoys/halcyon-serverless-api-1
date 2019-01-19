import * as repository from '../../repositories/userRepository';
import { tryParseInt } from '../../utils/string';
import {
    generateResponse,
    handleRequest,
    IHttpHandler
} from '../../utils/lambda';

const httpHandler: IHttpHandler = async request => {
    const { query } = request;

    const page = tryParseInt(query.page, 1);
    const size = tryParseInt(query.size, 10);

    const result = await repository.searchUsers(
        page,
        size,
        query.search,
        query.sort
    );

    return generateResponse(200, undefined, {
        items: result.items.map(user => ({
            id: user.id,
            emailAddress: user.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            isLockedOut: user.isLockedOut,
            hasPassword: !!user.password,
            emailConfirmed: user.emailConfirmed,
            twoFactorEnabled: user.twoFactorEnabled,
            gravatarUrl: user.gravatarUrl
        })),
        page: result.page,
        size: result.size,
        totalPages: result.totalPages,
        totalCount: result.totalCount,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage,
        search: query.search,
        sort: query.sort
    });
};

export const handler = handleRequest(httpHandler);
