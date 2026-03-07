import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useQuery } from "@apollo/client/react";
import {
  INVENTORY_STATUS_CONFIG
} from "../../config/inventoryStatus.config";
import {
  NEAR_EXPIRY,
  LOW_STOCK,
  OUT_OF_STOCK,
  OVER_STOCKED,
  GET_INVENTORY,
  EXPIRED_ITEMS
} from "../../graphql/queries";

import {
  ExpiredItemsResult,
  GetInventoryResult,
  LowStockResult,
  NearExpiryResult,
  OutOfStockResult,
  OverStockedResult
} from "../../types/inventory";

import { InventoryTable } from "../inventory/InventoryTable";
import KpiTile from "../dashboard/KpiTile";
import AttentionCard from "../dashboard/AttentionCard";
import StockStatusChart from "../dashboard/StockStatusChart";
import StockMovementChart from "../dashboard/StockMovementChart";

import { AlertTriangle, Clock, Package, XCircleIcon } from "lucide-react";
import { formatDate } from "../../utils/date";

/* Icon map (UI concern only) */
const ICON_MAP: Record<string, JSX.Element> = {
  Clock: <Clock size={18} />,
  AlertTriangle: <AlertTriangle size={18} />,
  XCircleIcon: <XCircleIcon size={18} />
};


const Home: React.FC = () => {
  const { data: inventoryData } =
    useQuery<GetInventoryResult>(GET_INVENTORY);

  const { data: nearExpiryData } =
    useQuery<NearExpiryResult>(NEAR_EXPIRY, {
      variables: { days: 5 }
    });

  const { data: lowStockData } =
    useQuery<LowStockResult>(LOW_STOCK);

  const { data: outOfStockData } =
    useQuery<OutOfStockResult>(OUT_OF_STOCK);

  const { data: overStockedData } =
    useQuery<OverStockedResult>(OVER_STOCKED);
  const { data: expiredData } =
    useQuery<ExpiredItemsResult>(EXPIRED_ITEMS);

  const inventory = inventoryData?.inventory ?? [];

  return (
    <div className="container my-4">
      {/* ================= KPI ROW ================= */}
      <Row className="g-3 mb-4">
        <Col>
          <KpiTile
            value={inventory.length}
            label="Total Items"
            color={INVENTORY_STATUS_CONFIG.AVAILABLE.color}
            icon={<Package size={18} />}
          />
        </Col>
        <Col>
          <KpiTile
            value={expiredData?.expiredItems.length ?? 0}
            label={INVENTORY_STATUS_CONFIG.EXPIRED.homeTitle!}
            color={INVENTORY_STATUS_CONFIG.EXPIRED.color}
            icon={ICON_MAP[INVENTORY_STATUS_CONFIG.EXPIRED.homeIcon!]}
            backgoundColor={INVENTORY_STATUS_CONFIG.EXPIRED.backgoundColor}
            tooltipItems={(expiredData?.expiredItems ?? []).map(i => ({
              id: i.id,
              label: `${i.name} - expired on: ${formatDate(i.expiryDate)}`
            }))}
          />
        </Col>

        <Col>
          <KpiTile
            value={nearExpiryData?.nearExpiry.length ?? 0}
            label={INVENTORY_STATUS_CONFIG.NEAR_EXPIRY.homeTitle!}
            color={INVENTORY_STATUS_CONFIG.NEAR_EXPIRY.color}
            icon={ICON_MAP[INVENTORY_STATUS_CONFIG.NEAR_EXPIRY.homeIcon!]}
            tooltipItems={(nearExpiryData?.nearExpiry ?? []).map(i => ({
              id: i.id,
              label: `${i.name} - expires on: ${formatDate(i.expiryDate)}`
            }))}
          />
        </Col>

        <Col>
          <KpiTile
            value={lowStockData?.lowStock.length ?? 0}
            label={INVENTORY_STATUS_CONFIG.LOW_STOCK.homeTitle!}
            color={INVENTORY_STATUS_CONFIG.LOW_STOCK.color}
            icon={ICON_MAP[INVENTORY_STATUS_CONFIG.LOW_STOCK.homeIcon!]}
            tooltipItems={(lowStockData?.lowStock ?? []).map(i => ({
              id: i.id,
              label: `${i.name} - only ${i.quantity} left`
            }))}
          />

        </Col>

        <Col>
          <KpiTile
            value={outOfStockData?.outOfStock.length ?? 0}
            label={INVENTORY_STATUS_CONFIG.OUT_OF_STOCK.homeTitle!}
            color={INVENTORY_STATUS_CONFIG.OUT_OF_STOCK.color}
            icon={ICON_MAP[INVENTORY_STATUS_CONFIG.OUT_OF_STOCK.homeIcon!]}
            tooltipItems={(outOfStockData?.outOfStock ?? []).map(i => ({
              id: i.id,
              label: `${i.name} - out of stock`
            }))}
          />

        </Col>
      </Row>


      {/* ================= INVENTORY TABLE ================= */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <InventoryTable />
        </Card.Body>
      </Card>

      {/* ================= ATTENTION / INSIGHTS ================= */}
      <Row className="g-3 mb-4">

        {/* ❌ EXPIRED */}
        <Col md={6}>
          <AttentionCard
            title={INVENTORY_STATUS_CONFIG.EXPIRED.homeTitle!}
            color={INVENTORY_STATUS_CONFIG.EXPIRED.color}
            items={(inventoryData?.inventory ?? [])
              .filter(i => new Date(i.expiryDate) < new Date())
              .map(i => ({
                id: i.id,
                label: `${i.name} - expired on ${i.expiryDate}`
              }))
            }
          />
        </Col>

        {/* ⏰ NEAR EXPIRY */}
        <Col md={6}>
          <AttentionCard
            title={INVENTORY_STATUS_CONFIG.NEAR_EXPIRY.homeTitle!}
            color={INVENTORY_STATUS_CONFIG.NEAR_EXPIRY.color}
            items={(nearExpiryData?.nearExpiry ?? []).map(i => ({
              id: i.id,
              label: `${i.name} - expires on ${i.expiryDate}`
            }))}
          />
        </Col>

        {/* ⚠️ LOW STOCK */}
        <Col md={6}>
          <AttentionCard
            title={INVENTORY_STATUS_CONFIG.LOW_STOCK.homeTitle!}
            color={INVENTORY_STATUS_CONFIG.LOW_STOCK.color}
            items={(lowStockData?.lowStock ?? []).map(i => ({
              id: i.id,
              label: `${i.name} - only ${i.quantity} left`
            }))}
          />
        </Col>

        {/* 🚨 OUT OF STOCK */}
        <Col md={6}>
          <AttentionCard
            title={INVENTORY_STATUS_CONFIG.OUT_OF_STOCK.homeTitle!}
            color={INVENTORY_STATUS_CONFIG.OUT_OF_STOCK.color}
            items={(outOfStockData?.outOfStock ?? []).map(i => ({
              id: i.id,
              label: `${i.name} - out of stock`
            }))}
          />
        </Col>

        {/* 📦 OVER STOCKED */}
        <Col md={6}>
          <AttentionCard
            title="Overstock Insights"
            color="#0284c7"
            items={(overStockedData?.overStocked ?? []).map(i => ({
              id: i.id,
              label: `${i.name} - ${i.quantity} units`
            }))}
          />
        </Col>

      </Row>
      {/* ================= CHARTS ================= */}
      <Row className="g-3">
        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <StockStatusChart />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <StockMovementChart />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;

