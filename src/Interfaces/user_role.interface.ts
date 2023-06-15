

export interface IUserRole {
    authId?:  number;
    roleId: number;
}
export interface IRole {
    id: number;
    name:string;
}

export enum ROLES {
    master = 1024, // duke only
    system = 512,
    admin = 256,
    support = 128,
    owner = 64,
    helpdesk = 32,
    agent = 16,
    customer = 8,
    buyer = 4,
    registered = 2,
    guest = 1
}
