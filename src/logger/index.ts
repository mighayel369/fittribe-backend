import config from "config";
import { ProductionLogger } from "./productionLogger";
import { devLogger } from "./devLogger";
import { Logger } from "winston";


const logger: Logger = config.NODE_ENV === 'prod'
    ? ProductionLogger()
    : devLogger();

export default logger;