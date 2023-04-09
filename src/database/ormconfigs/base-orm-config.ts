
export const devBaseOrmConfig: any = {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    port: (process.env.DATABASE_PORT as any) as number,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
}

export const prodBaseOrmConfig: any = {
    type: process.env.DATABASE_TYPE,
    host: process.env.DATABASE_HOST,
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    port: (process.env.DATABASE_PORT as any) as number,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
}

export const baseOrmConfig: any = process.env.ENV === "PROD" ? prodBaseOrmConfig : devBaseOrmConfig