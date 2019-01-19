import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda';
import jsonWebToken from 'jsonwebtoken';
import config from '../utils/config';

export interface IPermissionMap {
    path: string;
    requiredRoles: string[];
}

export interface IJwtPayload {
    sub: string;
    role: string;
}

const isUserAdministrator = ['System Administrator', 'User Administrator'];

const permissionsMap: IPermissionMap[] = [
    { path: '/manage', requiredRoles: [] },
    {
        path: '/user',
        requiredRoles: isUserAdministrator
    }
];

export const handler = async (event: CustomAuthorizerEvent) => {
    const token =
        event.authorizationToken &&
        event.authorizationToken.replace(/bearer /giu, '');

    if (!token) {
        return 'Unauthorized';
    }

    let payload: IJwtPayload;
    try {
        payload = (await jsonWebToken.verify(
            token,
            config.JWT_SECURITY_KEY
        )) as IJwtPayload;
    } catch (error) {
        console.error('Verify Token Failed', error);
    }

    if (!payload) {
        return 'Unauthorized';
    }

    const requiredRoles = getRequiredRoles(event.methodArn);
    if (!requiredRoles) {
        return 'Unauthorized';
    }

    if (!requiredRoles.length) {
        return generatePolicy(payload.sub, 'Allow', event.methodArn);
    }

    if (
        !payload.role ||
        !requiredRoles.some(value => payload.role.includes(value))
    ) {
        return generatePolicy(payload.sub, 'Deny', event.methodArn);
    }

    return generatePolicy(payload.sub, 'Allow', event.methodArn);
};

const getRequiredRoles = (path: string) => {
    const map = permissionsMap.find(permission =>
        path.includes(permission.path)
    );

    return map && map.requiredRoles;
};

const generatePolicy = (
    principalId: string,
    effect: string,
    resource: string
): CustomAuthorizerResult => ({
    principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }
        ]
    }
});
