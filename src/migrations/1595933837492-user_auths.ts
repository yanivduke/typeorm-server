
import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class user_auths1595933837492 implements MigrationInterface {
    tableName: string;
    
    constructor () {
        this.tableName = "user_auths"
    }

    async up(queryRunner: QueryRunner): Promise<any> {
        //await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
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
                    name: "email",
                    type: "varchar",
                    length: "100",
                    isUnique: true
                },
                {
                    name: "confirmToken",
                    type: "varchar",
                    length: "25"
                },
                {
                    name: "tokenCreateDate",
                    type: "timestamp",
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: "isConfirmed",
                    type: "boolean",
                    isNullable: true,
                },
                {
                    name: "isApproved",
                    type: "boolean",
                    isNullable: true,
                },
                {
                    name: "isLocked",
                    type: "boolean",
                    isNullable: true,
                },
                {
                    name: "passwordFormat",
                    type: "varchar",
                    length: "10"
                },
                {
                    name: "passwordSalt",
                    type: "text",
                },
                {
                    name: "passwordHash",
                    type: "text",
                },
                {
                    name: "resetPasswordToken",
                    type: "text",
                    isNullable: true,
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: "updatedBy",
                    type: "bigint",
                    isNullable: true
                },
                {
                    name: "lastLogin",
                    type: "timestamp",
                    isNullable: true
                },
                {
                    name: "lastChanged",
                    type: "timestamp",
                    isNullable: true
                },
                {
                    name: "failedCount",
                    type: "int",
                    default: '0'
                }
            ]
        }))
    }

    async down(queryRunner: QueryRunner): Promise<any> {
        const table = await queryRunner.getTable(this.tableName);
        await queryRunner.dropTable(this.tableName);
    }
}
