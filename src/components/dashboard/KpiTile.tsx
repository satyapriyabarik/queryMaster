// import { Card } from "react-bootstrap";

// interface Props {
//   value: number | string;
//   label: string;
//   color: string;
//   icon?: React.ReactNode;
// }

// const KpiTile: React.FC<Props> = ({ value, label, color, icon }) => {
//   return (
//     <Card className="shadow-sm border-2 h-100">
//       <Card.Body className="d-flex justify-content-between align-items-center">
//         <div>
//           <div style={{ fontSize: 28, fontWeight: 600 }}>{value}</div>
//           <div className="text-shadow small">{label}</div>
//         </div>
//         <div
//           style={{
//             width: 40,
//             height: 40,
//             borderRadius: "50%",
//             backgroundColor: color,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             color: "#fff"
//           }}
//         >
//           {icon}
//         </div>
//       </Card.Body>
//     </Card>
//   );
// };

// export default KpiTile;
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";

interface TooltipItem {
  id: string;
  label: string;
}

interface Props {
  value: number | string;
  label: string;
  color: string;
  icon?: React.ReactNode;
  backgoundColor?: string;
  tooltipItems?: TooltipItem[]; // 🔥 NEW
}

const KpiTile: React.FC<Props> = ({
  value,
  label,
  color,
  icon,
  tooltipItems = []
}) => {
  const hasTooltip = tooltipItems.length > 0;

  const renderTooltip = (props: any) => (
    <Tooltip {...props}>
      <div className="fw-semibold mb-1">{label}</div>
      <ul className="mb-0 ps-3">
        {tooltipItems.slice(0, 6).map(item => (
          <li key={item.id}>{item.label}</li>
        ))}
      </ul>
    </Tooltip>
  );

  const tile = (
    <Card className="shadow-sm border-0 h-100 kpi-tile">
      <Card.Body className="d-flex justify-content-between align-items-center">
        <div>
          <div className="fs-4 fw-bold">{value}</div>
          <div className="text-muted small">{label}</div>
        </div>

        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: `${color}20`,
            color
          }}
        >
          {icon}
        </div>
      </Card.Body>
    </Card>
  );

  return hasTooltip ? (
    <OverlayTrigger
      placement="bottom"
      overlay={renderTooltip}
      delay={{ show: 300, hide: 150 }}
    >
      <div style={{ cursor: "pointer"}}>{tile}</div>
    </OverlayTrigger>
  ) : (
    tile
  );
};

export default KpiTile;
