import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Accessible } from '../../commons/decorators/accessible.decorator';
import { TownService } from '../services/town.service';


@Controller("location/towns")
@ApiTags("LOCATION / TOWNS")
export class TownController {

  constructor(
    public readonly townService: TownService,
  ) { }

  @Get("all")
  async getTowns() {
    return this.townService.findAll();
  }

  @Get(":townName/districts")
  async getDistricts(@Param('townName') townName: string) {
    return this.townService.findDistricts(townName)
  }

  @Get(":townName/neighborhoods")
  async getNeighborhoods(@Param('townName') townName: string) {
    return this.townService.findNeighborhoods(townName)
  }
}
