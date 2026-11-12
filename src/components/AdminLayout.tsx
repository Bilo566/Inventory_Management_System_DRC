import { NavLink, Outlet } from "react-router-dom";
import { ArrowLeft, ClipboardCheck, LayoutDashboard, PackageSearch } from "lucide-react";

interface AdminLayoutProps {
  /** Requests waiting for approval, shown as a count next to "Orders". */
  pendingCount: number;
}

/** Admin pages: sidebar on the left (a scrolling tab row on phones), page on the right. */
export default function AdminLayout({ pendingCount }: AdminLayoutProps) {
  const link = ({ isActive }: { isActive: boolean }) => (isActive ? "nav-link is-active" : "nav-link");

  return (
    <div className="app-layout">
      <nav className="sidebar" aria-label="Admin">
        <span className="sidebar__label">Admin</span>
        <NavLink className={link} to="/admin" end><LayoutDashboard size={18} aria-hidden="true" />Dashboard</NavLink>
        <NavLink className={link} to="/admin/availability"><PackageSearch size={18} aria-hidden="true" />Availability</NavLink>
        <NavLink className={link} to="/admin/orders">
          <ClipboardCheck size={18} aria-hidden="true" />Orders
          {pendingCount > 0 && <span className="nav-link__count" aria-label={`${pendingCount} waiting`}>{pendingCount}</span>}
        </NavLink>
        <span className="sidebar__spacer" />
        <NavLink className="nav-link" to="/"><ArrowLeft size={18} aria-hidden="true" />Back to inventory</NavLink>
      </nav>

      <div className="page page--with-sidebar">
        <Outlet />
      </div>
    </div>
  );
}
