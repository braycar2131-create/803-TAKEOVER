"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigation = [
  {
    href: "/admin",
    label: "DASHBOARD",
    exact: true,
  },
  {
    href: "/admin/orders",
    label: "ORDERS",
  },
  {
    href: "/admin/products",
    label: "PRODUCTS",
  },
  {
    href: "/admin/inventory",
    label: "INVENTORY",
  },
  {
    href: "/admin/media",
    label: "MEDIA",
  },
  {
    href: "/admin/customers",
    label: "CUSTOMERS",
  },
  {
    href: "/admin/analytics",
    label: "ANALYTICS",
  },
  {
    href: "/admin/search",
    label: "SEARCH",
  },
  {
    href: "/admin/settings",
    label: "SETTINGS",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] =
    useState(false);

  function isActive(
    href: string,
    exact?: boolean
  ) {
    if (exact) {
      return pathname === href;
    }

    return pathname.startsWith(href);
  }

  function closeMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="admin-mobile-menu"
        aria-label="Toggle admin menu"
        aria-expanded={mobileOpen}
        onClick={() =>
          setMobileOpen((current) => !current)
        }
      >
        <span />
        <span />
        <span />
      </button>

      <button
        type="button"
        aria-label="Close admin menu"
        className={
          mobileOpen
            ? "admin-sidebar-overlay admin-sidebar-overlay--open"
            : "admin-sidebar-overlay"
        }
        onClick={closeMenu}
      />

      <aside
        className={
          mobileOpen
            ? "admin-sidebar admin-sidebar--open"
            : "admin-sidebar"
        }
      >
        <Link
          href="/admin"
          className="admin-brand"
          onClick={closeMenu}
        >
          <span>803</span>
          <strong>TAKEOVER</strong>
          <small>ADMIN CONTROL</small>
        </Link>

        <nav className="admin-navigation">
          <span className="admin-navigation-label">
            MANAGEMENT
          </span>

          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={
                isActive(item.href, item.exact)
                  ? "admin-nav-link admin-nav-link--active"
                  : "admin-nav-link"
              }
            >
              <i aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div>
            <span>STORE STATUS</span>

            <strong>
              <i aria-hidden="true" />
              ONLINE
            </strong>
          </div>

          <Link href="/" onClick={closeMenu}>
            VIEW STOREFRONT ↗
          </Link>
        </div>
      </aside>
    </>
  );
}