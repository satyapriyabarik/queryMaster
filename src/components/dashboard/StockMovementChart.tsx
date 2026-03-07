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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const MAX_ITEMS = 8; // avoid clutter

export default function StockMovementChart() {
  const isDark = document.body.dataset.theme === "dark";

  const gridColor = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.05)";

  const { data, loading, error } =
    useQuery<GetInventoryResult>(GET_INVENTORY);

  const chartData = useMemo(() => {
    const inventory = data?.inventory || [];
    const sorted = [...inventory]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, MAX_ITEMS);

    return {
      labels: sorted.map(item => item.name),
      datasets: [
        {
          label: "Stock Quantity",
          data: sorted.map(item => item.quantity),
          backgroundColor: "rgba(37, 99, 235, 0.7)", // classy blue
          borderRadius: 6
        }
      ]
    };
  }, [data]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (ctx: any) =>
              ` ${ctx.parsed.y} units`
          }
        }
      },

      scales: {
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 0
          },
          grid: {
            display: false,
            color: gridColor
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: gridColor
          }
        }
      }
    }),
    [gridColor]
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading chart</p>;

  return (
    <div>
      <h6 className="fw-semibold mb-3">
        Stock Movement (Top Items)
      </h6>

      <div style={{ height: 299 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
