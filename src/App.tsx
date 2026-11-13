import { useState, type ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import type { BorrowRecord, ComponentItem } from "./types/inventory";
import { currentMember, sampleBorrows, sampleItems, sampleMembers, sampleStockCounts, sampleUnits } from "./data/sampleData";
import AppShell from "./components/AppShell";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/Home";
import Category from "./pages/Category";
import ItemDetail from "./pages/ItemDetail";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import Placeholder, { NotFound } from "./pages/Placeholder";
import type { BorrowRequest } from "./components/BorrowDialog";
import type { ReturnRequest } from "./components/ReturnDialog";

/* All page addresses live here.
   Data comes from src/data/sampleData.ts for now and is kept in memory, so a full page reload resets it.
   When Supabase is ready, swap the useState calls below for real queries. */

const isActive = (b: BorrowRecord) => b.status === "borrowed" || b.status === "overdue";

export default function App() {
  const [items, setItems] = useState<ComponentItem[]>(sampleItems);
  const [borrows, setBorrows] = useState<BorrowRecord[]>(sampleBorrows);
  const member = currentMember;
  const pendingCount = borrows.filter(b => b.status === "pending").length;

  const changeQuantity = (componentId: string, delta: number) =>
    setItems(prev => prev.map(i => (i.id === componentId ? { ...i, quantity: i.quantity + delta } : i)));

  function borrow(item: ComponentItem, req: BorrowRequest) {
    const needsApproval = !!item.requiresApproval;
    setBorrows(prev => [...prev, {
      id: `b-${Date.now()}`,
      componentId: req.componentId,
      borrowerId: member.id,
      quantity: req.quantity,
      borrowedAt: new Date().toISOString(),
      dueAt: new Date(`${req.dueDate}T17:00:00`).toISOString(),
      status: needsApproval ? "pending" : "borrowed",
    }]);
    // Stock only goes down once the borrow is actually handed out.
    if (!needsApproval) changeQuantity(req.componentId, -req.quantity);
  }

  function giveBack(req: ReturnRequest) {
    const record = borrows.find(b => b.id === req.borrowId);
    if (!record) throw new Error("This borrow wasn't found. Refresh and try again.");
    const left = record.quantity - req.quantity;
    setBorrows(prev => prev.map(b => b.id !== req.borrowId ? b
      : left > 0 ? { ...b, quantity: left }                                  // partial return
      : { ...b, status: "returned", returnedAt: new Date().toISOString() }));
    // Damaged or incomplete items don't go back on the shelf until a manager checks them.
    if (req.condition === "good") changeQuantity(record.componentId, req.quantity);
  }

  /** Manager approves a request: it becomes a normal borrow and leaves stock. */
  function approve(borrowId: string) {
    const record = borrows.find(b => b.id === borrowId);
    if (!record) return;
    setBorrows(prev => prev.map(b => (b.id === borrowId ? { ...b, status: "borrowed", borrowedAt: new Date().toISOString() } : b)));
    changeQuantity(record.componentId, -record.quantity);
  }

  function reject(borrowId: string) {
    setBorrows(prev => prev.map(b => (b.id === borrowId ? { ...b, status: "rejected" } : b)));
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell member={member} />}>
          {/* Member 1 — find and borrow */}
          <Route index element={<Home items={items} memberName={member.name.split(" ")[0]} />} />
          <Route path="category/:name" element={<CategoryRoute items={items} />} />
          <Route path="items/:id" element={
            <ItemRoute items={items} borrows={borrows} memberId={member.id} onBorrow={borrow} onReturn={giveBack} />
          } />

          {/* Member 2 — profile and reports (part orders were dropped: the lead handles those) */}
          <Route path="profile" element={<Profile member={member} items={items} borrows={borrows} onReturn={giveBack} />} />
          <Route path="report" element={<Placeholder title="Report damage or loss" description="Tell the committee what happened, with a photo." />} />

          {/* Member 2 — admin (managers and admins only) */}
          <Route path="admin" element={<RequireManager allowed={member.role !== "member"}><AdminLayout pendingCount={pendingCount} /></RequireManager>}>
            <Route index element={<AdminDashboard items={items} borrows={borrows} members={sampleMembers} units={sampleUnits} stockCounts={sampleStockCounts} />} />
            <Route path="availability" element={<Placeholder bare title="Availability" description="The full catalog with a High / Medium / Low stock filter." />} />
            <Route path="orders" element={<AdminOrders items={items} borrows={borrows} members={sampleMembers} onApprove={approve} onReject={reject} />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

/* ---- Small route helpers: read the address, then hand the right data to the page ---- */

function CategoryRoute({ items }: { items: ComponentItem[] }) {
  const { name = "" } = useParams();
  return <Category category={name} items={items} />;
}

interface ItemRouteProps {
  items: ComponentItem[];
  borrows: BorrowRecord[];
  memberId: string;
  onBorrow: (item: ComponentItem, req: BorrowRequest) => void;
  onReturn: (req: ReturnRequest) => void;
}

function ItemRoute({ items, borrows, memberId, onBorrow, onReturn }: ItemRouteProps) {
  const { id } = useParams();
  const item = items.find(i => i.id === id);
  if (!item) return <NotFound />;

  const loans = borrows.filter(b => b.componentId === item.id && isActive(b));
  return (
    <ItemDetail
      item={item}
      activeLoans={loans.map(b => ({ quantity: b.quantity, dueAt: b.dueAt }))}
      myBorrow={loans.find(b => b.borrowerId === memberId)}
      onBorrow={req => onBorrow(item, req)}
      onReturn={onReturn}
    />
  );
}

/** Hides admin pages from regular members. This is only for the screen —
 *  real protection must come from Supabase row-level security (Backend). */
function RequireManager({ allowed, children }: { allowed: boolean; children: ReactNode }) {
  return allowed ? <>{children}</> : <Navigate to="/" replace />;
}
