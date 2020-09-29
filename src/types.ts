export type ServiceResponse = (code: number, data: object) => void;

export type UserData = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    createdTime: Date;
};