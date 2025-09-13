import _ from 'lodash';
import Joi from '../joi-config';
import * as JoiTypes from 'joi';

export interface IUpdatePlugin {
    schema(): JoiTypes.ObjectSchema;
    decorate(value: any): any;
}

export const schema = (): JoiTypes.ObjectSchema => {
    return Joi.object().keys({
        username: Joi.string().optional(),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }).optional(),
        password: Joi.string().min(8).max(30).regex(/[a-zA-Z0-9]{3,30}/).optional(),
        updated_by: Joi.objectId().optional(),
        is_deleted: Joi.boolean().optional(),
        is_blocked: Joi.boolean().optional(),
        is_super_admin: Joi.boolean().optional(),
        status: Joi.string().optional(),
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
    }).min(1); // At least one field must be provided for update
};

export const decorate = (value: any): any => {
    return _.chain({
        username: _.get(value, 'username', undefined),
        email: _.get(value, 'email', undefined),
        password: _.get(value, 'password', undefined),
        updated_by: _.get(value, 'updated_by', undefined),
        is_deleted: _.get(value, 'is_deleted', undefined),
        is_blocked: _.get(value, 'is_blocked', undefined),
        is_super_admin: _.get(value, 'is_super_admin', undefined),
        status: _.get(value, 'status', undefined),
        dtu: new Date().toISOString(), // Date time updated
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
const updatePlugin: IUpdatePlugin = {
    schema,
    decorate
};

export default updatePlugin;
