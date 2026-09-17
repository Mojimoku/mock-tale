import { NavLink } from "react-router-dom";
import { GlassIcon, MapPinIcon, PackageIcon } from "./icons";

const TABS = [
  { to: "/", label: "Restaurants", icon: MapPinIcon, end: true },
  { to: "/drinks", label: "Drinks", icon: GlassIcon, end: false },
  { to: "/pantry", label: "Pantry", icon: PackageIcon, end: false },
] as const;

/**
 * The app's top-level mode switch. Persists across drill-in screens
 * (restaurant detail) but is deliberately not rendered on modal-style flows
 * (the drink form) or pre-auth (login) — see App.tsx's route structure.
 */
export default function TabBar() {
  return (
    <nav className="nu-tabbar" aria-label="Primary">
      <div className="nu-tabbar-inner">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className="nu-tab">
            <span className="nu-tab-icon-wrap">
              <Icon className="h-5 w-5" />
            </span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
