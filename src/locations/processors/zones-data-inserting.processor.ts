import { Process, Processor, OnQueueCompleted, OnQueueFailed } from '@nestjs/bull';
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
        let result = await this.departmentService.insertZonesData();
        return result;
    }
    
    @OnQueueCompleted({ name: "zonesDataInserting" })
    async onZonesDataInsertingCompleted(job: Job, result: any): Promise<any> {
        this.logger.debug(`Processing completed`);
        return;
    }

    @OnQueueFailed({ name: "zonesDataInserting" })
    async onZonesDataInsertingFailed(job: Job, error: any): Promise<any> {
        this.logger.debug(`Processing crashed`);
        return;
    }

}