import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatAdminDate,
  formatMoney,
  getOrderById,
} from "../../../../lib/admin";

export const dynamic = "force-dynamic";

type OrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function valueOrFallback(value: string | null | undefined) {
  return value?.trim() || "NOT PROVIDED";
}

export default async function AdminOrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const totalQuantity = order.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <>
      <div className="admin-breadcrumb">
        <Link href="/admin">DASHBOARD</Link>
        <span>/</span>
        <Link href="/admin/orders">ORDERS</Link>
        <span>/</span>
        <strong>{order.id}</strong>
      </div>

      <section className="admin-order-hero">
        <div>
          <span>ORDER RECORD</span>
          <h1>{order.id}</h1>
          <p>Created {formatAdminDate(order.createdAt)}</p>
        </div>

        <div>
          <span
            className={`admin-status admin-status--${order.orderStatus.toLowerCase()}`}
          >
            {order.orderStatus}
          </span>

          <strong>{formatMoney(order.amountTotal, order.currency)}</strong>
        </div>
      </section>

      <div className="admin-order-layout">
        <div className="admin-order-primary">
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span>{totalQuantity} TOTAL UNITS</span>
                <h2>ORDER ITEMS</h2>
              </div>
            </div>

            <div className="admin-order-items">
              {order.items.map((item) => (
                <article key={item.id}>
                  <div className="admin-order-item-index">803</div>

                  <div>
                    <span>{item.productSlug}</span>
                    <h3>{item.productName}</h3>

                    <p>
                      SIZE <strong>{item.size}</strong>
                      <i />
                      QUANTITY <strong>{item.quantity}</strong>
                    </p>
                  </div>

                  <div>
                    <small>{formatMoney(item.unitAmount)}</small>
                    <strong>{formatMoney(item.lineTotal)}</strong>
                  </div>
                </article>
              ))}
            </div>

            <div className="admin-order-totals">
              <div>
                <span>SUBTOTAL</span>
                <strong>
                  {formatMoney(order.amountSubtotal, order.currency)}
                </strong>
              </div>

              <div>
                <span>TOTAL PAID</span>
                <strong>
                  {formatMoney(order.amountTotal, order.currency)}
                </strong>
              </div>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span>PAYMENT RECORD</span>
                <h2>STRIPE DETAILS</h2>
              </div>
            </div>

            <dl className="admin-detail-list">
              <div>
                <dt>PAYMENT STATUS</dt>
                <dd>{order.paymentStatus}</dd>
              </div>

              <div>
                <dt>CHECKOUT SESSION</dt>
                <dd>{order.stripeSessionId}</dd>
              </div>

              <div>
                <dt>PAYMENT INTENT</dt>
                <dd>{valueOrFallback(order.stripePaymentIntentId)}</dd>
              </div>

              <div>
                <dt>CURRENCY</dt>
                <dd>{order.currency.toUpperCase()}</dd>
              </div>
            </dl>
          </section>
        </div>

        <aside className="admin-order-sidebar">
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span>BUYER</span>
                <h2>CUSTOMER</h2>
              </div>
            </div>

            <dl className="admin-detail-list">
              <div>
                <dt>NAME</dt>
                <dd>
                  {valueOrFallback(
                    order.customerName || order.shippingName
                  )}
                </dd>
              </div>

              <div>
                <dt>EMAIL</dt>
                <dd>{valueOrFallback(order.customerEmail)}</dd>
              </div>

              <div>
                <dt>PHONE</dt>
                <dd>{valueOrFallback(order.customerPhone)}</dd>
              </div>
            </dl>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span>FULFILLMENT</span>
                <h2>SHIPPING</h2>
              </div>
            </div>

            <address className="admin-address">
              <strong>{valueOrFallback(order.shippingName)}</strong>
              <span>{valueOrFallback(order.shippingLine1)}</span>

              {order.shippingLine2 ? (
                <span>{order.shippingLine2}</span>
              ) : null}

              <span>
                {[
                  order.shippingCity,
                  order.shippingState,
                  order.shippingPostalCode,
                ]
                  .filter(Boolean)
                  .join(", ") || "NOT PROVIDED"}
              </span>

              <span>
                {valueOrFallback(order.shippingCountry)}
              </span>
            </address>
          </section>

          <Link className="admin-back-button" href="/admin/orders">
            ← BACK TO ORDERS
          </Link>
        </aside>
      </div>
    </>
  );
}
