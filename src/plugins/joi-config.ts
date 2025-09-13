import * as Joi from 'joi';

// Create a custom Joi with objectId method
const CustomJoi = {
    ...Joi,
    objectId: () => Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('must be a valid ObjectId')
};

// Export the type as well
export type JoiType = typeof CustomJoi;
export default CustomJoi;
