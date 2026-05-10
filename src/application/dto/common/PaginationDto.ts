export interface PaginationInputDTO<F = unknown> {
  filter?: F;
  currentPage: number;
  limit: number;
}

export interface PaginationOutputDTO<T> {
  data: T[];
  total: number;
}