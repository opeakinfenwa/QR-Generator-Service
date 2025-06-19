import { Request, Response, NextFunction } from "express";
interface ErrorResponse extends Error {
    statusCode?: number;
}
export declare const errorHandler: (err: ErrorResponse, req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=handleErrors.d.ts.map