"use client";

import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <main className="cart-page">
      <section className="cart-hero"><span>803 TAKEOVER</span><h1>YOUR CART</h1><p>Review your selected Drop 001 pieces.</p></section>
      <section className="cart-box">
        {items.length === 0 ? (
          <><h2>CART IS EMPTY</h2><p>Add pieces from the shop to start building your drop.</p><a href="/shop">SHOP NOW</a></>
        ) : (
          <>
            {items.map((item) => (
              <div className="cart-item" key={`${item.slug}-${item.size}`}>
                <img src={item.image} alt={item.name} />
                <div>
                  <h3>{item.name}</h3><p>SIZE: {item.size}</p><p>{item.displayPrice}</p>
                  <div className="drawer-qty"><button type="button" onClick={() => updateQuantity(item.slug, item.size, item.quantity - 1)}>-</button><span>{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.slug, item.size, item.quantity + 1)}>+</button></div>
                  <button className="remove-cart-button" type="button" onClick={() => removeItem(item.slug, item.size)}>REMOVE</button>
                </div>
              </div>
            ))}
            <div className="cart-total"><span>SUBTOTAL</span><strong>${subtotal}</strong></div>
            <a className="checkout-button" href="/checkout">CHECKOUT</a>
          </>
        )}
      </section>
    </main>
  );
}
