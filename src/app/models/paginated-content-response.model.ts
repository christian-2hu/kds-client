import { PaginationResponse } from './pagination-response.model';

export interface PaginatedContentResponse<T> {
  content: T;
  pagination: PaginationResponse;
  error: string | undefined;
}
