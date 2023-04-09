import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';
import { baseOrmConfig } from './base-orm-config';

export const appOrmConfig: DataSourceOptions = {
    ...baseOrmConfig,
    entities: ["dist/**/*/*.entity{.ts,.js}"]
};
