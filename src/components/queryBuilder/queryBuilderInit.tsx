import React, { useEffect, useRef, useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { Card, Button, Stack, Container } from "react-bootstrap";
import { useQueryClient } from "@tanstack/react-query";

import RuleGroup from "./RuleGroup";
import { RuleGroup as RuleGroupType } from "./types";
import { EXECUTE_QUERY, PREVIEW_QUERY } from "../../graphql/queries";
import QueryHistoryGrid from "../savedQueries/QueryHistoryGrid";

/* =======================
   GraphQL typings
   ======================= */

interface PreviewQueryResult {
  previewQuery: string;
}

interface ExecuteQueryResult {
  executeQuery: any[];
}

/* =======================
   Initial state
   ======================= */

const initialState: RuleGroupType = {
  condition: "AND",
  rules: []
};

const QueryBuilder: React.FC = () => {
  /* =======================
     State + Ref (IMPORTANT)
     ======================= */

  const [query, setQuery] = useState<RuleGroupType>(initialState);

  // 🔑 Always holds the latest query state
  const queryRef = useRef<RuleGroupType>(initialState);

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  const queryClient = useQueryClient();

  /* =======================
     Apollo Lazy Queries
     ======================= */

  const [executeQuery, { loading: executeLoading }] =
    useLazyQuery<ExecuteQueryResult>(EXECUTE_QUERY);

  const [previewQuery, { data: previewData, loading: previewLoading }] =
    useLazyQuery<PreviewQueryResult>(PREVIEW_QUERY);

  /* =======================
     Handlers
     ======================= */

  const handleApply = async () => {
    const latestRules = queryRef.current;

    await executeQuery({
      variables: { rules: latestRules }
    });

    // 🔄 Refresh query history grid (TanStack Query)
    queryClient.invalidateQueries({
      queryKey: ["queryHistory"]
    });
  };

  const handlePreview = () => {
    previewQuery({
      variables: { rules: queryRef.current }
    });
  };

  /* =======================
     Render
     ======================= */

  return (
    <Container className="my-4">
      {/* =======================
          Query Builder
         ======================= */}
      <Card className="shadow-sm">
        <Card.Header className="fw-semibold">
          Query Builder
        </Card.Header>

        <Card.Body>
          {/* Rule Builder */}
          <RuleGroup group={query} onChange={setQuery} />

          {/* Actions */}
          <Stack
            direction="horizontal"
            gap={2}
            className="mt-3 justify-content-end"
          >
            <Button
              variant="outline-secondary"
              onClick={() => setQuery(initialState)}
              disabled={executeLoading}
            >
              Clear
            </Button>

            <Button
              variant="primary"
              onClick={handleApply}
              disabled={executeLoading}
            >
              {executeLoading ? "Applying..." : "Apply"}
            </Button>

            <Button
              variant="outline-dark"
              disabled={previewLoading}
              onClick={handlePreview}
            >
              {previewLoading ? "Generating..." : "Preview SQL"}
            </Button>
          </Stack>

          {/* SQL Preview */}
          {previewData?.previewQuery && (
            <Card className="mt-4 bg-dark text-success">
              <Card.Body
                style={{
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  maxHeight: 300,
                  overflow: "auto"
                }}
              >
                {previewData.previewQuery}
              </Card.Body>
            </Card>
          )}
        </Card.Body>
      </Card>

      {/* =======================
          Query History
         ======================= */}
      <Card className="mt-4 shadow-sm">
        <Card.Header className="fw-semibold">
          Query History
        </Card.Header>
        <Card.Body>
          <QueryHistoryGrid />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default QueryBuilder;
