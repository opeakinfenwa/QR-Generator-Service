export declare class CustomError extends Error {
    statusCode: number;
    success: boolean;
    constructor(message: string, statusCode: number);
}
export declare class BadRequestError extends CustomError {
    constructor(message?: string);
}
export declare class NotFoundError extends CustomError {
    constructor(message?: string);
}
export declare class UnauthorizedError extends CustomError {
    constructor(message?: string);
}
export declare class ForbiddenError extends CustomError {
    constructor(message?: string);
}
export declare class ConflictError extends CustomError {
    constructor(message?: string);
}
export declare class InternalServerError extends CustomError {
    constructor(message?: string);
}
//# sourceMappingURL=customErrors.d.ts.map