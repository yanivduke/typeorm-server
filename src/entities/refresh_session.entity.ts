
import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("refresh_sessions")
export class RefreshSession extends BaseEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;
    
    @PrimaryColumn("bigint")
    auth_id: number;

    @Column('uuid')
    refreshToken: string;

    @Column()
    ua: string;

    @Column()
    ip: string;

    @Column('bigint')
    expiresIn: number;
}
