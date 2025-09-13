import _ from 'lodash';
import Joi from '../joi-config';
import * as JoiTypes from 'joi';

export interface ILoginPlugin {
    schema(): JoiTypes.ObjectSchema;
    decorate(value: any): any;
}

export const schema = (): JoiTypes.ObjectSchema => {
    return Joi.object().keys({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }).required(),
        password: Joi.string().min(8).max(30).required(),
        remember_me: Joi.boolean().optional().default(false),
        ip: Joi.string().optional(),
        user_agent: Joi.string().optional(),
    });
};

export const decorate = (value: any): any => {
    return _.chain({
        email: _.get(value, 'email', undefined),
        password: _.get(value, 'password', undefined),
        remember_me: _.get(value, 'remember_me', false),
        ip: _.get(value, 'ip', undefined),
        user_agent: _.get(value, 'user_agent', undefined),
        login_timestamp: new Date().toISOString(),
    }).omitBy(_.isUndefined).omitBy(_.isNull).value();
};

// Default export for the plugin
const loginPlugin: ILoginPlugin = {
    schema,
    decorate
};

export default loginPlugin;
