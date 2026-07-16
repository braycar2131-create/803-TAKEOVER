import { updateOrderFulfillmentAction } from "../../app/admin/orders/actions";

type FulfillmentFormProps = {
  orderId: string;
  orderStatus: string;
  trackingNumber: string | null;
  shippingCarrier: string | null;
};

export default function FulfillmentForm({
  orderId,
  orderStatus,
  trackingNumber,
  shippingCarrier,
}: FulfillmentFormProps) {
  const action = updateOrderFulfillmentAction.bind(null, orderId);

  return (
    <form className="admin-fulfillment-form" action={action}>
      <label>
        <span>ORDER STATUS</span>

        <select name="status" defaultValue={orderStatus}>
          <option value="PAID">PAID</option>
          <option value="PACKING">PACKING</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
          <option value="REFUNDED">REFUNDED</option>
        </select>
      </label>

      <label>
        <span>SHIPPING CARRIER</span>

        <input
          name="shippingCarrier"
          defaultValue={shippingCarrier ?? ""}
          placeholder="USPS, UPS, FEDEX"
        />
      </label>

      <label>
        <span>TRACKING NUMBER</span>

        <input
          name="trackingNumber"
          defaultValue={trackingNumber ?? ""}
          placeholder="ENTER TRACKING NUMBER"
        />
      </label>

      <button type="submit">UPDATE FULFILLMENT</button>
    </form>
  );
}
