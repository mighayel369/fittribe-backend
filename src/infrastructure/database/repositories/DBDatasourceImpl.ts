import { connect } from 'mongoose';
import config from '../../../config';
import { injectable } from "tsyringe";
import { IDBDatasource } from 'domain/repositories/IDBDatasource';
import logger from 'logger';

@injectable()
export class DBDatasourceImpl implements IDBDatasource {
    private logger = logger;
    async connectDb(): Promise<boolean> {
        try {
            const url = config.MONGO_URL;
            const connection = await connect(url);

            if (connection) {
                this.logger.info('Database connected successfully');
                return true;
            }

            return false;
        } catch (err) {
            this.logger.error('DB connection error:', err);
            return false;
        }
    }
}