1. High-Level Frontend Architecture (React)
src/
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│
├── components/
│   ├── dashboard/
│   │   ├── KPIOverview.tsx
│   │   ├── NearExpiryList.tsx
│   │   ├── StockStatusChart.tsx
│   │   └── StockMovementChart.tsx
│   │
│   ├── inventory/
│   │   ├── InventoryTable.tsx
│   │   ├── AddInventoryForm.tsx
│   │   ├── EditInventoryModal.tsx
│   │   └── WasteEntryForm.tsx
│   │
│   ├── alerts/
│   │   ├── ExpiryAlerts.tsx
│   │   └── LowStockAlerts.tsx
│   │
│   └── common/
│       ├── Table.tsx
│       ├── Badge.tsx
│       └── Loader.tsx
│
├── context/
│   ├── InventoryContext.tsx
│   └── NotificationContext.tsx
│
├── hooks/
│   ├── useInventory.ts
│   ├── useExpiryLogic.ts
│   └── useReorderSuggestion.ts
│
├── services/
│   ├── inventory.service.ts
│   └── pos.service.ts
│
├── utils/
│   ├── fefo.ts
│   ├── date.ts
│   └── constants.ts
│
└── types/
    └── inventory.ts

1. High-Level Flow (Business View)
Inventory Change
   ↓
Low Stock Detection
   ↓
Alert Event Created
   ↓
Notification Service
   ↓
SMS Gateway
   ↓
Store Manager / Vendor


🏗️ 2. System Architecture (Technical View)
React App
  │
  │ (Mutation / POS Update)
  ▼
GraphQL API (Node.js)
  │
  │ Stock Threshold Check
  ▼
Event Bus (Async)
  │
  ├── Email Worker
  ├── SMS Worker  
  └── Push Worker

  QueryBuilder
 ├─ RuleGroup
 │   ├─ Rule
 │   └─ RuleGroup (nested)