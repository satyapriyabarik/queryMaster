import { Parser as SQLParser } from "node-sql-parser";

const parser = new SQLParser();

/* =======================
   Forbidden keywords
   ======================= */
const FORBIDDEN_KEYWORDS = [
  "DROP",
  "DELETE",
  "UPDATE",
  "INSERT",
  "ALTER",
  "TRUNCATE",
  "CREATE",
  "REPLACE",
  "MERGE"
];

/* =======================
   Validation result
   ======================= */
export interface SqlValidationResult {
  valid: boolean;
  error?: string;
}

/* =======================
   Friendly error mapper
   ======================= */
function mapParserError(sql: string): string {
  const trimmed = sql.trim();

  // Missing column list
  if (/^SELECT\s+FROM/i.test(trimmed)) {
    return "Invalid SELECT syntax. Column list is missing. Example: SELECT * FROM table_name";
  }

  // SELECT without FROM
  if (/^SELECT\s+/i.test(trimmed) && !/FROM/i.test(trimmed)) {
    return "SELECT query must include a FROM clause";
  }

  // Typo near FROM
  if (/FROM\s+[a-zA-Z_]+\s*$/i.test(trimmed)) {
    return "Invalid SQL syntax near FROM clause. Please check the table name.";
  }

  // SQL comments
  if (/--|\/\*|#/.test(trimmed)) {
    return "SQL comments are not allowed";
  }

  // Subqueries / expressions
  if (trimmed.includes("(")) {
    return "Subqueries and expressions using parentheses are not allowed";
  }

  // Variable assignment
  if (trimmed.includes(":=")) {
    return "Variable assignment (:=) is not allowed";
  }

  // Schema-qualified table
  if (/\w+\.\w+/.test(trimmed)) {
    return "Schema-qualified table names (schema.table) are not allowed";
  }

  return "Invalid SQL syntax. Please check your query.";
}

/* =======================
   Main validator
   ======================= */
export const validateSQL = (sql: string): SqlValidationResult => {
  if (!sql || !sql.trim()) {
    return {
      valid: false,
      error: "SQL cannot be empty"
    };
  }

  const upper = sql.toUpperCase();

  /* 🚫 Block forbidden keywords early */
  for (const word of FORBIDDEN_KEYWORDS) {
    if (upper.includes(word)) {
      return {
        valid: false,
        error: `Forbidden keyword detected: ${word}`
      };
    }
  }

  try {
    const ast = parser.astify(sql, {
      database: "MySQL"
    });

    /* 🚫 Multiple statements */
    if (Array.isArray(ast)) {
      return {
        valid: false,
        error: "Only one SQL statement is allowed"
      };
    }

    /* 🚫 Only SELECT */
    if (ast.type !== "select") {
      return {
        valid: false,
        error: "Only SELECT queries are allowed"
      };
    }

    /* ✅ Normalize FROM clause safely */
    const fromTables = Array.isArray(ast.from)
      ? ast.from
      : ast.from
      ? [ast.from]
      : [];

    if (fromTables.length === 0) {
      return {
        valid: false,
        error: "SELECT query must include a FROM clause"
      };
    }

    return { valid: true };
  } catch {
    return {
      valid: false,
      error: mapParserError(sql)
    };
  }
};
