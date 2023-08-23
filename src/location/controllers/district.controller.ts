/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Accessible } from '../../commons/decorators/accessible.decorator';
import { DistrictService } from '../services/district.service';


@Controller("location/districts")
@ApiTags("LOCATION / DISTRICTS")
export class DistrictController {

  constructor(
    public readonly districtService: DistrictService,
  ) { }

  @Get("all")
  async getDistricts() {
    return this.districtService.findAll();
  }


  @Get(":districtName/neighborhoods")
  async getNeighborhoods(@Param('districtName') districtName: string) {
    return this.districtService.findNeighborhoods(districtName)
  }

}
