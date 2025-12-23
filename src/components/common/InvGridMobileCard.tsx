import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BellIcon } from "lucide-react";
import { useCountdown } from "../../hooks/useCountdown";
import { InventoryRow } from "./InvGrid";
import { getInventoryStatus } from "../../utils/inventoryStatus";
import { INVENTORY_STATUS_CONFIG } from "../../config/inventoryStatus.config";

interface Props {
  item: InventoryRow;
  onNotify?: (id: string, status: string) => void;
}

const InvGridMobileCard: React.FC<Props> = ({ item, onNotify }) => {
  const status = getInventoryStatus(
    item.quantity,
    item.expiryDate,
    item.minStockLevel
  );

  const cfg = INVENTORY_STATUS_CONFIG[status];
  const remaining = useCountdown(item.notifyRemainingSeconds ?? 0);
  const canNotify = remaining === 0;
const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
  const tooltipText = canNotify
  ? "Notify"
  : `Already notified. Please try again in ${
      hours > 0 ? `${hours}h ` : ""
    }${minutes}m ${seconds}s`;
  return (
    <Card className="mb-2">
      <Card.Body>
        <div className="fw-semibold">{item.name}</div>
        <div className="text-muted small">
          Qty: {item.quantity} • {item.storageLocation}
        </div>

        <div className="d-flex justify-content-between mt-2">
          <span className="inv-status-badge" style={{ backgroundColor: cfg.color }}>
            {cfg.label}
          </span>

          <OverlayTrigger overlay={<Tooltip>{tooltipText}</Tooltip>}>
            <span>
              <BellIcon
                size={18}
                color={canNotify ? cfg.color : "#9ca3af"}
                style={{ cursor: canNotify ? "pointer" : "not-allowed" }}
                onClick={() => canNotify && onNotify?.(item.id, status)}
              />
            </span>
          </OverlayTrigger>
        </div>
      </Card.Body>
    </Card>
  );
};

export default InvGridMobileCard;
