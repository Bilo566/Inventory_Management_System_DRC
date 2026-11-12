import { Battery, Bot, Camera, Cable, Cog, Cpu, Package, Plane, Printer, Radio, Wrench, type LucideIcon } from "lucide-react";

/** Picks an icon from the category name. Unknown categories get a box icon. */
const iconRules: [RegExp, LucideIcon][] = [
  [/micro|controller|board|esp|arduino|pi\b|electronic/i, Cpu],
  [/sensor|radio|antenna|receiver|transmit/i, Radio],
  [/drone|quad|propeller|flight/i, Plane],
  [/robot|servo|arm/i, Bot],
  [/motor|gear|mechan/i, Cog],
  [/camera|media|video|photo/i, Camera],
  [/wire|cable|connector|jumper/i, Cable],
  [/batter|power|charger/i, Battery],
  [/3d|print|filament/i, Printer],
  [/tool|solder|kit/i, Wrench],
];

export function categoryIcon(category: string): LucideIcon {
  return iconRules.find(([pattern]) => pattern.test(category))?.[1] ?? Package;
}

interface CategoryTileProps {
  name: string;
  count: number;
  href: string;
}

export default function CategoryTile({ name, count, href }: CategoryTileProps) {
  const Icon = categoryIcon(name);
  return (
    <a className="category-tile" href={href}>
      <span className="category-tile__icon"><Icon size={26} aria-hidden="true" /></span>
      {name}
      <small>{count} {count === 1 ? "item" : "items"}</small>
    </a>
  );
}