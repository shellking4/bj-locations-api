import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Accessible } from '../../commons/decorators/accessible.decorator';
import { DepartmentService } from '../services/department.service';


@Controller("location/departments")
@ApiTags("LOCATIONS / DEPARTMENTS")
export class DepartmentController {

  constructor(
    public readonly departmentService: DepartmentService,
  ) { }

  @Get("insert-data")
  @Accessible()
  async insertData() {
    return this.departmentService.insertZonesDataInBackground();
  }
  
  @Get("all")
  // @Accessible()
  async getDepartments(): Promise<string[]> {
    return this.departmentService.findAll();
  }

  @Get(':depName')
  async getDepartmentByName(@Param('depName') depName: string) {
    return this.departmentService.findOneByName(depName);
  }

  @Get(":depName/towns")
  async getTowns(@Param('depName') depName: string) {
    return this.departmentService.findTowns(depName)
  }

  @Get(":depName/districts")
  async getDistricts(@Param('depName') depName: string) {
    return this.departmentService.findDistricts(depName)
  }

  @Get(":depName/neighborhoods")
  async getNeighborhoods(@Param('depName') depName: string) {
    return this.departmentService.findNeighborhoods(depName)
  }
}
