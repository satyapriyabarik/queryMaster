import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { BellIcon, CheckCircle2Icon } from "lucide-react";

import { useCountdown } from "../../hooks/useCountdown";
import { getInventoryStatus } from "../../utils/inventoryStatus";
import { INVENTORY_STATUS_CONFIG } from "../../config/inventoryStatus.config";
import type { InventoryRow } from "./InvGrid";

/* =======================
   Props
   ======================= */

interface InvGridRowProps {
  item: InventoryRow;
  onNotify?: (id: string, status: string) => void;
}

/* =======================
   Component
   ======================= */

const InvGridRow: React.FC<InvGridRowProps> = ({
  item,
  onNotify
}) => {
  const status = getInventoryStatus(
    item.quantity,
    item.expiryDate,
    item.minStockLevel
  );

  const cfg = INVENTORY_STATUS_CONFIG[status];

  // 🔥 backend-driven cooldown
  const remaining = useCountdown(item.notifyRemainingSeconds ?? 0);
  const canNotify = remaining === 0;
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  const tooltipText = canNotify
    ? "Notify"
    : `Already notified. Please try again in ${hours > 0 ? `${hours}h ` : ""
    }${minutes}m ${seconds}s`;
  return (
    <tr>
      <td className="text-center">{item.name}</td>
      <td className="text-center">{item.quantity}</td>
      <td className="text-center">{item.minStockLevel}</td>
      <td className="text-center">{item.expiryDate}</td>
      <td className="text-center">{item.storageLocation}</td>
      <td className="text-center">{item.maxStockLevel}</td>
      <td className="text-center">
        <span
          className="inv-status-badge"
          style={{ backgroundColor: cfg.color }}
        >
          {cfg.label}
        </span>
      </td>

      <td className="text-center">
        {cfg.showNotify ? (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{tooltipText}</Tooltip>}
          >
            <span>
              <BellIcon
                size={18}
                color={canNotify ? cfg.color : "#9ca3af"}
                style={{
                  cursor: canNotify ? "pointer" : "not-allowed",
                  opacity: canNotify ? 1 : 0.5
                }}
                onClick={() => {
                  if (canNotify) {
                    onNotify?.(item.id, status);
                  }
                }}
              />
            </span>
          </OverlayTrigger>) : (<CheckCircle2Icon color={cfg.color} size={16} />)
        }
      </td>
    </tr>
  );
};

export default InvGridRow;
