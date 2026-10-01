"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  { href: "/admin", label: "DASHBOARD", exact: true },
  { href: "/admin/orders", label: "ORDERS" },
  { href: "/admin/customers", label: "CUSTOMERS" },
  { href: "/admin/analytics", label: "ANALYTICS" },
  { href: "/admin/products", label: "PRODUCTS" },
  { href: "/admin/inventory", label: "INVENTORY" },
  { href: "/admin/search", label: "SEARCH" },
  { href: "/admin/settings", label: "SETTINGS" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <>
      <button
        className="admin-mobile-menu"
        type="button"
        aria-label="Open admin navigation"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span />
        <span />
      </button>

      <div
        className={
          open
            ? "admin-sidebar-overlay admin-sidebar-overlay--open"
            : "admin-sidebar-overlay"
        }
        onClick={() => setOpen(false)}
      />

      <aside
        className={
          open ? "admin-sidebar admin-sidebar--open" : "admin-sidebar"
        }
      >
        <Link
          className="admin-brand"
          href="/admin"
          onClick={() => setOpen(false)}
        >
          <span>803</span>
          <strong>TAKEOVER</strong>
          <small>ADMIN CONTROL</small>
        </Link>

        <nav className="admin-navigation">
          <span className="admin-navigation-label">MANAGEMENT</span>

          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={
                isActive(item.href, item.exact)
                  ? "admin-nav-link admin-nav-link--active"
                  : "admin-nav-link"
              }
            >
              <i aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <span>STORE STATUS</span>
          <strong>
            <i aria-hidden="true" />
            ONLINE
          </strong>

          <Link href="/">VIEW STOREFRONT</Link>
        </div>
      </aside>
    </>
  );
}
