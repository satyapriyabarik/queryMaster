// src/graphql/queries.ts
import { gql } from "@apollo/client";

/* =========================
   Inventory Queries
   ========================= */

export const GET_INVENTORY = gql`
  query {
    inventory {
      id
      name
      category
      quantity
      expiryDate
      storageLocation
      minStockLevel
      maxStockLevel
      costPerUnit
      lastNotifiedAt
      notifyCount
      notifyRemainingSeconds 
    }
  }
`;

export const NEAR_EXPIRY = gql`
  query NearExpiry($days: Int!) {
    nearExpiry(days: $days) {
      id
      name
      expiryDate
      quantity
    }
  }
`;

export const EXPIRED_ITEMS = gql`
  query {
    expiredItems {
      id
      name
      expiryDate
      quantity
    }
  }
`;

export const OUT_OF_STOCK = gql`
  query {
    outOfStock {
      id
      name
      quantity
    }
  }
`;

export const LOW_STOCK = gql`
  query {
    lowStock {
      id
      name
      quantity
      minStockLevel
    }
  }
`;

export const OVER_STOCKED = gql`
  query {
    overStocked {
      id
      name
      quantity
      maxStockLevel
    }
  }
`;

/* =========================
   Inventory Notifications
   ========================= */

export const NOTIFY_ITEM = gql`
  mutation NotifyItem($id: ID!, $type: NotifyType!) {
    notifyItem(id: $id, type: $type)
  }
`;

/* =========================
   Query Builder (AST)
   ========================= */

export const EXECUTE_QUERY = gql`
  query ExecuteQuery($rules: JSON!) {
    executeQuery(rules: $rules)
  }
`;

export const PREVIEW_QUERY = gql`
  query PreviewQuery($rules: JSON!) {
    previewQuery(rules: $rules)
  }
`;

/* =========================
   Query History (GRID)
   ========================= */

export const GET_SAVED_QUERIES = gql`
  query GetSavedQueries(
    $search: String
    $page: Int
    $limit: Int
    $sortBy: String
    $order: String
  ) {
    getSavedQueries(
      search: $search
      page: $page
      limit: $limit
      sortBy: $sortBy
      order: $order
    ) {
      id
      name
      sql_text
      created_at
    }
  }
`;

/* =========================
   Get Queryable Tables
   ========================= */

export const GET_QUERYABLE_TABLES = gql`
  query {
    getQueryableTables
  }
`;
