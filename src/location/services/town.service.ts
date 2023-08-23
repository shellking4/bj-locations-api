import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GetTownNeighborhoodsDto, GetTownDistrictsDto, GetTownDto } from "../dtos/response.dto";
import { Town } from "../entities/town.entity";

@Injectable()
export class TownService {

    constructor(
        @InjectRepository(Town)
        private readonly townsRepository: Repository<Town>
    ) {}

    async findTownById(id: string): Promise<Town> {
        let town = await this.townsRepository.findOneOrFail({
            where: { id: id }
        }).catch(error => {
            throw new NotFoundException(`An error occured retrieving the resource. Stack trace: ${error}`);
        });
        return town;
    }

    async findAll(): Promise<GetTownDto[]> {
        const towns = (await this.townsRepository.find())
            .map(element => {
                const { id, name, ...rest } = element
                return  { id, name }
            });
        return towns;
    }

    async findDistricts(townName: string): Promise<GetTownDistrictsDto> {
        const town = await this.townsRepository
            .findOneOrFail({
                where: { name: townName.toUpperCase() },
                relations: { districts: true }
            }).catch(err => {
                throw new BadRequestException(`An error occured. Stack trace: ${err}`);
            });
        const districts = town.districts.map(dstr => {
            const { name, ...rest } = dstr
            return name;
        })
        return {
            town: town.name,
            districts: districts
        }
    }

    async findNeighborhoods(townName: string): Promise<GetTownNeighborhoodsDto> {
        const town = await this.townsRepository
            .findOneOrFail({
                where: { name: townName.toUpperCase() },
                relations: { districts: { neighborhoods: true } }
            }).catch(err => {
                throw new BadRequestException(`An error occured. Stack trace: ${err}`);
            });
        let neighborhoods: any = town.districts.flatMap(dstr => dstr.neighborhoods);
        neighborhoods = neighborhoods.map(ngbh => {
            const { name, ...rest } = ngbh
            return name;
        });
        return {
            town: town.name,
            neighborhoods: neighborhoods
        };
    }

}