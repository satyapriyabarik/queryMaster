/* ======================================================
   ENUMS (Single source of truth)
   ====================================================== */

export type InventoryCategory =
  | "MEAT"
  | "DAIRY"
  | "PRODUCE"
  | "BAKERY";

export type StorageLocation =
  | "FRIDGE"
  | "FREEZER"
  | "DRY";

export type InventoryUnit =
  | "kg"
  | "pcs"
  | "litre";

export type InventoryStatus =
  | "AVAILABLE"
  | "NEAR_EXPIRY"
  | "EXPIRED"
  | "OUT_OF_STOCK"
  | "LOW_STOCK"
  | "OVER_STOCKED";

export type NotifyType =
  | "LOW_STOCK"
  | "OUT_OF_STOCK"
  | "NEAR_EXPIRY"
  | "LOW_STOCK"
  | "EXPIRED";

/* ======================================================
   CORE INVENTORY TYPES
   ====================================================== */

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  unit: InventoryUnit;
  batchNo?: string;
  supplier?: string;

  purchaseDate?: string;
  manufactureDate?: string;
  expiryDate: string;

  storageLocation: StorageLocation;

  minStockLevel: number;
  maxStockLevel?: number;
  costPerUnit: number;
  notifyRemainingSeconds?: number;
}

/* ======================================================
   GRAPHQL QUERY RESULTS
   ====================================================== */

export interface GetInventoryResult {
  inventory: InventoryItem[];
}

export interface NearExpiryResult {
  nearExpiry: InventoryAlertItem[];
}

export interface ExpiredItemsResult {
  expiredItems: InventoryAlertItem[];
}

export interface LowStockResult {
  lowStock: InventoryAlertItem[];
}

export interface OutOfStockResult {
  outOfStock: InventoryAlertItem[];
}

export interface OverStockedResult {
  overStocked: InventoryAlertItem[];
}

/* ======================================================
   ALERT / STATUS ITEMS (Used in dashboard & grid)
   ====================================================== */

export interface InventoryAlertItem {
  id: string;
  name: string;
  quantity: number;
  expiryDate?: string;
  minStockLevel?: number;
  maxStockLevel?: number;
  status?: InventoryStatus;
}

/* ======================================================
   QUERY VARIABLES
   ====================================================== */

export interface NearExpiryVars {
  days: number;
}

export interface InventoryFilter {
  category?: InventoryCategory;
  supplier?: string;
  storageLocation?: StorageLocation;
  expiryDateBefore?: string;
}

/* ======================================================
   MUTATION INPUTS
   ====================================================== */

export interface NewInventoryItem {
  name: string;
  category: InventoryCategory;
  quantity: number;
  unit: InventoryUnit;
  batchNo: string;
  supplier: string;
  purchaseDate: string;
  manufactureDate?: string;
  expiryDate: string;
  storageLocation: StorageLocation;
  minStockLevel: number;
  maxStockLevel?: number;
  costPerUnit: number;
  lastNotifiedAt?: string | null; // 🔥 REQUIRED
  notifyCount?: number;
}

export interface UpdateInventoryItem {
  name?: string;
  category?: InventoryCategory;
  quantity?: number;
  unit?: InventoryUnit;
  batchNo?: string;
  supplier?: string;
  purchaseDate?: string;
  manufactureDate?: string;
  expiryDate?: string;
  storageLocation?: StorageLocation;
  minStockLevel?: number;
  maxStockLevel?: number;
  costPerUnit?: number;
}

/* ======================================================
   DASHBOARD / ANALYTICS
   ====================================================== */

export interface InventorySummary {
  totalItems: number;
  totalCategories: number;
  lowStockItems: InventoryItem[];
  expiredItems: InventoryItem[];
}

export interface InventoryStats {
  categoryCounts: Record<InventoryCategory, number>;
  totalValue: number;
}

export interface PaginatedInventoryItems {
  items: InventoryItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

/* ======================================================
   REPORTING & AUDIT
   ====================================================== */

export interface InventoryReport {
  generatedOn: string;
  generatedBy: string;
  items: InventoryItem[];
}

export interface InventoryAuditLog {
  logId: string;
  itemId: string;
  action: "CREATED" | "UPDATED" | "DELETED";
  timestamp: string;
  performedBy: string;
  details: string;
}

/* ======================================================
   SETTINGS & METADATA
   ====================================================== */

export interface InventorySettings {
  lowStockThreshold: number;
  expiryAlertDays: number;
  defaultStorageLocation: StorageLocation;
}

export interface SupplierInfo {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
}

export interface InventoryCategoryInfo {
  category: InventoryCategory;
  description: string;
}

export interface InventoryUnitInfo {
  unit: InventoryUnit;
  description: string;
}

/* ======================================================
   IMPORT / EXPORT
   ====================================================== */

export interface InventoryImportResult {
  successCount: number;
  failureCount: number;
  errors: string[];
}

export interface InventoryExportOptions {
  format: "CSV" | "PDF" | "EXCEL";
  includeExpiredItems: boolean;
  includeLowStockItems: boolean;
}
