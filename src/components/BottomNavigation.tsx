import { Home, Mic, HelpCircle, Eye } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/assist", label: "Assist", icon: Mic },
  { to: "/how-it-works", label: "How It Works", icon: HelpCircle },
  { to: "/accessibility", label: "Accessibility", icon: Eye },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-[100] h-16 bg-white border-t border-gray-200 dark:bg-gray-950 dark:border-gray-800"
    >
      <ul className="flex w-full h-full">
        {navItems.map((item) => {
          const isActive =
            item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
          const IconComponent = item.icon;

          return (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                aria-current={isActive ? "page" : undefined}
                className={`nav-item ${isActive ? "nav-item-active" : ""}`}
              >
                <IconComponent
                  className="nav-item-icon"
                  aria-hidden="true"
                  strokeWidth={1.75}
                  fill={isActive ? "currentColor" : "none"}
                />
                <span className="nav-item-label">{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
