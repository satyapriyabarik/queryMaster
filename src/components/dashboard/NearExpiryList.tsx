import { useMutation, useQuery } from "@apollo/client/react";
import { NEAR_EXPIRY } from "../../graphql/queries";
import { NOTIFY_ITEM } from "../../graphql/mutations";
import { Button, Spinner, Alert, Table } from "react-bootstrap";

/* =======================
   Types
   ======================= */

interface NearExpiryItem {
  id: string;
  name: string;
  expiryDate: string;
}

interface NearExpiryResult {
  nearExpiry: NearExpiryItem[];
}

interface NotifyItemResult {
  notifyItem: boolean;
}

interface NotifyItemVariables {
  id: string;
  type: string;
}

/* =======================
   Helpers
   ======================= */

const formatDate = (value?: string) => {
  if (!value) return "—";
  const normalized = value.replace(" ", "T");
  const date = new Date(normalized);
  return isNaN(date.getTime())
    ? value
    : date.toLocaleDateString();
};

/* =======================
   Component
   ======================= */

export const NearExpiryList = () => {
  const { data, loading, error } =
    useQuery<NearExpiryResult>(NEAR_EXPIRY, {
      variables: { days: 5 }
    });

  const [notifyItem, { loading: notifyLoading }] =
    useMutation<NotifyItemResult, NotifyItemVariables>(NOTIFY_ITEM);

  const handleNotify = async (itemId: string) => {
    try {
      await notifyItem({
        variables: {
          id: itemId,
          type: "NEAR_EXPIRY"
        }
      });
      alert("Email sent successfully");
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <Spinner animation="border" />;
  if (error || !data)
    return <Alert variant="danger">Failed to load data</Alert>;

  return (
    <div className="container mt-3">
      <h4 className="mb-3">Near Expiry Items</h4>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Expiry Date</th>
            <th className="text-end">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.nearExpiry.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center text-muted">
                No items nearing expiry
              </td>
            </tr>
          ) : (
            data.nearExpiry.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{formatDate(item.expiryDate)}</td>
                <td className="text-end">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={notifyLoading}
                    onClick={() => handleNotify(item.id)}
                  >
                    Notify
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};
