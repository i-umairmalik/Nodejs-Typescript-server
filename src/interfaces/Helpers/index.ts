// =============================================================================
// HELPER INTERFACES - Error handling and utility interfaces
// =============================================================================

export interface IJoiError {
    isJoi: boolean;
    details: Array<{
        message: string;
        type: string;
        path: string[];
        context?: any;
    }>;
}

export interface IBoomError {
    isBoom: boolean;
    output: {
        statusCode: number;
        payload: any;
    };
    data?: any;
    message: string;
}

export interface IErrorResponse {
    _code: number;
    _payload: {
        message: string;
        success: boolean;
        code?: number;
        details?: any;
        data?: any;
    };
}
