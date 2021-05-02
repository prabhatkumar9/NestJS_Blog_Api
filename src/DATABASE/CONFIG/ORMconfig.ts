export function ormConfig(): any {

    // return {
    //     type: process.env.DATABASE_TYPE,
    //     host: process.env.DATABASE_HOST,
    //     port: parseInt(process.env.DATABASE_PORT),
    //     username: process.env.DATABASE_USERNAME,
    //     password: process.env.DATABASE_PASSWORD,
    //     database: process.env.DATABASE_NAME,
    //     synchronize: true,
    //     logging: false,
    //     autoLoadEntities: true,
    //     useUnifiedTopology: true,
    //     useNewUrlParser: true,
    //     // connectTimeout: parseInt(process.env.DATABASE_CONNECTION_TIME_OUT),
    //     // acquireTimeout: parseInt(process.env.DATABASE_ACQUIRE_TIME_OUT),
    //     // extra: {
    //     //     connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT),
    //     // },
    // };

    return {
        "type": "postgres",
        "host": "localhost",
        "port": "5432",
        "username": "postgres",
        "password": "admin",
        "database": "bloging",
        "synchronize": "true",
        "logging": "true",
        "autoLoadEntities": "true",
        // "entities":["./src/**/*.entity.ts","./dist/**/*.entity.js"],
    }

}