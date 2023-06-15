
import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity("user_roles")
export class UserRole extends BaseEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column("bigint")
    auth_id: number;

    @Column()
    role_id: number;

    @Column("bigint")
    updatedBy?: number;

}
