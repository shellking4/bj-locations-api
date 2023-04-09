/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Department } from "../entities/department.entity";
import { District } from "../entities/district.entity";
import { Neighborhood } from "../entities/neighborhood.entity";
import { Town } from "../entities/town.entity";
import { InjectQueue } from "@nestjs/bull";
import * as zonesData from "./territorial-zones-data.json"
import { Queue } from "bull";
import { GetDepartmentByNameDto, GetDepartmentDistrictsDto, GetDepartmentNeighborhoodsDto, GetDepartmentTownsDto } from "../dtos/response.dto";



@Injectable()
export class DepartmentService {

    constructor(
        @InjectRepository(Department)
        private readonly departmentsRepository: Repository<Department>,
        @InjectRepository(Town)
        private readonly townsRepository: Repository<Town>,
        @InjectRepository(District)
        private readonly districtsRepository: Repository<District>,
        @InjectRepository(Neighborhood)
        private readonly neiborhoodsRepository: Repository<Neighborhood>,
        @InjectQueue('zonesData')
        private readonly zonesData: Queue,
    ) { }

    async insertZonesData() {
        const departments = zonesData.departements;
        for (let i = 0; i < departments.length; i++) {
            const departmentItem = departments[i]
            const department = this.departmentsRepository.create({
                name: departmentItem.name
            });
            await department.save().catch(err => {
                console.log(err);
            });
            await department.reload();
            const towns = departmentItem.towns;
            for (let j = 0; j < towns.length; j++) {
                const townItem = towns[j]
                const town = this.townsRepository.create({
                    name: townItem.name
                });
                town.departement = department;
                await town.save().catch(err => {
                    console.log(err);
                });
                await town.reload();
                const districts = townItem.districts;
                for (let k = 0; k < districts.length; k++) {
                    const districtItem = districts[k]
                    const district = this.districtsRepository.create({
                        name: districtItem.name
                    });
                    district.town = town;
                    await district.save().catch(err => {
                        console.log(err);
                    });
                    await district.reload();
                    const neighborhoods = districtItem.neighborhoods;
                    for (let l = 0; l < neighborhoods.length; l++) {
                        const neighborhoodItem = neighborhoods[l]
                        const neighborhood = this.neiborhoodsRepository.create({
                            name: neighborhoodItem
                        });
                        neighborhood.district = district;
                        await neighborhood.save().catch(err => {
                            console.log(err);
                        });
                    }
                }
            }
        }
        return (0);
    }

    async insertZonesDataInBackground(): Promise<any> {
        this.zonesData.add("zonesDataInserting");
        return;
    }

    async findAll(): Promise<string[]> {
        const departments = (await this.departmentsRepository.find({
            relations: { towns: false }
        })).map(element => {
            const { name, ...rest } = element
            return name
        });
        return departments;
    }

    async findOneByName(depName: string): Promise<GetDepartmentByNameDto> {
        const department = await this.departmentsRepository.findOneOrFail({
            where: { name: depName?.toUpperCase() }
        }).catch(err => {
            throw new BadRequestException(`An error occured. Stack trace: ${err}`);
        });
        const { name, createdAt, ...rest } = department;
        return { name, createdAt };
    }

    async findTowns(depname: string): Promise<GetDepartmentTownsDto> {
        const department = await this.departmentsRepository
            .findOneOrFail({
                where: { name: depname.toUpperCase() },
                relations: { towns: true }
            }).catch(err => {
                throw new BadRequestException(`An error occured. Stack trace: ${err}`);
            });
        const towns = department.towns.map(town => {
            const { name, ...rest } = town
            return name;
        })
        return {
            department: department.name,
            towns: towns
        }
    }

    async findDistricts(depname: string): Promise<GetDepartmentDistrictsDto> {
        const department = await this.departmentsRepository
            .findOneOrFail({
                where: { name: depname.toUpperCase() },
                relations: { towns: { districts: true } }
            }).catch(err => {
                throw new BadRequestException(`An error occured. Stack trace: ${err}`);
            });
        let districts: any = department.towns.flatMap(town => town.districts);
        districts = districts.map(district => {
            const { name, ...rest } = district
            return name;
        });
        return {
            department: department.name,
            districts: districts
        };
    }

    async findNeighborhoods(name: string): Promise<GetDepartmentNeighborhoodsDto> {
        const department = await this.departmentsRepository
            .findOneOrFail({
                where: { name: name.toUpperCase() },
                relations: { towns: { districts: { neighborhoods: true } } }
            }).catch(err => {
                throw new BadRequestException(`An error occured. Stack trace: ${err}`);
            });
        let neighborhoods: any = (department
            .towns
            .flatMap(town => town.districts)
            .flatMap(district => district.neighborhoods))
            .map(neighborhood => {
                const { name, createdAt, ...rest } = neighborhood
                return { name, createdAt };
            });
        return {
            department: department.name,
            neighborhoods: neighborhoods
        };
    }

}