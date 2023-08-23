import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { DepartmentService } from '../services/department.service';

@Processor('zonesData')
export class ZonesDataProcessor {

    private readonly logger = new Logger(ZonesDataProcessor.name);

    constructor(
        private readonly departmentService: DepartmentService
    ) { }

    @Process('zonesDataInserting')
    async handleZonesDataInserting(job: Job): Promise<any> {
        console.log("started inserting data")
        let result = await this.departmentService.insertZonesData();
        console.log("done inserting data")
        return result;
    }

}