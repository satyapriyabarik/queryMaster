export type InventoryStatus =
  | "EXPIRED"
  | "NEAR_EXPIRY"
  | "OUT_OF_STOCK"
  | "LOW_STOCK"
  | "NORMAL";

export const INVENTORY_STATUS_CONFIG: Record<
  InventoryStatus,
  {
    label: string;
    className: string;
    color: string;
    backgoundColor?: string;
    showNotify?: boolean;
    homeTitle?: string;   // 👈 Home page title
    homeIcon?: string;    // 👈 semantic icon key (optional)
  }
> = {
  EXPIRED: {
    label: "Expired",
    className: "inventory-expired",
    color: "#dc3545",
    backgoundColor: "red-100",
    showNotify: true,
    homeTitle: "Expired Items",
    homeIcon: "XCircleIcon"
  },
  NEAR_EXPIRY: {
    label: "Near Expiry",
    className: "inventory-near-expiry",
    color: "#FFBF00",
    backgoundColor: "yellow-100",
    showNotify: true,
    homeTitle: "Near Expiry",
    homeIcon: "Clock"
  },
  OUT_OF_STOCK: {
    label: "Out of Stock",
    className: "inventory-out-of-stock",
    color: "#6c757d",
    showNotify: true,
    homeTitle: "Out of Stock",
    homeIcon: "AlertTriangle"
  },
  LOW_STOCK: {
    label: "Low Stock",
    className: "inventory-low-stock",
    color: "#f97316",
    showNotify: true,
    homeTitle: "Low Stock",
    homeIcon: "AlertTriangle"
  },
  NORMAL: {
    label: "Available",
    className: "inventory-normal",
    color: "#198754",
    showNotify: false
  }
};
