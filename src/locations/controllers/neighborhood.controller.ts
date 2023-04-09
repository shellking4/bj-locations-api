import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginateDto } from '../../commons/dtos/request.dto';
import { Accessible } from '../../commons/decorators/accessible.decorator';
import { NeighborhoodService } from '../services/neighborhood.service';


@Controller("location/neighborhoods")
@ApiTags("LOCATION / NEIGHBORHOODS")
export class NeighborhoodController {

  constructor(
    public readonly neighborhoodService: NeighborhoodService,
  ) { }

  @Post("")
  async getNeighborhoods(@Body() params: PaginateDto) {
    return this.neighborhoodService.findAll(params);
  }

}
