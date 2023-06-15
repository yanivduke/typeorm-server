
import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class roles1600712408666 implements MigrationInterface {
    tableName: string;
    
    constructor () {
        this.tableName = "roles"
    }
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: this.tableName,
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isUnique: true,                
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "50",
                },
                {
                    name: "createdAt",
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
