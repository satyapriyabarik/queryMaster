import React from "react";
import { Card, Container } from "react-bootstrap";

import InputQuery from "./InputQuery";
import QueryHistoryGrid from "../savedQueries/QueryHistoryGrid";

/* =======================
   Component
   ======================= */

const QueryBuilder: React.FC = () => {
  return (
    <Container className="my-4">
      {/* =======================
          SQL Input / Execution
         ======================= */}
      <Card className="shadow-sm">
        <Card.Header className="fw-semibold">
          SQL Query Executor
        </Card.Header>
        <Card.Body>
          <InputQuery />
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
