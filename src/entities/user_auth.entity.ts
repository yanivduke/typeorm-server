
import { BaseEntity, Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity("user_auths")
export class UserAuth extends BaseEntity {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column()
    email: string;

    @Column()
    isConfirmed: boolean;

    @Column()
    isApproved: boolean;

    @Column()
    isLocked: boolean;

    @Column()
    passwordFormat: string;

    @Column()
    passwordSalt: string;

    @Column()
    passwordHash: string;

    @Column()
    resetPasswordToken: string;

    @Column()
    confirmToken: string;

    @Column()
    tokenCreateDate: Date;

    @Column()
    lastLogin: Date;

    @Column()
    lastChanged: Date;

    @Column()
    failedCount: number;

    @Column("bigint")
    updatedBy?: number;
}
