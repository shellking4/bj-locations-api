/* eslint-disable prettier/prettier */
import 'dotenv/config'
import { DataSource, DataSourceOptions } from "typeorm"
import { baseOrmConfig } from "./base-orm-config"

const cliOrmConfig: DataSourceOptions = {
    ...baseOrmConfig,
    entities: ["src/**/*/*.entity{.ts,.js}"],
    migrations: ["src/**/*/*-Migration{.ts,.js}"]
}

export default new DataSource(cliOrmConfig)