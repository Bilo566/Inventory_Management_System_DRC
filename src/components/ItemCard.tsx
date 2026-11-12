import { MapPin, Package } from "lucide-react";
import type { ComponentItem } from "../types/inventory";
import StockBadge from "./StockBadge";

interface ItemCardProps {
  item: ComponentItem;
  /** Link to the item's detail page. */
  href?: string;
  /** Photo of the item. Falls back to an icon when missing. */
  imageUrl?: string;
}

export default function ItemCard({ item, href, imageUrl }: ItemCardProps) {
  const content = (
    <>
      <div className="item-card__media">
        {imageUrl
          ? <img src={imageUrl} alt="" loading="lazy" />
          : <Package size={48} aria-hidden="true" />}
      </div>
      <div className="item-card__body">
        <span className="item-card__name">{item.name}</span>
        <div className="item-card__meta">
          <span className="location"><MapPin size={12} aria-hidden="true" />{item.location}</span>
          <StockBadge quantity={item.quantity} minimumStock={item.minimumStock} showCount />
        </div>
      </div>
    </>
  );

  return href
    ? <a className="item-card" href={href} aria-label={`${item.name}, ${item.location}`}>{content}</a>
    : <article className="item-card">{content}</article>;
}