import dotenv from 'dotenv';
dotenv.config();
import pg from "pg";


const devConfig = {
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    host: process.env.DBHOST,
    port: Number(process.env.DBPORT),
    database: process.env.DBDB,
};


const pool = new pg.Pool(devConfig);

export default pool;