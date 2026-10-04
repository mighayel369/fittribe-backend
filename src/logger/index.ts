import config from './../config'
import { ProductionLogger } from "./productionLogger";
import { devLogger } from "./devLogger";
import { Logger } from "winston";
import { NODE_ENV } from 'utils/Constants';


const logger: Logger = config.NODE_ENV === NODE_ENV.PRODUCTION
    ? ProductionLogger()
    : devLogger();

export default logger;