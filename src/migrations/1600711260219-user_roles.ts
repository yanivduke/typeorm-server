
import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class userRoles1600711260219 implements MigrationInterface {
    tableName: string;
    
    constructor () {
        this.tableName = "user_roles"
    }
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: this.tableName,
            columns: [
                {
                    name: "id",
                    type: "bigint",
                    isPrimary: true,
                    isUnique: true,
                    isGenerated:true,                   
                },
                {
                    name: "auth_id",
                    type: "bigint",
                },
                {
                    name: "role_id",
                    type: "int",
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    isNullable: false,
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: "updatedBy",
                    type: "bigint",
                    isNullable: true
                },
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable(this.tableName);
        await queryRunner.dropTable(this.tableName);
    }

}
