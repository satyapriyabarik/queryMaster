import { gql } from "@apollo/client";

export const ADD_INVENTORY_ITEM = gql`
  mutation AddItem(
    $name: String!
    $category: String!
    $quantity: Int!
    $expiryDate: String!
    $storageLocation: String!
    $minStockLevel: Int!
    $maxStockLevel: Int!
    $costPerUnit: Float!
  ) {
    addItem(
      name: $name
      category: $category
      quantity: $quantity
      expiryDate: $expiryDate
      storageLocation: $storageLocation
      minStockLevel: $minStockLevel
      maxStockLevel: $maxStockLevel
      costPerUnit: $costPerUnit
    ) {
      id
      name
      quantity
    }
  }
`;
export const NOTIFY_ITEM = gql`
  mutation NotifyItem($id: ID!, $type: NotifyType!) {
    notifyItem(id: $id, type: $type)
  }
`;

/* =========================
   Raw SQL Execution
   ========================= */

export const EXECUTE_RAW_QUERY = gql`
  mutation ExecuteRawQuery($sql: String!) {
    executeRawQuery(sql: $sql)
  }
`;
export const SAVE_EXECUTED_QUERY = gql`
  mutation SaveExecutedQuery($sql: String!) {
    saveExecutedQuery(sql: $sql)
  }
`;
