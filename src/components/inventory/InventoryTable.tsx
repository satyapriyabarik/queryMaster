import { useQuery, useMutation } from "@apollo/client/react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useEffect, useState } from "react";

import { GET_INVENTORY, NOTIFY_ITEM } from "../../graphql/queries";
import { GetInventoryResult, InventoryItem } from "../../types/inventory";
import InvGrid, { InvGridHeader } from "../common/InvGrid";
import { mapInventoryToGrid } from "../../utils/mapInventoryToGrid";

/* =======================
   Grid Headers
   ======================= */

const headers: InvGridHeader[] = [
  { label: "Item", sortKey: "name" },
  { label: "Qty", sortKey: "quantity" },
  { label: "Min.Qty", sortKey: "quantity" },
  { label: "Expiry Date", sortKey: "expiryDate" },
  { label: "Location", sortKey: "storageLocation" },
  { label:"Max.Qty"},
  { label: "Status" },
  { label: "Action" }
];

/* =======================
   Component
   ======================= */

export const InventoryTable = () => {
  const { data, loading, error } =
    useQuery<GetInventoryResult>(GET_INVENTORY);

  const [notifyItem] = useMutation(NOTIFY_ITEM);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  useEffect(() => {
    if (data?.inventory) {
      setInventory(data.inventory);
    }
  }, [data]);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "warning";
  } | null>(null);

  if (loading) return <p>Loading...</p>;
  if (error || !data) return <p>Error!</p>;

  // ✅ NORMALIZE DOMAIN → GRID
  const rows = mapInventoryToGrid(inventory);

  return (
    <>
      <InvGrid
        rows={rows}
        headers={headers}
        searchable
        pagination
        pageSize={5}
        onNotify={async (id, status) => {
          try {
            await notifyItem({ variables: { id, type: status } });
             setInventory(prev =>
              prev.map(item =>
                item.id === id
                  ? {
                      ...item,
                      lastNotifiedAt: new Date().toISOString(),
                      notifyRemainingSeconds: 2 * 60 * 60 // 7200 sec
                    }
                  : item
              )
            );
            setToast({
              msg: "Notification sent successfully ✅",
              type: "success"
            });
          } catch (e: any) {
            setToast({
              msg: e.message || "Notification blocked",
              type: "warning"
            });
          }
        }}
      />

      <ToastContainer position="bottom-end">
        {toast && (
          <Toast
            bg={toast.type}
            show
            autohide
            delay={3000}
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
