import { request } from "graphql-request";
import { GET_SAVED_QUERIES } from "../graphql/queries";

const GRAPHQL_ENDPOINT = "http://localhost:4000/graphql";

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
  rules: any;
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
    GRAPHQL_ENDPOINT,
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
