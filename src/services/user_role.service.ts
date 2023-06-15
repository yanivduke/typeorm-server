import { DataSource, QueryRunner } from "typeorm";
import { IAuthInfo, IRole, IUserRole, ROLES } from "../Interfaces";
import { Role, UserRole } from "../entities";
import { SPSService } from "./sps.service";

export class UserRoleService extends SPSService<UserRole> {
    constructor() {
        super(UserRole);
    }

    public async create(role2user: IUserRole, trx: QueryRunner): Promise<number> {
        let userRole = new UserRole()
        userRole.auth_id = role2user.authId;
        userRole.role_id = role2user.roleId;
        userRole.updatedBy = role2user.authId;
        userRole = await trx.manager.getRepository(UserRole).save(userRole);
        
        return userRole.id
    }

    public async getDetails(scope: IAuthInfo, userId: number): Promise<IRole[]> {
        let roles = await this.dataConn.getRepository(UserRole).find({where:{auth_id:userId}});
        return roles.map((userRole) => {
            return {
                id:userRole.role_id,
                name: ROLES[userRole.role_id]
            }
        })
    }

    public async add(scope: IAuthInfo, authId: number, roleId: number): Promise<number> {
        let role2user = new UserRole();
        role2user.updatedBy = scope.authId;
        role2user.auth_id = authId;
        role2user.role_id = roleId;
        role2user = await this.dataConn.getRepository(UserRole).save(role2user);
        return role2user.id
    }
}
