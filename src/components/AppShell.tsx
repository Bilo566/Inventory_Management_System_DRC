import { Link, Outlet } from "react-router-dom";
import { ShieldCheck, UserRound } from "lucide-react";
import type { Member } from "../types/inventory";

interface AppShellProps {
  member: Member;
}

/** Frame around every page: blue top bar, page content, footer. */
export default function AppShell({ member }: AppShellProps) {
  const canManage = member.role !== "member";

  return (
    <div className="app">
      <header className="topbar">
        <Link className="topbar__brand" to="/">
          <img className="topbar__logo" src="/drc-logo-white.png" alt="Drones and Robotics Club" />
          <span className="topbar__title">Inventory</span>
        </Link>

        <div className="topbar__actions">
          {canManage && (
            <Link className="icon-btn icon-btn--on-primary" to="/admin" aria-label="Admin dashboard" title="Admin">
              <ShieldCheck size={18} aria-hidden="true" />
            </Link>
          )}
          <Link className="icon-btn icon-btn--on-primary" to="/profile" aria-label={`Your profile (${member.name})`} title="Profile">
            <UserRound size={18} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <Outlet />

      <footer className="footer">Drones &amp; Robotics Club · Inventory</footer>
    </div>
  );
}