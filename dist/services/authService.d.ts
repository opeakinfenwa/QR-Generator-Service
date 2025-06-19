export declare const loginService: (email: string, password: string) => Promise<{
    token: string;
    user: any;
}>;
export declare const changePasswordService: (userId: string, currentPassword: string, newPassword: string) => Promise<any>;
export declare const resetPasswordService: (email: string, newPassword: string, securityQuestionAnswer: string) => Promise<any>;
//# sourceMappingURL=authService.d.ts.map