import { Column, Entity, JoinColumn, ManyToOne, OneToMany, RelationId } from "typeorm";
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

    @RelationId((value: Town) => value.departement)
    @Column({ name: 'department_id' })
    department: string;

    @OneToMany(
        type => District, 
        district => district.town
    )
    districts: District[];

}