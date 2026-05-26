

import {
    PaginationRequestDTO,
    PaginationRequestSchema
} from "application/dto/common/PaginationDto";

export const WalletTransactionQuerySchema = PaginationRequestSchema().omit({ filter: true })

export type WalletTransactionQueryDTO = Omit<PaginationRequestDTO, 'filter'>
