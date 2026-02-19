import { LayoutDashboard, MapPin, AlertTriangle, Users, Camera, Database } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Live Map", url: "/map", icon: MapPin },
  { title: "Incidents", url: "/incidents", icon: AlertTriangle },
  { title: "Drivers", url: "/drivers", icon: Users },
  { title: "Face Recognition", url: "/face-recognition", icon: Camera },
  { title: "Face Database", url: "/face-database", icon: Database },
];

export function AzureLeftNav() {
  return (
    <div className="w-[220px] bg-card border-r border-border flex flex-col">
      {/* Navigation Items */}
      <nav className="flex-1 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 text-sm font-normal text-foreground hover:bg-secondary/50 transition-colors border-l-2 ${
                isActive
                  ? 'border-l-primary bg-primary/5 text-primary font-semibold'
                  : 'border-l-transparent'
              }`
            }
          >
            <item.icon className="h-4 w-4" strokeWidth={1.5} />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
