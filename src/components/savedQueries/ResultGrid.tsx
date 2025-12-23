

import { Table } from "react-bootstrap";
import formatHeader from "../../utils/formatHeder";
import { formatDate } from "../../utils/date";

interface Props {
  rows: any[];
}

/* =======================
   Helpers
   ======================= */

// Detect date-like column names
const isDateColumn = (key: string) =>
  /date|_at|last_seen|time/i.test(key);

// Detect valid date values
const isValidDateValue = (value: any) => {
  if (!value) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
};

const ResultGrid: React.FC<Props> = ({ rows }) => {
  if (!rows.length) return null;

  const columns = Object.keys(rows[0]);

  return (
    <Table striped bordered hover responsive className="mt-2 text-nowrap danger">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col}>{formatHeader(col)}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, idx) => (
          <tr key={idx}>
            {columns.map(col => {
              const value = row[col];

              return (
                <td key={col}>
                  {isDateColumn(col) && isValidDateValue(value)
                    ? formatDate(value) // ✅ formatted date
                    : value !== null && value !== undefined
                    ? String(value)
                    : "—"}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ResultGrid;


