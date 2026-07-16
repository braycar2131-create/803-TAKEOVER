import type { Metadata } from "next";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import "./admin.css";

export const metadata: Metadata = {
  title: "803 TAKEOVER Admin",
  description:
    "803 TAKEOVER store management dashboard",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-shell">
      <Sidebar />

      <div className="admin-main">
        <Topbar />

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}