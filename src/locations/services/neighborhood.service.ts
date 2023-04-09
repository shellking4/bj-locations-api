import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getRangeWithDots } from "src/commons/helpers/utils.helper";
import { Repository } from "typeorm";
import { PaginateDto } from "../../commons/dtos/request.dto";
import { GetNeighborhoods } from "../dtos/response.dto";
import { Neighborhood } from "../entities/neighborhood.entity";



@Injectable()
export class NeighborhoodService {

    constructor(
        @InjectRepository(Neighborhood)
        private readonly neighborhoodsRepository: Repository<Neighborhood>
    ) {}

    async findAll(params: PaginateDto): Promise<GetNeighborhoods> {
        let dataLength = params.dataLength ?? 20;
        let pageNumber = params.pageNumber;
        let skip = (pageNumber - 1) * dataLength;
        let dataQueryBuilder = this.neighborhoodsRepository.createQueryBuilder("neighborhood");
        dataQueryBuilder.skip(skip).take(dataLength);
        let neighborhoods: any[];
        neighborhoods = await dataQueryBuilder.getMany();
        neighborhoods = neighborhoods.map(ngbh => {
            const { name, ...rest } = ngbh
            return  name
        });
        const totalRecordsCount = await dataQueryBuilder.getCount();
        const dataCount = neighborhoods.length;
        const pages = Array(Math.ceil(totalRecordsCount / dataLength)).fill(0).map((_, i) => i + 1);
        const pageNumbers = getRangeWithDots(pageNumber, pages.length);
        const response = {
            data: neighborhoods,
            dataCount: dataCount,
            totalRecordsCount: totalRecordsCount,
            pageNumbers: pageNumbers
        };
        return response;
    }

}