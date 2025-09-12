import * as Lodash from 'lodash';
import * as moment from 'moment';
import mongoose from 'mongoose';
import * as Boom from '@hapi/boom';
import * as joi from 'joi';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import * as mime from 'mime-types';
import * as path from 'path';

// Extend joi with objectId validator - proper initialization for joi-objectid v4
let Joi: any;
try {
    const joiObjectId = require('joi-objectid');
    // For joi-objectid v4, we need to pass Joi as an argument
    Joi = joiObjectId(joi);
} catch (error: any) {
    console.warn('Failed to extend Joi with objectId validator, using base Joi:', error.message);
    Joi = joi;
}

// Utility functions (placeholder - you can add your utility functions here)
const Utility = {
    // Add your utility functions here
};

export {
    moment,
    Lodash as _,
    Joi,
    mongoose,
    Boom,
    jwt as Jwt,
    Utility,
    crypto,
    mime,
    path
};