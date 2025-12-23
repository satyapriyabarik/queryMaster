import { InventoryItem } from "../types/inventory";

export function useExpiryLogic(items: InventoryItem[]) {
  const today = new Date();

  return items.map(item => {
    const daysLeft =
      (new Date(item.expiryDate).getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24);

    return {
      ...item,
      status:
        daysLeft < 0
          ? "EXPIRED"
          : daysLeft <= 3
          ? "CRITICAL"
          : daysLeft <= 7
          ? "NEAR_EXPIRY"
          : "SAFE",
    };
  });
}
