import { NavLink, Outlet } from "react-router-dom";
import { Home, Send, Briefcase, Wallet } from "lucide-react";

export default function DashboardLayout() {
  const routes = [
    { href: "/", label: "Home", icon: Home },
    { href: "/plan", label: "Plan a Trip", icon: Send },
    { href: "/trips", label: "My Trips", icon: Briefcase },
    { href: "/wallet", label: "Wallet", icon: Wallet },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border/50 bg-card/20 backdrop-blur-md flex flex-col justify-between hidden md:flex">
        <div>
          <div className="h-16 flex items-center px-6 gap-3 border-b border-border/50">
            <img src="/ExFlo/logo.png" alt="ExFlo Logo" className="h-6 w-auto" />
            <span className="font-display font-bold text-lg tracking-tight text-foreground">
              Ex<span className="text-gradient-primary">Flo</span>
            </span>
          </div>

          <nav className="mt-8 px-4 flex flex-col gap-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
              Navigation
            </div>
            {routes.map((route) => (
              <NavLink
                key={route.href}
                to={route.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${
                    isActive
                      ? "bg-primary/10 text-primary glow-primary"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`
                }
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary text-sm font-bold text-muted-foreground">
              JD
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">John Doe</p>
              <p className="text-xs text-muted-foreground">Explorer</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 relative pb-16 md:pb-0 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Component */}
      <nav className="fixed md:hidden bottom-0 left-0 right-0 h-16 border-t border-border/50 bg-background/80 backdrop-blur-lg flex items-center justify-around z-50">
        {routes.map((route) => (
           <NavLink
             key={route.href}
             to={route.href}
             className={({ isActive }) =>
               `flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                 isActive ? "text-primary" : "text-muted-foreground"
               }`
             }
           >
             <route.icon className="h-5 w-5" />
             <span className="text-[10px] font-medium">{route.label}</span>
           </NavLink>
        ))}
      </nav>
    </div>
  );
}
