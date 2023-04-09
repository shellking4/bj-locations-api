import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseEntity } from "../../database/ormconfigs/base.entity";
import { Neighborhood } from "./neighborhood.entity";
import { Town } from "./town.entity";


@Entity("districts")
export class District extends BaseEntity {

    @Column({ name: "name" })
    name: string;

    @ManyToOne(
        type => Town, 
        town => town.districts,
        { onDelete: "SET NULL" }
    )
    @JoinColumn({ name: "town_id" })
    town: Town;

    @OneToMany(
        type => Neighborhood, 
        neighborhood => neighborhood.district
    )
    neighborhoods: Neighborhood[];

}