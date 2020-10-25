import ModelAnnotation from "./model-annotation";
import ConvertStatus from "./convert-status";

type FileData = {
    userId?: number;
    modelAnnotations?: ModelAnnotation[];
    convertStatus?: ConvertStatus;
}

export default FileData;