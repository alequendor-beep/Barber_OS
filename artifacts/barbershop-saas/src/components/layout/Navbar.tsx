import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl tracking-tight">
          Barber<span className="text-indigo-600">OS</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Funciones</a>
          <a href="#how" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cómo funciona</a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Precios</a>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link href="/register" className="text-sm font-medium px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
            Iniciar sesión
          </Link>
          <Link href="/register" className="text-sm font-semibold px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Registrar mi Barbería
          </Link>
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-muted">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <a href="#features" onClick={() => setOpen(false)} className="block text-sm text-muted-foreground">Funciones</a>
          <a href="#how" onClick={() => setOpen(false)} className="block text-sm text-muted-foreground">Cómo funciona</a>
          <a href="#pricing" onClick={() => setOpen(false)} className="block text-sm text-muted-foreground">Precios</a>
          <div className="flex gap-3 pt-2">
            <Link href="/register" className="flex-1 text-center text-sm font-medium px-4 py-2 border border-border rounded-lg">
              Iniciar sesión
            </Link>
            <Link href="/register" className="flex-1 text-center text-sm font-semibold px-4 py-2 bg-indigo-600 text-white rounded-lg">
              Registrar
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
