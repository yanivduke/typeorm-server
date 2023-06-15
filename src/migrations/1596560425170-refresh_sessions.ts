
import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class refreshSessions1596560425170 implements MigrationInterface {
    tableName: string;
    
    constructor () {
        this.tableName = "refresh_sessions"
    }
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
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
                    name: "refreshToken",
                    type: "uuid",
                    isGenerated:true,                    
                    generationStrategy: 'uuid',
                    default: `uuid_generate_v4()`
                },
                {
                    name: "ua",
                    type: "varchar",
                    length: "200",
                },
                {
                    name: "ip",
                    type: "varchar",
                    length: "15"
                },
                {
                    name: "expiresIn",
                    type: "bigint",
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
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable(this.tableName);
        await queryRunner.dropTable(this.tableName);
    }

}
