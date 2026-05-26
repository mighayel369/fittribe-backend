
export const I_UPDATE_STATUS_TOKEN = Symbol("I_UPDATE_STATUS_TOKEN")
export const I_UPDATE_USER_STATUS_TOKEN = Symbol("I_UPDATE_USER_STATUS_TOKEN");
export interface IUpdateStatus<TRequestDTO> {
    execute(input: TRequestDTO): Promise<void>
}