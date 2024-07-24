export interface ImageInfo {
    markedPicture?: string;
    unmarkedPicture?: string;
}

export interface ProjectInfo {
    projectId: string;
    images?: ImageInfo[];
    nodeId?: string[];
}
