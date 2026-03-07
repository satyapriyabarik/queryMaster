

import { useEffect, useState } from "react";
import {
  Button,
  Stack,
  Form,
  Alert,
  Card,
  Spinner,
  ToastContainer,
  Toast
} from "react-bootstrap";
import { useMutation, useQuery } from "@apollo/client/react";
import { useQueryClient } from "@tanstack/react-query";

import { validateSQL } from "../../utils/sqlValidator";
import {
  GET_QUERYABLE_TABLES
} from "../../graphql/queries";
import {
  EXECUTE_RAW_QUERY,
  SAVE_EXECUTED_QUERY
} from "../../graphql/mutations";

import ResultGrid from "../savedQueries/ResultGrid";
import { useQueryExecution } from "../../context/QueryExecutionContext";

/* =======================
   GraphQL typings
   ======================= */

interface ExecuteRawQueryResult {
  executeRawQuery: any[];
}

interface SaveQueryResult {
  saveExecutedQuery: boolean;
}

interface GetQueryableTablesResult {
  getQueryableTables: string[];
}

/* =======================
   Component
   ======================= */

const InputQuery: React.FC = () => {
  const { sql: externalSQL } = useQueryExecution();

  const [sql, setSql] = useState("");
  const [error, setError] = useState<string | null>(null);
   const [valid, setValid] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [resultRows, setResultRows] = useState<any[]>([]);
  const [canSave, setCanSave] = useState(false);

  const queryClient = useQueryClient();
const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "warning";
  } | null>(null);
  /* =======================
     Fetch available tables
     ======================= */
  const {
    data: tablesData,
    loading: tablesLoading
  } = useQuery<GetQueryableTablesResult>(GET_QUERYABLE_TABLES);

  /* =======================
     Mutations
     ======================= */
  const [executeRawQuery, { loading: executing }] =
    useMutation<ExecuteRawQueryResult>(EXECUTE_RAW_QUERY);

  const [saveExecutedQuery, { loading: saving }] =
    useMutation<SaveQueryResult>(SAVE_EXECUTED_QUERY);

  /* =======================
     React to external execute
     ======================= */
  useEffect(() => {
    if (!externalSQL) return;

    setSql(externalSQL);
    setError(null);
    setIsValid(false);
    setCanSave(false);
    setResultRows([]);

    const validation = validateSQL(externalSQL);

    if (!validation.valid) {
      setError(validation.error || "Invalid SQL");
      return;
    }

    setIsValid(true);

    executeRawQuery({ variables: { sql: externalSQL } })
      .then(res => {
        setResultRows(res.data?.executeRawQuery ?? []);
        setCanSave(true);

        queryClient.invalidateQueries({
          queryKey: ["queryHistory"]
        });
      })
      .catch(err => {
        setError(err.message || "Query execution failed");
      });
  }, [externalSQL]);

  /* =======================
     Handlers
     ======================= */

  const handleSqlChange = (value: string) => {
    setSql(value);
    setIsValid(false);
    setCanSave(false);
    setError(null);
  };

  const handleValidate = () => {
    const result = validateSQL(sql);

    if (!result.valid) {
      setError(result.error || "Invalid SQL");
      setIsValid(false);
    } else {
      setError(null);
      setIsValid(true);
      setValid("SQL is valid! You can execute the query.");
    }
  };

  const handleClear = () => {
    setSql("");
    setError(null);
    setIsValid(false);
    setCanSave(false);
    setResultRows([]);
  };

  const handleExecute = async () => {
    if (!isValid) return;

    try {
      const res = await executeRawQuery({ variables: { sql } });
      setResultRows(res.data?.executeRawQuery ?? []);
      setCanSave(true);

      queryClient.invalidateQueries({
        queryKey: ["queryHistory"]
      });
      setToast({
        msg: "Query executed successfully ✅",
        type: "success"
      });
    } catch (err: any) {
      setError(err.message || "Query execution failed");
      setCanSave(false);
      setToast({
        msg: "Query execution failed ❌",
        type: "warning"
      });
    }
  };

  const handleSaveQuery = async () => {
    if (!canSave) return;

    try {
      await saveExecutedQuery({
        variables: { sql }
      });

      setCanSave(false);

      queryClient.invalidateQueries({
        queryKey: ["queryHistory"]
      });
      setToast({
        msg: "Query saved successfully ✅",
        type: "success"
      });
    } catch (err: any) {
      setError(err.message || "Failed to save query");
      setToast({
        msg: "Failed to save query ❌",
        type: "warning"
      });
    }
  };

  /* =======================
     Render
     ======================= */

  return (<>
    <div>
      {/* ===== Table helper ===== */}
      <Card className="mb-3 shadow-sm">
        <Card.Body>
          <Card.Title className="fs-6 mb-2">
            Available Tables
          </Card.Title>

          {tablesLoading ? (
            <Spinner size="sm" animation="border" />
          ) : (
            <div className="d-flex flex-wrap gap-2">
              {tablesData?.getQueryableTables.map(table => (
                <code
                  key={table}
                  style={{
                    cursor: "pointer",
                    padding: "2px 6px",
                    borderRadius: 4,
                    background: "#f1f5f9"
                  }}
                  onClick={() =>
                    handleSqlChange(`SELECT * FROM ${table}`)
                  }
                >
                  {table}
                </code>
              ))}
            </div>
          )}

          <small className="text-muted d-block mt-2">
            Click a table name to start a query
          </small>
        </Card.Body>
      </Card>

      {/* ===== SQL input ===== */}
      <Form.Control
        as="textarea"
        rows={6}
        placeholder="Type SELECT query here..."
        value={sql}
        onChange={e => handleSqlChange(e.target.value)}
      />

      {/* ===== Error ===== */}
      {error && (
        <Alert variant="danger" className="text-danger mt-2">
          {error}
        </Alert>
      )}
       {/* ===== Valid Query ===== */}
      {isValid && (
        <Alert variant="success" className="text-success mt-2" closeVariant="black" onClose={() => setValid(null)} dismissible>
          {valid}
        </Alert>
      )}

      {/* ===== Actions ===== */}
      <Stack
        direction="horizontal"
        gap={2}
        className="mt-3 justify-content-end"
      >
        <Button
          variant="outline-secondary"
          onClick={handleClear}
          disabled={!sql}
        >
          Clear
        </Button>

        <Button
          variant="warning"
          onClick={handleValidate}
          disabled={!sql}
        >
          Validate
        </Button>

        <Button
          variant="primary"
          onClick={handleExecute}
          disabled={!isValid || executing}
        >
          {executing ? "Executing..." : "Execute"}
        </Button>

        {/* 🔥 Save Query */}
        <Button
          variant="success"
          onClick={handleSaveQuery}
          disabled={!canSave || saving}
        >
          {saving ? "Saving..." : "Save Query"}
        </Button>
      </Stack>

      {/* ===== Results ===== */}
      <Card className="mt-4 shadow-sm">
        <Card.Header className="fw-semibold">
          Results
        </Card.Header>
        <Card.Body>
          <ResultGrid rows={resultRows} />
        </Card.Body>
      </Card>
    </div>
    <ToastContainer position="top-center">
        {toast && (
          <Toast
            bg={toast.type}
            show
            autohide
            delay={4000}
            onClose={() => setToast(null)}
          >
            <Toast.Body className="text-white">
              {toast.msg}
            </Toast.Body>
          </Toast>
        )}
      </ToastContainer>
    </>
  );
};

export default InputQuery;

