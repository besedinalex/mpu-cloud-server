import ConvertStatus from "./convert-status";

type FileInfo = {
    name: string;
    extension: string;
    size: number;
    createdTime: Date;
    ownerName?: string;
    convertStatus?: ConvertStatus;
}

export default FileInfo;