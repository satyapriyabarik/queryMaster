import React from "react";
import { useQuery } from "@apollo/client/react";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { GET_SAVED_QUERIES } from "../../graphql/queries";
import { GetSavedQueriesResult, SavedQuery } from "../queryBuilder/types";

interface Props {
  onLoadQuery: (rules: any) => void;
}

const SavedQueriesGrid: React.FC<Props> = ({ onLoadQuery }) => {
  const { data, loading, error } =
    useQuery<GetSavedQueriesResult>(GET_SAVED_QUERIES);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">Failed to load queries</Alert>;
  }

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Query Name</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {data?.getSavedQueries.map((q: SavedQuery, index: number) => (
          <tr key={q.id}>
            <td>{index + 1}</td>
            <td>{q.name}</td>
            <td>{new Date(q.created_at).toLocaleString()}</td>
            <td>
              <Button
                size="sm"
                variant="primary"
                className="me-2"
                onClick={() => onLoadQuery(q.rules)}
              >
                Load
              </Button>

              <Button
                size="sm"
                variant="outline-secondary"
                onClick={() =>
                  alert(JSON.stringify(q.rules, null, 2))
                }
              >
                View Rules
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default SavedQueriesGrid;
