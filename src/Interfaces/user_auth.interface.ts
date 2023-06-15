
import { UserAuth } from '../entities'
import { IRole } from './user_role.interface'
export interface IAuthRegister {
    email:   string;
    password:   string;
}
export interface IAuthInfo {
    authId?:   number;
    expiresIn?:string;
    roles?: IRole[]
}

export interface IPaymentAuth {
    sellerId:  number;
    fingerprint: string;
    orderId: number;
    ip: string;
    total: number;
    expiresIn?:string;
}

export interface IAuthLogin {
    email:   string;
    password:   string;
}

export enum RegStatus {
    OK = 0,
    Exists = 1,
    DBError=2,
    AccountError=3,
    DetailsError=4,
    RoleError = 5,
    NoTRX=6,
    Unexpected=7,
    Expired = 8,
    
}

export enum AuthStatus {
    OK = 0,
    NotFound = 1,
    WrongPass = 2,
    NoPlan = 3,
    FakeAccess = 4,
    ExpiredAccess = 5,
    NoRefresh = 6,
    ExpiredRefresh = 7,
    FakeRefresh = 8,
    Locked = 9,
    NotApproved = 10,
    NotConfirmed = 11
}

export interface IAuthResult {
    status: AuthStatus;
    info?: IAuthInfo;
    token?: string;
    session?: string;
    roles?: IRole[];
}

export interface IRegResult {
    status: RegStatus;
    user?: UserAuth;
    token?: string;
    data?: any;
}

