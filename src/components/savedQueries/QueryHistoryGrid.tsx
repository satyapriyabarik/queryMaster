import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Form, Button, Spinner, Alert, Modal } from "react-bootstrap";
import { fetchQueryHistory } from "../../api/queryHistory";
import { parseMySQLDate } from "../../utils/date";
import { useQueryExecution } from "../../context/QueryExecutionContext";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

const PAGE_SIZE = 5;

const QueryHistoryGrid = () => {

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSQL, setSelectedSQL] = useState("");
  /* =======================
     Debounce + min length
     ======================= */
  useEffect(() => {
    const t = setTimeout(() => {
      if (searchInput.length >= 2) {
        setPage(1);
        setSearch(searchInput);
      } else if (searchInput.length === 0) {
        setPage(1);
        setSearch("");
      }
    }, 500);

    return () => clearTimeout(t);
  }, [searchInput]);

  /* =======================
     TanStack Query
     ======================= */
  const {
    data: rows = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ["queryHistory", page, search],
    queryFn: () =>
      fetchQueryHistory({
        page,
        limit: PAGE_SIZE,
        search,
        sortBy: "created_at",
        order: "DESC"
      }),
    placeholderData: previousData => previousData
  });

  const { executeSQL } = useQueryExecution();
  if (isLoading) return <Spinner animation="border" />;
  if (isError) return <Alert variant="danger">Failed to load history</Alert>;

  return (
    <>

      {/* Search */}
      <Form.Control
        placeholder="Search (min 3 characters)…"
        className="mb-2"
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
      />

      {/* Grid */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th className="text-center text-muted">QID</th>
            <th className="text-center text-muted">Name</th>
            <th className="text-center text-muted">Executed At</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center text-muted">
                No query history found
              </td>
            </tr>
          ) : (
            rows.map((q: any) => (
              <tr key={q.id}>
                <td className="text-center text-muted">{q.id}</td>
                <td className="text-center text-primary text-underline"><Button variant="text" onClick={() => {
                  setSelectedSQL(q.sql_text);
                  setShowModal(true);
                }}>{q.name || "—"}</Button></td>

                <td className="text-center text-muted">{parseMySQLDate(q.created_at)}</td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-end gap-2 mt-3">
        <Button
          size="sm"
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          <ArrowLeftIcon />
        </Button>

        <Button size="sm" variant="secondary" disabled>
          Page {page}
        </Button>

        <Button
          size="sm"
          disabled={PAGE_SIZE * page > rows.length}

          onClick={() => setPage(p => p + 1)}
        >
          <ArrowRightIcon />

        </Button>
      </div>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Generated SQL</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <pre
            style={{
              background: "#111",
              color: "#0f0",
              padding: 12,
              borderRadius: 4,
              maxHeight: 400,
              overflow: "auto"
            }}
          >
            {selectedSQL}
          </pre>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => {
            executeSQL(selectedSQL);
            setShowModal(false);
          }}>
            Execute
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default QueryHistoryGrid;
