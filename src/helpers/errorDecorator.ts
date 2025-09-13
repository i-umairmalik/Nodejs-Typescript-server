import * as _ from 'lodash';
import * as Boom from '@hapi/boom';

interface JoiError {
    isJoi: boolean;
    details: Array<{
        message: string;
        type: string;
        path: string[];
        context?: any;
    }>;
}

interface BoomError {
    isBoom: boolean;
    output: {
        statusCode: number;
        payload: any;
    };
    data?: any;
    message: string;
}

interface ErrorResponse {
    _code: number;
    _payload: {
        message: string;
        success: boolean;
        code?: number;
        details?: any;
        data?: any;
    };
}

export const decorateErrorResponse = (error: any): ErrorResponse => {
    console.log('Error', error);

    // if "joi" error object
    if (error && error.isJoi) {
        const joiError = error as JoiError;
        const JoiErrorResponse = {
            status: 'failed',
            // fetch only message and type from each error
            details: _.map(joiError.details, ({ message, type }) => ({
                message: message.replace(/['"]/g, ''),
                type
            }))
        };
        error = Boom.badRequest(JSON.stringify(JoiErrorResponse), { details: joiError.details });
    }

    // if "boom" error object
    if (error && error.isBoom) {
        const boomError = error as BoomError;
        const _code = _.get(boomError, 'output.statusCode', 500);
        const _payload = Object.assign(
            boomError.output.payload,
            boomError.data,
            { message: boomError.message, success: false }
        );

        // change "statusCode" to "code"
        _.set(_payload, 'code', _code);
        _.unset(_payload, 'statusCode');

        // remove "data" if "null"
        if (_.isNull(_payload.data))
            _.unset(_payload, 'data');

        // respond
        return { _code, _payload };
    }

    return { _code: 500, _payload: { message: 'Internal server error', success: false } };
};