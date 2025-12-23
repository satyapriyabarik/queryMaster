import React from "react";
import { Rule, ComparisonOperator } from "./types";
import { FIELDS, OPERATORS } from "./fields";
import { Trash2 } from "lucide-react";

interface Props {
  rule: Rule;
  onChange: (rule: Rule) => void;
  onDelete: () => void;
}

/* =======================
   Helpers (TYPE SAFE)
   ======================= */

const getDefaultOperatorForField = (): ComparisonOperator => {
  return "=";
};

const getDefaultValueForField = (field: string): string | number => {
  switch (field) {
    case "status":
      return "Active";
    case "plan":
      return "Trial";
    case "last_seen":
      return "7"; // or 7 depending on backend
    case "web_sessions":
      return 0;
    default:
      return "";
  }
};

/* =======================
   Component
   ======================= */

const RuleRow: React.FC<Props> = ({ rule, onChange, onDelete }) => {
  const fieldConfig = FIELDS.find(f => f.value === rule.field);

  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
      {/* Field */}
      <select
        value={rule.field}
        onChange={e => {
          const newField = e.target.value;

          onChange({
            field: newField,
            operator: getDefaultOperatorForField(), // ✅ typed
            value: getDefaultValueForField(newField)
          });
        }}
      >
        {FIELDS.map(f => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      {/* Operator */}
      <select
        value={rule.operator}
        onChange={e =>
          onChange({
            ...rule,
            operator: e.target.value as ComparisonOperator // ✅ safe cast
          })
        }
      >
        {OPERATORS.map(op => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>

      {/* Value */}
      {fieldConfig?.type === "select" ? (
        <select
          value={String(rule.value)}
          onChange={e =>
            onChange({
              ...rule,
              value: e.target.value
            })
          }
        >
          {fieldConfig.options?.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="number"
          value={Number(rule.value)}
          onChange={e =>
            onChange({
              ...rule,
              value: Number(e.target.value)
            })
          }
        />
      )}

      {/* Delete */}
      <button
        className="btn btn-danger btn-sm"
        onClick={onDelete}
        title="Delete rule"
        type="button"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};

export default RuleRow;
