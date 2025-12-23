export type LogicalOperator = "AND" | "OR";

export type ComparisonOperator =
  | "="
  | "!="
  | ">"
  | "<"
  | ">="
  | "<=";

export interface Rule {
  field: string;
  operator: ComparisonOperator;
  value: string | number;
}

export interface RuleGroup {
  condition: LogicalOperator;
  rules: Array<Rule | RuleGroup>;
}
export interface SavedQuery {
  id: number;
  name: string;
  rules: any;
  created_at: string;
}

// export interface GetSavedQueriesResult {
//   getSavedQueries: SavedQuery[];
// }
export interface QueryHistoryRow {
  id: number;
  name: string;
  sql_text: string;
  rules: any;
  created_at: string;
}

export interface GetSavedQueriesResult {
  getSavedQueries: QueryHistoryRow[];
}

