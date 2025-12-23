
import { InventoryStatus } from "../config/inventoryStatus.config";

export function getInventoryStatus(
  quantity: number,
  expiryDate?: string,
  minStockLevel?: number,
): InventoryStatus {
  const today = new Date();
  const expiry = expiryDate ? new Date(expiryDate) : null;

  if (expiry && expiry < today) {
    return "EXPIRED";
  }

  if (expiry) {
    const diffDays =
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays >= 0 && diffDays <= 5) {
      return "NEAR_EXPIRY";
    }
  }

  if (quantity === 0) {
    return "OUT_OF_STOCK";
  }

  // 🔥 THIS WAS MISSING
  if (
    typeof minStockLevel === "number" &&
    quantity > 0 &&
    quantity <= minStockLevel
  ) {
    return "LOW_STOCK";
  }

  return "NORMAL";
}
