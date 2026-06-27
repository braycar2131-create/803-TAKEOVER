"use client";

import { useCart } from "../../context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart();

  return (
    <>
      <div className={isOpen ? "cart-overlay open" : "cart-overlay"} onClick={closeCart} />

      <aside className={isOpen ? "cart-drawer open" : "cart-drawer"}>
        <button className="cart-close" type="button" onClick={closeCart}>✕</button>
        <h2>YOUR CART</h2>

        {items.length === 0 ? (
          <p className="cart-empty">Your cart is empty.</p>
        ) : (
          <>
            <div className="drawer-items">
              {items.map((item) => (
                <div className="drawer-item" key={`${item.slug}-${item.size}`}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>SIZE: {item.size}</p>
                    <strong>{item.displayPrice}</strong>

                    <div className="drawer-qty">
                      <button type="button" onClick={() => updateQuantity(item.slug, item.size, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.slug, item.size, item.quantity + 1)}>+</button>
                    </div>

                    <button className="drawer-remove" type="button" onClick={() => removeItem(item.slug, item.size)}>
                      REMOVE
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="drawer-total">
              <span>SUBTOTAL</span>
              <strong>${subtotal}</strong>
            </div>

            <a className="drawer-checkout" href="/checkout" onClick={closeCart}>CHECKOUT</a>
          </>
        )}
      </aside>
    </>
  );
}
