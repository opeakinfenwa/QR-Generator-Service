export declare const signupService: (email: string, password: string, name: string, securityQuestion: string, securityAnswer: string) => Promise<any>;
export declare const updateUserService: (userId: string, updates: {
    name?: string;
    email?: string;
}) => Promise<any>;
export declare const getUserService: (id: string) => Promise<any>;
export declare const deleteUserService: (id: string) => Promise<any>;
//# sourceMappingURL=userService.d.ts.map