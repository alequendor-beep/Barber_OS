import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-background text-foreground">
      <p className="font-mono text-6xl font-bold text-muted-foreground/20 mb-4">404</p>
      <h1 className="text-2xl font-display font-bold mb-2">Página no encontrada</h1>
      <p className="text-muted-foreground mb-8">La página que buscas no existe o fue movida.</p>
      <Link href="/"><a className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">Volver al inicio</a></Link>
    </div>
  );
}
