import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { useQuery } from "@apollo/client/react";
import { GET_INVENTORY } from "../../graphql/queries";
import { GetInventoryResult } from "../../types/inventory";
import { getInventoryStatus } from "../../utils/inventoryStatus";
import {
  INVENTORY_STATUS_CONFIG,
  InventoryStatus
} from "../../config/inventoryStatus.config";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const MAX_ITEMS = 15;

/* =======================
   Component
   ======================= */

export default function StockStatusChart() {
  const { data, loading, error } =
    useQuery<GetInventoryResult>(GET_INVENTORY);

  const inventory = data?.inventory ?? [];

  /* =======================
     Chart data
     ======================= */
  const chartData = useMemo(() => {
    const topItems = [...inventory]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, MAX_ITEMS);

    return {
      labels: topItems.map(item => item.name),
      datasets: [
        {
          label: "Quantity",
          data: topItems.map(item => item.quantity),
          backgroundColor: topItems.map(item => {
            const status = getInventoryStatus(
              item.quantity,
              item.expiryDate,
              item.minStockLevel
            );
            return INVENTORY_STATUS_CONFIG[status].color;
          }),
          borderRadius: 6
        }
      ]
    };
  }, [inventory]);

  const options = useMemo(
    () => ({
      indexAxis: "y" as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) =>
              ` ${ctx.parsed.x} units`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: "rgba(0,0,0,0.05)"
          }
        },
        y: {
          grid: { display: false }
        }
      }
    }),
    []
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading chart</p>;

  /* =======================
     Legend entries
     ======================= */
  const legendStatuses: InventoryStatus[] = [
    "OUT_OF_STOCK",
    "NEAR_EXPIRY",
    "LOW_STOCK",
    "EXPIRED",
    "NORMAL"
  ];

  return (
    <div>
      <h6 className="fw-semibold mb-3">
        Stock Status Overview
      </h6>

      {/* ===== Chart ===== */}
      <div style={{ height: 260 }}>
        <Bar data={chartData} options={options} />
      </div>

      {/* ===== Custom Legend ===== */}
      <div className="d-flex flex-wrap gap-3 mt-3">
        {legendStatuses.map(status => {
          const cfg = INVENTORY_STATUS_CONFIG[status];
          return (
            <div
              key={status}
              className="d-flex align-items-center gap-2"
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: cfg.color,
                  display: "inline-block"
                }}
              />
              <span className="small text-shadow">
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
