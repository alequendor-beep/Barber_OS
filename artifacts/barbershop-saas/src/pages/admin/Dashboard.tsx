import AdminLayout from "@/components/layout/AdminLayout";
import { useGetBarbershopDashboard, getGetBarbershopDashboardQueryKey, useUpdateAppointment } from "@workspace/api-client-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TrendingUp, Users, Calendar, CheckCircle, Clock, Check, X } from "lucide-react";

const BARBERSHOP_ID = 1;

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted rounded-lg ${className}`} />;
}

export default function AdminDashboard() {
  const { data, isLoading } = useGetBarbershopDashboard(BARBERSHOP_ID, {
    query: { queryKey: getGetBarbershopDashboardQueryKey(BARBERSHOP_ID), enabled: true }
  });
  const updateMutation = useUpdateAppointment();

  const markStatus = (id: number, status: "completed" | "no_show") => {
    updateMutation.mutate({ appointmentId: id, data: { status } });
  };

  const stats = [
    { label: "Citas hoy", value: isLoading ? null : data?.todayAppointments ?? 0, icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950" },
    { label: "Ingresos del mes", value: isLoading ? null : `$${((data?.monthRevenue ?? 0) / 1000).toFixed(0)}K`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { label: "Total clientes", value: isLoading ? null : data?.totalClients ?? 0, icon: Users, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950" },
    { label: "Tasa de completado", value: isLoading ? null : `${data?.completionRate ?? 0}%`, icon: CheckCircle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon size={18} className={s.color} />
              </div>
              <div className="text-2xl font-display font-bold">
                {s.value === null ? <Skeleton className="h-8 w-16" /> : s.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Revenue chart + Upcoming */}
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Chart */}
          <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-5">
            <h2 className="font-display font-semibold mb-4 text-sm">Ingresos últimos 7 días</h2>
            {isLoading ? (
              <Skeleton className="h-40" />
            ) : (
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={data?.revenueByDay ?? []} barSize={24}>
                  <XAxis dataKey="date" tickFormatter={(v) => format(new Date(v + "T12:00"), "dd/MM")} tick={{ fontSize: 10, fill: "currentColor" }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    formatter={(v: number) => [`$${(v / 1000).toFixed(0)}K`, "Ingresos"]}
                    labelFormatter={(l) => format(new Date(l + "T12:00"), "dd MMM", { locale: es })}
                    contentStyle={{ fontSize: 11, borderRadius: 8 }}
                  />
                  <Bar dataKey="revenue" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Upcoming */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
            <h2 className="font-display font-semibold mb-4 text-sm">Próximas citas de hoy</h2>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-60">
                {(data?.upcomingAppointments ?? []).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">No hay citas pendientes hoy</p>
                )}
                {(data?.upcomingAppointments ?? []).map((appt) => (
                  <div key={appt.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Clock size={11} className="text-muted-foreground shrink-0" />
                        <span className="text-xs font-mono text-muted-foreground">{appt.time}</span>
                      </div>
                      <p className="text-sm font-semibold truncate">{appt.clientName ?? "Cliente"}</p>
                      <p className="text-xs text-muted-foreground truncate">{appt.serviceName ?? "Servicio"} · {appt.barberName ?? "Barbero"}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => markStatus(appt.id, "completed")} title="Marcar como completado"
                        className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center hover:bg-emerald-200 transition-colors">
                        <Check size={13} className="text-emerald-600" />
                      </button>
                      <button onClick={() => markStatus(appt.id, "no_show")} title="No asistió"
                        className="w-7 h-7 rounded-lg bg-red-100 dark:bg-red-950 flex items-center justify-center hover:bg-red-200 transition-colors">
                        <X size={13} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
