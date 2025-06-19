export declare const hashPassword: (password: string) => Promise<string>;
export declare const hashSecurityAnswer: (answer: string) => Promise<string>;
export declare const comparePassword: (password: string, hashedPassword: string) => Promise<boolean>;
export declare const generateAuthToken: (payload: {
    id: number;
    email: string;
}) => Promise<string>;
export declare const compareSecurityAnswer: (providedAnswer: string, storedHashedAnswer: string) => Promise<boolean>;
//# sourceMappingURL=authUtils.d.ts.map