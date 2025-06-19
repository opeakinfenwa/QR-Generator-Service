import { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
export interface CustomJwtPayload extends JwtPayload {
    id: string;
    email: string;
    name: string;
}
export declare const isAuth: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=authMiddleware.d.ts.map