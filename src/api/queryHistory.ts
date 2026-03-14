import { request } from "graphql-request";
import { GET_SAVED_QUERIES } from "../graphql/queries";
import { API_URL } from "../utils/constants";


export interface FetchQueryHistoryParams {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  order: string;
}

export interface QueryHistoryRow {
  id: number;
  name: string;
  sql_text: string;
  created_at: string;
}

export const fetchQueryHistory = async ({
  page,
  limit,
  search,
  sortBy,
  order
}: FetchQueryHistoryParams): Promise<QueryHistoryRow[]> => {
  const data = await request(
    API_URL,
    GET_SAVED_QUERIES,
    {
      page,
      limit,
      search,
      sortBy,
      order
    }
  );

  return data.getSavedQueries;
};
