import { connect } from 'mongoose';
import config from '../../../config';
import { injectable } from "tsyringe";
import { IDBDatasource } from 'domain/repositories/IDBDatasource';
import logger from 'utils/logger';

@injectable()
export class DBDatasourceImpl implements IDBDatasource {
    async connectDb(): Promise<boolean> {
        try {
            const url = config.MONGO_URL;
            const connection = await connect(url);

            if (connection) {
                logger.info('Database connected successfully');
                return true;
            }

            return false;
        } catch (err) {
            logger.error('DB connection error:', err);
            return false;
        }
    }
}