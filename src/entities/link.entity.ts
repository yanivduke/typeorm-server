
import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity("links")
export class Link extends BaseEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column()
    name: string;

    @Column()
    desc: string;
    
    @Column()
    link: string;
    
    @Column()
    cdate: Date;
    
    @Column()
    status: boolean;
    
    @Column()
    features: string
}
