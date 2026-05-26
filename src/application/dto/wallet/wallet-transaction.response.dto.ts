import { z } from "zod";

import {
  PaginationResponseDTO,
  PaginationResponseSchema
} from "../common/PaginationDto";

import {
  TRANSACTION_SOURCE,
  TRANSACTION_TYPE
} from "domain/constants/wallet-constants";



export const TransactionSchema =
  z.object({
    type: z.enum(TRANSACTION_TYPE),
    amount: z.number(),
    source: z.enum(TRANSACTION_SOURCE),
    bookingId: z.string().optional(),
    createdAt: z.string()
  });

export type TransactionDTO = z.infer<typeof TransactionSchema>;


export const WalletDetailsResponseSchema =
  PaginationResponseSchema(
    TransactionSchema
  ).extend({
    balance: z.number(), activeHoldCount: z.number()
  });

export type WalletDetailsResponseDTO =
  PaginationResponseDTO<TransactionDTO> & {
    balance: number;
    activeHoldCount: number;
  };