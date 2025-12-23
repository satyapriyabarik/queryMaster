import React, { createContext, useContext, useState } from "react";

interface QueryExecutionContextType {
  sql: string;
  executeSQL: (sql: string) => void;
}

const QueryExecutionContext =
  createContext<QueryExecutionContextType | null>(null);

export const QueryExecutionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [sql, setSql] = useState("");

  const executeSQL = (sqlText: string) => {
    setSql(sqlText);
  };

  return (
    <QueryExecutionContext.Provider value={{ sql, executeSQL }}>
      {children}
    </QueryExecutionContext.Provider>
  );
};

export const useQueryExecution = () => {
  const ctx = useContext(QueryExecutionContext);
  if (!ctx) {
    throw new Error(
      "useQueryExecution must be used inside QueryExecutionProvider"
    );
  }
  return ctx;
};
