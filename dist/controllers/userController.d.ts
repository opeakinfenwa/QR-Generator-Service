import { Request, Response, NextFunction } from "express";
export declare const signupController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateUserController: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserController: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteUserController: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=userController.d.ts.map