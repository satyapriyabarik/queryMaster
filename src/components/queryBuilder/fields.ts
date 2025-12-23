export interface FieldDef {
  label: string;
  value: string;
  type: "select" | "number";
  options?: string[];
}

export const FIELDS: FieldDef[] = [
  { label: "Status", value: "status", type: "select", options: ["Active", "Expired"] },
  { label: "Web Sessions", value: "web_sessions", type: "number" },
  { label: "Last Seen", value: "last_seen", type: "select", options: ["7_days", "30_days"] },
  { label: "Plan", value: "plan", type: "select", options: ["Trial", "Paid"] }
];

export const OPERATORS = ["=", "!=", ">", "<", ">=", "<="] as const;

