import { PaginatedContentResponse } from './paginated-content-response.model';

export interface Response<T> {
  timestamp?: number;
  status: number;
  error: null | string;
  data: null | T | PaginatedContentResponse<T>;
  path?: string;
}
