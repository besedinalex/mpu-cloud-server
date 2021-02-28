type GroupData = {
    id: number;
    title: string;
    owner: number;
    createdTime: Date;
    description?: string;
    access?: string;
    userJoinedDate?: Date;
};

export default GroupData;