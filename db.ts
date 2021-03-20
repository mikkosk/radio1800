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

const proConfig = () => {
  const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql';
  return({
      user: process.env.DBUSER, 
      password: process.env.DBPASS, 
      database: process.env.DBDB, 
      host: `/${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    }
  );
};

const pool = new pg.Pool(process.env.NODE_ENV === "production" ? proConfig() : devConfig);

export default pool;