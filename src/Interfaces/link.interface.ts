
export enum LinkStatus {
    OK = 0,
}

export interface ILink {
    name: string;
    desc?: string;
    link: string;
    cdate: Date;
    status: boolean;
    features: string
}

export interface ILinkData {
    id: number;
    name: string;
    desc?: string;
}

export interface ILinkStatus {
    id: number;
    status: boolean;
}

