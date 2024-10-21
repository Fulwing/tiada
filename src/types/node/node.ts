export interface ImageInfo {
    markedPicture?: string;
    unmarkedPicture?: string;
}

export interface ProjectInfo {
    projectId: string;
    images?: ImageInfo[];
    nodeId?: string[];
}

export type Coordinates = {
    x: number;
    y: number;
    width?: number;
    height?: number;
};

type Annotation = {
    id: string;
    label: string;
    coordinates: Coordinates;
    leadsTo: string;
    isCorrectPath: boolean;
    isTheEnd: boolean;
};

type Screen = {
    id: string;
    image: string;
    annotations: Annotation[];
};
// App Screens ends

// Node Screens starts

export interface NodeData {
    screens: Array<{
        id: string;
        image: string; // base64 encoded image
        annotations: Array<{
            id: string;
            label: string;
            coordinates: {
                x: number;
                y: number;
                width: number;
                height: number;
            };
            leadsTo: string;
            isCorrectPath: boolean;
            isTheEnd: boolean;
        }>;
    }>;
}

// Node Screens ends
