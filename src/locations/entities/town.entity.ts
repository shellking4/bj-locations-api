import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../database/ormconfigs/base.entity";
import { Department } from "./department.entity";
import { District } from "./district.entity";


@Entity("towns")
export class Town extends BaseEntity {

    @Column({ name: "name", unique: true })
    name: string;

    @ManyToOne(
        type => Department,
        department => department.towns,
        { onDelete: "SET NULL" })
    @JoinColumn({ name: "department_id" })
    departement: Department;

    @OneToMany(
        type => District, 
        district => district.town
    )
    districts: District[];

}