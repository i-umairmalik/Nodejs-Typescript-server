import { Interfaces } from "../interfaces";

// Helper function for validation
const validateRequest = async (pluginType: string, data: any, options: { type?: string } = {}, logger: Interfaces.AppLogger, pluginsHelper: Interfaces.PluginsHelper) => {
    try {
        logger.info("Validating request:", { pluginType, data, options });
        const { schema, data: decoratedData } = await pluginsHelper.pluginsType(pluginType, data, options);

        const { error, value } = schema.validate(decoratedData, {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true,
        });

        return {
            isValid: !error,
            error,
            validatedData: value,
            errorResponse: error ? {
                error: "Validation failed",
                details: error.details.map((detail: any) => ({
                    field: detail.path.join('.'),
                    message: detail.message,
                    value: detail.context?.value,
                })),
            } : null
        };
    } catch (error) {
        logger.error("Error in validation helper:", error as Error);
        throw error;
    }
};

export default validateRequest;