import { Column, Entity, OneToMany } from "typeorm";
import { BaseEntity } from "../../database/ormconfigs/base.entity";
import { Town } from "./town.entity";


@Entity("departments")
export class Department extends BaseEntity {

    @Column({ name: "name", unique: true })
    name: string;

    @OneToMany(
        type => Town, 
        town => town.departement
    )
    towns: Town[];

}