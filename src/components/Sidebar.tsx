import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
}

const Sidebar = ({ items }: SidebarProps) => {
  return (
    <aside className="hidden lg:block w-64 bg-card border-r border-border min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  "hover:bg-accent/50 hover:shadow-sm",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-primary font-medium" 
                    : "text-foreground hover:text-primary"
                )
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
