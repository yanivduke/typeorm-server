import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class Links1687087696168 implements MigrationInterface {
    tableName: string;
    
    constructor () {
        this.tableName = "links"
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
                    length: "30",
                },
                {
                    name: "desc",
                    type: "varchar",
                    length: "100",
                    isNullable: true,
                },
                {
                    name: "link",
                    type: "text",
                },
                {
                    name: "cdate",
                    type: "timestamp",
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: "status",
                    type: "boolean",
                },
                {
                    name: "features",
                    type: "text",
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable(this.tableName);
        await queryRunner.dropTable(this.tableName);
    }

}

