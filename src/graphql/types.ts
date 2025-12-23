import { RuleGroup } from "../components/queryBuilder/types";

export interface PreviewQueryResult {
  previewQuery: string;
}

export interface PreviewQueryVariables {
  rules: RuleGroup;
}
