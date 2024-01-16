import { Column, Entity } from "typeorm";
import { BaseEntity } from "../../database/ormconfigs/base.entity";


@Entity("users_")
export class User extends BaseEntity {

    @Column({ unique: true })
    email: string;

    @Column({ name: "password" })
    password: string;

}