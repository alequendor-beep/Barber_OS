import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, Calendar, Scissors, Users, UserCheck,
  ChevronLeft, ChevronRight, Link2, Moon, Sun, Menu, X
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Calendar, label: "Calendario", href: "/admin/calendar" },
  { icon: Scissors, label: "Servicios", href: "/admin/services" },
  { icon: UserCheck, label: "Equipo", href: "/admin/team" },
  { icon: Users, label: "Clientes", href: "/admin/clients" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={cn(
        "flex flex-col bg-[#0A0A0A] text-white h-full transition-all duration-300",
        mobile ? "w-72" : collapsed ? "w-16" : "w-60"
      )}
    >
      <div className={cn("flex items-center px-4 py-5 border-b border-white/10", collapsed && !mobile ? "justify-center" : "justify-between")}>
        {(!collapsed || mobile) && (
          <span className="font-display font-bold text-lg tracking-tight">
            Barber<span className="text-indigo-400">OS</span>
          </span>
        )}
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10">
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const active = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                active
                  ? "bg-indigo-600 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10",
                (collapsed && !mobile) && "justify-center px-2"
              )}
              title={collapsed && !mobile ? item.label : undefined}
            >
              <item.icon size={18} className="shrink-0" />
              {(!collapsed || mobile) && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3 space-y-1">
        <Link
          href="/book/el-maestro"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-emerald-400 hover:bg-white/10 transition-colors",
            (collapsed && !mobile) && "justify-center px-2"
          )}
        >
          <Link2 size={18} className="shrink-0" />
          {(!collapsed || mobile) && <span>Link de Reservas</span>}
        </Link>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors",
            (collapsed && !mobile) && "justify-center px-2"
          )}
        >
          {theme === "dark" ? <Sun size={18} className="shrink-0" /> : <Moon size={18} className="shrink-0" />}
          {(!collapsed || mobile) && <span>{theme === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-muted">
            <Menu size={20} />
          </button>
          <span className="font-display font-bold text-base">
            Barber<span className="text-indigo-600">OS</span>
          </span>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-muted"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        {/* Mobile bottom tab bar */}
        <div className="md:hidden flex border-t border-border bg-background">
          {navItems.slice(0, 4).map((item) => {
            const active = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                  active ? "text-indigo-600" : "text-muted-foreground"
                )}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
