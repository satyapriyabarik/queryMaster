import { Card } from "react-bootstrap";

interface Props {
  title: string;
  items: { id: string; label: string }[];
  color: string;
  onClick?: () => void;
}

const AttentionCard: React.FC<Props> = ({
  title,
  items,
  color,
  onClick
}) => {
  if (!items.length) return null;

  return (
    <Card
      className="shadow-sm border-2 h-100"
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      <Card.Body>
        <h6 style={{ color }}>{title}</h6>
        <ul className="mb-0 ps-3 small">
          {items.slice(0, 5).map(item => (
            <li key={item.id}>{item.label}</li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
};

export default AttentionCard;
