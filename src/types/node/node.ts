export interface ImageInfo {
    markedPicture?: string;
    unmarkedPicture?: string;
}

export interface ProjectInfo {
    projectId: string;
    images?: ImageInfo[];
    nodeId?: string[];
}

// App Screens starts
export type AppScreens = {
    screens: Screen[];
};

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
};

type Screen = {
    id: string;
    image: string;
    annotations: Annotation[];
};
// App Screens ends

// Node Screens starts

type Region = {
    name: string;
    coordinates: Coordinates;
    leadsTo: string;
    isCorrectPath: boolean;
    isTheEnd: boolean;
};

type Image = {
    id: string;
    filename: string;
    isStartPage: boolean;
    regions: Region[];
};

export type NodeData = {
    images: Image[];
};
// Node Screens ends
