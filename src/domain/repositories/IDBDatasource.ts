

export const I_DBDATASOURCE_TOKEN=Symbol("I_DBDATASOURCE_TOKEN")

export interface IDBDatasource{
    connectDb():Promise<boolean>
}