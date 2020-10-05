export type ServiceResponse = (code: number, data: object) => void;

export type UserData = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    createdTime: Date;
};

export type GroupData = {
    id: number;
    title: string;
    owner: number;
    createdTime: Date;
    description?: string;
    access?: string;
    userJoinedDate?: Date;
}