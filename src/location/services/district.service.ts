/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GetDistrictNeighborhoodsDto } from "../dtos/response.dto";
import { District } from "../entities/district.entity";



@Injectable()
export class DistrictService {

    constructor(
        @InjectRepository(District)
        private readonly districtsRepository: Repository<District>
    ) { }

    async findAll(): Promise<string[]> {
        const districts = (await this.districtsRepository.find())
            .map(dstr => {
                const { name, ...rest } = dstr
                return name
            });
        return districts;
    }

    async findNeighborhoods(distrName: string): Promise<GetDistrictNeighborhoodsDto> {
        const district = await this.districtsRepository
            .findOneOrFail({
                where: { name: distrName.toUpperCase() },
                relations: { neighborhoods: true }
            }).catch(err => {
                throw new BadRequestException(`An error occured. Stack trace: ${err}`);
            });
        const neighborhoods = district.neighborhoods.map(ngbh => {
            const { name, ...rest } = ngbh
            return name;
        });
        return {
            district: district.name,
            neighborhoods: neighborhoods
        };
    }


    async findNeighborhoodsAll(distrName: string): Promise<District> {
        const district = await this.districtsRepository
            .findOneOrFail({
                where: { name: distrName.toUpperCase() },
                relations: { neighborhoods: true }
            }).catch(err => {
                throw new BadRequestException(`An error occured. Stack trace: ${err}`);
            });

        return district;
    }

}