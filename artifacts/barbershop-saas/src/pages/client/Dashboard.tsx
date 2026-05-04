import { Link } from "wouter";
import { useGetClientAppointments, getGetClientAppointmentsQueryKey } from "@workspace/api-client-react";
import { Calendar, Clock, Scissors, RotateCcw, X, Sun, Moon } from "lucide-react";
import { format, parseISO, differenceInHours } from "date-fns";
import { es } from "date-fns/locale";
import { useTheme } from "next-themes";

const CLIENT_ID = 1;

const favoriteBarbershops = [
  { name: "Barbería El Maestro", address: "Carrera 7 #45-23", slug: "el-maestro" },
  { name: "StyleCut Barbershop", address: "Calle 93 #15-12", slug: "stylecut" },
];

export default function ClientDashboard() {
  const { theme, setTheme } = useTheme();
  const { data: appointments = [], isLoading } = useGetClientAppointments(CLIENT_ID, {
    query: { queryKey: getGetClientAppointmentsQueryKey(CLIENT_ID), enabled: true }
  });

  const upcomingAppt = appointments.find((a) => a.status === "confirmed" || a.status === "pending");
  const pastAppts = appointments.filter((a) => a.status === "completed").slice(0, 5);

  const getCountdown = (date: string, time: string) => {
    try {
      const dt = new Date(`${date}T${time}`);
      const hours = differenceInHours(dt, new Date());
      if (hours < 0) return "Ya pasó";
      if (hours < 1) return "Menos de 1 hora";
      if (hours < 24) return `En ${hours}h`;
      const days = Math.floor(hours / 24);
      return `En ${days} día${days > 1 ? "s" : ""}`;
    } catch {
      return "";
    }
  };

  const formatApptDate = (dateVal: string | Date) => {
    try {
      const d = typeof dateVal === "string" ? new Date(dateVal + (dateVal.length === 10 ? "T12:00" : "")) : dateVal;
      return format(d, "EEEE d 'de' MMMM", { locale: es });
    } catch {
      return String(dateVal);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
        <Link href="/" className="font-display font-bold text-xl">
          Barber<span className="text-indigo-600">OS</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/book/el-maestro"
            className="text-sm font-semibold px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Nueva cita
          </Link>
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Hola, Mateo</h1>
          <p className="text-muted-foreground text-sm mt-1">Tus citas y barberías favoritas</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Próxima cita</h2>
          {isLoading ? (
            <div className="h-36 bg-muted rounded-2xl animate-pulse" />
          ) : upcomingAppt ? (
            <div className="bg-indigo-600 rounded-2xl p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-indigo-200 text-xs font-mono font-semibold uppercase tracking-wide">
                    {getCountdown(String(upcomingAppt.date), upcomingAppt.time)}
                  </p>
                  <h3 className="text-xl font-display font-bold mt-1">
                    {formatApptDate(upcomingAppt.date)}
                  </h3>
                  <p className="text-indigo-200 text-sm">a las {upcomingAppt.time}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Scissors size={18} />
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium">{upcomingAppt.serviceName ?? "Servicio"}</span>
                <span className="text-indigo-300">·</span>
                <span className="text-sm text-indigo-200">{upcomingAppt.barberName ?? "Barbero"}</span>
                {upcomingAppt.servicePrice != null && (
                  <>
                    <span className="text-indigo-300">·</span>
                    <span className="text-sm font-semibold">${(upcomingAppt.servicePrice / 1000).toFixed(0)}K</span>
                  </>
                )}
              </div>
              <button className="mt-4 flex items-center gap-1.5 text-xs text-red-300 hover:text-red-200 transition-colors">
                <X size={12} /> Cancelar / Reprogramar
              </button>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <Calendar size={28} className="mx-auto text-muted-foreground mb-3" />
              <p className="font-semibold">Sin citas próximas</p>
              <p className="text-sm text-muted-foreground mt-1">Reserva tu próxima cita</p>
              <Link href="/book/el-maestro" className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
                Agendar ahora
              </Link>
            </div>
          )}
        </div>

        {pastAppts.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Historial de cortes</h2>
            <div className="space-y-2">
              {pastAppts.map((a) => (
                <div key={a.id} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:bg-muted/30 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                    <Scissors size={15} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{a.serviceName ?? "Servicio"}</p>
                    <p className="text-xs text-muted-foreground">{a.barberName ?? "Barbero"} · {formatApptDate(a.date)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {a.servicePrice != null && <span className="text-xs font-mono font-semibold">${(a.servicePrice / 1000).toFixed(0)}K</span>}
                    <Link href="/book/el-maestro" className="flex items-center gap-1 text-xs text-indigo-600 font-medium hover:underline">
                      <RotateCcw size={11} /> Repetir
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Barberías favoritas</h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {favoriteBarbershops.map((b) => (
              <Link
                key={b.slug}
                href={`/book/${b.slug}`}
                className="flex-shrink-0 w-44 bg-card border border-border rounded-2xl p-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mb-3">
                  <Scissors size={18} className="text-indigo-600" />
                </div>
                <p className="text-sm font-semibold line-clamp-1">{b.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{b.address}</p>
                <span className="mt-3 inline-block text-xs text-indigo-600 font-medium">Agendar</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 flex border-t border-border bg-background">
        {[
          { icon: Calendar, label: "Citas", href: "/client" },
          { icon: Scissors, label: "Buscar", href: "/book/el-maestro" },
          { icon: Clock, label: "Historial", href: "/client" },
        ].map((t) => (
          <Link key={t.label} href={t.href} className="flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium text-muted-foreground">
            <t.icon size={20} />
            <span>{t.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
