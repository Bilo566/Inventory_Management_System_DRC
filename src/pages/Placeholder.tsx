import { Link } from "react-router-dom";
import { Hammer } from "lucide-react";

interface PlaceholderProps {
  title: string;
  /** What this page will do once it's built. */
  description: string;
  /** Admin pages already sit inside a .page, so they don't need another one. */
  bare?: boolean;
}

/** Stand-in for screens that are routed but not built yet. */
export default function Placeholder({ title, description, bare = false }: PlaceholderProps) {
  const content = (
    <>
      <header className="page-header">
        <div className="page-header__text"><h1>{title}</h1></div>
      </header>
      <section className="panel panel--banner">
        <span className="panel__icon"><Hammer size={26} aria-hidden="true" /></span>
        <div>
          <h3>Coming soon</h3>
          <p>{description}</p>
        </div>
      </section>
    </>
  );
  return bare ? content : <main className="page">{content}</main>;
}

export function NotFound() {
  return (
    <main className="page">
      <div className="card">
        <div className="empty-state">
          <h3>Page not found</h3>
          <p>This link doesn't match any page in the inventory.</p>
          <Link className="btn mt-2" to="/">Go to home</Link>
        </div>
      </div>
    </main>
  );
}
