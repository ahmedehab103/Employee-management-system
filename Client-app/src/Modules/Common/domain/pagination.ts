export interface PaginationParams {
  offset: number;
  pageIndex: number;
  search: string | null;
  ascending: boolean;
  sortBy: string | null;
}
export interface PaginationRespons<T> {
  pageInfo: PageInfo;
  items: T[];
}

export interface PageInfo {
  pageIndex: number;
  totalPages: number;
  totalCount: number;
}
