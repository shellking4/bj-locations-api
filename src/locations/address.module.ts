import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentController } from './controllers/department.controller';
import { DistrictController } from './controllers/district.controller';
import { NeighborhoodController } from './controllers/neighborhood.controller';
import { TownController } from './controllers/town.controller';
import { Department } from './entities/department.entity';
import { District } from './entities/district.entity';
import { Neighborhood } from './entities/neighborhood.entity';
import { Town } from './entities/town.entity';
import { ZonesDataProcessor } from './processors/zones-data-inserting.processor';
import { DepartmentService } from './services/department.service';
import { DistrictService } from './services/district.service';
import { NeighborhoodService } from './services/neighborhood.service';
import { TownService } from './services/town.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Department,
            District,
            Neighborhood,
            Town
        ]),
        BullModule.registerQueue({
            name: 'zonesData',
        }),
    ],
    exports: [
        DepartmentService,
        DistrictService,
        TownService
    ],
    providers: [
        DepartmentService,
        DistrictService,
        TownService,
        NeighborhoodService,
        ZonesDataProcessor,
    ],
    controllers: [
        DepartmentController,
        DistrictController,
        TownController,
        NeighborhoodController
    ]
})
export class AddressModule {}
