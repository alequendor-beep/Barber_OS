import { useState } from "react";
import { format, addDays, subDays, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useListAppointments, getListAppointmentsQueryKey } from "@workspace/api-client-react";

const BARBERSHOP_ID = 1;

const statusColors: Record<string, string> = {
  confirmed: "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  pending: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  completed: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  cancelled: "bg-muted text-muted-foreground border-border",
  no_show: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
};

const statusLabels: Record<string, string> = {
  confirmed: "Confirmada",
  pending: "Pendiente",
  completed: "Completada",
  cancelled: "Cancelada",
  no_show: "No asistió",
};

export default function AdminCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateStr = format(selectedDate, "yyyy-MM-dd");

  const { data: appointments = [], isLoading } = useListAppointments(
    BARBERSHOP_ID,
    { date: dateStr },
    { query: { queryKey: getListAppointmentsQueryKey(BARBERSHOP_ID, { date: dateStr }), enabled: true } }
  );

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold">Calendario de Citas</h1>
            <p className="text-sm text-muted-foreground mt-1">Gestiona las citas de tu equipo</p>
          </div>
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-1">
            <button onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 text-sm font-medium min-w-40 text-center">
              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
            </span>
            <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Week mini-nav */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {Array.from({ length: 7 }, (_, i) => {
            const d = addDays(subDays(new Date(), 3), i);
            const isSelected = format(d, "yyyy-MM-dd") === dateStr;
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(d)}
                className={`flex flex-col items-center px-4 py-2.5 rounded-xl text-xs font-medium shrink-0 transition-colors ${isSelected ? "bg-indigo-600 text-white" : "bg-card border border-border hover:bg-muted"}`}
              >
                <span className="uppercase">{format(d, "EEE", { locale: es })}</span>
                <span className="text-base font-bold mt-0.5">{format(d, "d")}</span>
              </button>
            );
          })}
        </div>

        {/* Appointments */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted rounded-2xl animate-pulse" />)}
          </div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Clock size={24} className="text-muted-foreground" />
            </div>
            <p className="font-semibold">Sin citas para este día</p>
            <p className="text-sm text-muted-foreground mt-1">Los clientes pueden reservar desde tu link</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div key={appt.id} className={`flex items-center gap-4 p-4 bg-card border rounded-2xl ${statusColors[appt.status]}`}>
                <div className="text-center w-14 shrink-0">
                  <p className="font-mono font-bold text-sm">{appt.time}</p>
                  <p className="text-xs opacity-70">{appt.serviceDuration}min</p>
                </div>
                <div className="w-px h-10 bg-current opacity-20 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{appt.clientName ?? "Cliente"}</p>
                  <p className="text-xs opacity-70 truncate">{appt.serviceName ?? "Servicio"} · {appt.barberName ?? "Barbero"}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-current/10">
                    {statusLabels[appt.status] ?? appt.status}
                  </span>
                  {appt.servicePrice && (
                    <p className="text-xs opacity-70 mt-1">${(appt.servicePrice / 1000).toFixed(0)}K</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
