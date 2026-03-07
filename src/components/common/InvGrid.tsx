import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, Download } from "lucide-react";
import { Form, Button, Card, Dropdown } from "react-bootstrap";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { INVENTORY_STATUS_CONFIG } from "../../config/inventoryStatus.config";
import { getInventoryStatus } from "../../utils/inventoryStatus";
import InvGridRow from "./InvGridRow";
import InvGridMobileCard from "./InvGridMobileCard";
import "../../styles/inv-grid.css";

export interface InventoryRow {
  id: string;
  name: string;
  quantity: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  expiryDate: string;
  storageLocation: string;
  notifyRemainingSeconds?: number;
}

export type SortKey =
  | "name"
  | "quantity"
  | "expiryDate"
  | "storageLocation";

export interface InvGridHeader {
  label: string;
  sortKey?: SortKey;
  align?: "left" | "center" | "right";
}

interface Props {
  rows: InventoryRow[];
  headers: InvGridHeader[];
  searchable?: boolean;
  pagination?: boolean;
  exportable?: boolean;
  pageSize?: number;
  onNotify?: (id: string, status: string) => void;
}

const InvGrid: React.FC<Props> = ({
  rows,
  headers,
  searchable = true,
  pagination = true,
  exportable = true,
  pageSize = 5,
  onNotify
}) => {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const handleSort = (key?: SortKey) => {
    if (!key) return;
    if (key === sortKey) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const processedRows = useMemo(() => {
    let data = rows;

    if (search.trim()) {
      data = data.filter(r =>
        [
          r.name,
          r.storageLocation,
          r.expiryDate,
          r.quantity,
          getInventoryStatus(r.quantity, r.expiryDate, r.minStockLevel, r.maxStockLevel)
        ]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    return [...data].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      return sortDir === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
    });
  }, [rows, search, sortKey, sortDir]);

  const totalPages = pagination
    ? Math.ceil(processedRows.length / pageSize)
    : 1;

  const paginatedRows = pagination
    ? processedRows.slice((page - 1) * pageSize, page * pageSize)
    : processedRows;

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(processedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, "inventory.csv");
  };
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(processedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventory");
    XLSX.writeFile(wb, "inventory.xlsx");
  }

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [["Item", "Qty", "Expiry", "Location", "Status"]],
      body: processedRows.map(r => [
        r.name,
        r.quantity,
        r.expiryDate,
        r.storageLocation,
        INVENTORY_STATUS_CONFIG[
          getInventoryStatus(r.quantity, r.expiryDate, r.minStockLevel)
        ].label
      ])
    });
    doc.save("inventory.pdf");
  };

  return (
    <Card className="shadow-sm border-2">
      <Card.Body>

        <div className="d-flex justify-content-between mb-3">
          {searchable && (
            <Form.Control
              placeholder="Search..."
              style={{ maxWidth: 260 }}
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          )}

          {exportable && (
            <Dropdown align="end">
              <Dropdown.Toggle size="sm" variant="outline-secondary">
                <Download size={14} /> Export
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={exportCSV}>CSV</Dropdown.Item>
                <Dropdown.Item onClick={exportExcel}>Excel</Dropdown.Item>
                <Dropdown.Item onClick={exportPDF}>PDF</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>

        {/* Desktop */}
        <div className="d-none d-md-block">
          <table className="table text-center">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    onClick={() => handleSort(h.sortKey)}
                    style={{ cursor: h.sortKey ? "pointer" : "default" }}
                  >
                    {h.label}
                    {h.sortKey === sortKey &&
                      (sortDir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedRows.map(item => (
                <InvGridRow
                  key={item.id}
                  item={item}
                  onNotify={onNotify}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="d-md-none">
          {paginatedRows.map(item => (
            <InvGridMobileCard
              key={item.id}
              item={item}
              onNotify={onNotify}
            />
          ))}
        </div>

        {pagination && totalPages > 1 && (
          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
            <span>Page {page} / {totalPages}</span>
            <Button size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default InvGrid;
