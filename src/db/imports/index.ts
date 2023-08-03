import dotenv from 'dotenv';
import { DBManaager } from '../db_manager';
const pathEnv = `${__dirname}/../../../.env`;
dotenv.config({ path: pathEnv });

export async function dbConnection() {
  DBManaager.connect({
    db: process.env.DB,
    url: process.env.DB_URL,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    debug: process.env.DB_DEBUG == 'true' ? true : false,
  });
}
