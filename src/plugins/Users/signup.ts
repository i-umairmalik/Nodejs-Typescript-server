import _ from 'lodash';
import Joi, { JoiType } from '../joi-config';
import { ISignupPlugin } from '../../interfaces/Plugins';

export const schema = () => {
    return Joi.object().keys({
        username: Joi.string().required(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }).required(),
        password: Joi.string().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/).required(),
        access_token: Joi.string().optional(),
        dt: Joi.date().max('now').iso().optional(),
        created_by: Joi.objectId().optional(),
        deleted_by: Joi.objectId().optional(),
        updated_by: Joi.objectId().optional(),
        blocked_by: Joi.objectId().optional(),
        is_deleted: Joi.boolean().optional(),
        is_blocked: Joi.boolean().optional(),
        is_super_admin: Joi.boolean().optional(),
        ip: Joi.string().optional(),
        x_access_token: Joi.string().optional(),
        last_login: Joi.date().iso().optional(),
        is_login: Joi.boolean().optional(),
        city: Joi.objectId().optional(),
        status: Joi.string().optional(),
        dtu: Joi.date().iso().optional(),
        profile: Joi.object().keys({
            first_name: Joi.string().max(100).optional(),
            last_name: Joi.string().max(100).optional(),
            phone: Joi.string().regex(/^(923)\d{9}$/, 'numbers').max(12).min(11).optional(),
            cnic: Joi.string().length(13).optional(),
            address: Joi.string().optional(),
            date_of_birth: Joi.date().iso().optional(),
            gender: Joi.string().valid('M', 'F', 'Male', 'Female').optional(),
            picture: Joi.string().optional()
        }).optional(),
    });
};

export const decorate = (value: any): any => {
    return _.chain({
        username: _.get(value, 'username', undefined),
        email: _.get(value, 'email', undefined),
        password: _.get(value, 'password', undefined),
        access_token: _.get(value, 'access_token', undefined),
        created_by: _.get(value, 'created_by', undefined),
        deleted_by: _.get(value, 'deleted_by', undefined),
        updated_by: _.get(value, 'updated_by', undefined),
        blocked_by: _.get(value, 'blocked_by', undefined),
        is_deleted: _.get(value, 'is_deleted', undefined),
        is_blocked: _.get(value, 'is_blocked', undefined),
        is_super_admin: _.get(value, 'is_super_admin', undefined),
        ip: _.get(value, 'ip', undefined),
        x_access_token: _.get(value, 'x_access_token', undefined),
        last_login: _.get(value, 'last_login', undefined),
        is_login: _.get(value, 'is_login', undefined),
        city: _.get(value, 'city', undefined),
        status: _.get(value, 'status', undefined),
        dtu: _.get(value, 'dtu', undefined),
        dt: new Date().toISOString(),
        profile: _.chain({
            first_name: _.get(value, 'profile.first_name', undefined),
            last_name: _.get(value, 'profile.last_name', undefined),
            phone: _.get(value, 'profile.phone', undefined),
            cnic: _.get(value, 'profile.cnic', undefined),
            address: _.get(value, 'profile.address', undefined),
            date_of_birth: _.get(value, 'profile.date_of_birth', undefined),
            gender: _.get(value, 'profile.gender', undefined),
            picture: _.get(value, 'profile.picture', undefined),
        }).omitBy(_.isUndefined).omitBy(_.isNull).value(),
    }).omitBy(_.isUndefined).omitBy(_.isNull).value();
};

// Default export for the plugin
const signupPlugin: ISignupPlugin = {
    schema,
    decorate
};

export default signupPlugin;