
import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity("roles")
export class Role extends BaseEntity {
    @PrimaryColumn("int")
    id: number;

    @Column()
    name: string
}
