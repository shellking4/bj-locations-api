import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "../../database/ormconfigs/base.entity";
import { District } from "./district.entity";


@Entity("neighborhoods")
export class Neighborhood extends BaseEntity {

    @Column({ name: "name" })
    name: string;

    @ManyToOne(
        type => District, 
        district => district.neighborhoods,
        { onDelete: "SET NULL" }
    )
    @JoinColumn({ name: "district_id" })
    district: District;

}