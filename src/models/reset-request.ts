type ResetRequest = {
    id?: number;
    valid?: boolean;
    email: string;
    token: string;
};

export default ResetRequest;