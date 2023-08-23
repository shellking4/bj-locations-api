import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { BaseEntity } from "../../database/ormconfigs/base.entity";


@Entity("users")
export class User extends BaseEntity {

    @Column({ unique: true })
    email: string;

    @Column({ name: "password" })
    password: string;

}