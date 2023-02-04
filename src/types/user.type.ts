type userType = {
    Wallet: {
        balance: number;
        deposit: number;
        withdraw: number;
    };
    payment: {
        bank: {
            bankName: string;
            name: string;
            account: string;
        };
        private: boolean;
        rule: string;
        email: string;
        password: string;
        username: string;
    };
    rank: string;
    changeBalance: number;
    uploadCCCDFont: string;
    uploadCCCDBeside: string;
    uploadLicenseFont: string;
    uploadLicenseBeside: string;
    blockUser: boolean;
};

export { userType };
