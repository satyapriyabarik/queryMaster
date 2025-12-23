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
