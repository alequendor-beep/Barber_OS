import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  useListServices, getListServicesQueryKey,
  useListBarbers, getListBarbersQueryKey,
  useCreateAppointment,
} from "@workspace/api-client-react";
import { ArrowLeft, ArrowRight, Check, Scissors, Clock, CheckCircle } from "lucide-react";
import { format, addDays } from "date-fns";
import { es } from "date-fns/locale";

const BARBERSHOP_ID = 1;

const TIMES = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];
const TAKEN = ["10:00", "11:30", "14:30", "15:00"];

type Step = 1 | 2 | 3 | 4 | 5;

interface Selection {
  serviceId: number | null;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  barberId: number | null;
  barberName: string;
  date: string;
  time: string;
}

export default function BookingFlow() {
  const [step, setStep] = useState<Step>(1);
  const [confirmed, setConfirmed] = useState(false);
  const [, navigate] = useLocation();
  const [sel, setSel] = useState<Selection>({
    serviceId: null, serviceName: "", servicePrice: 0, serviceDuration: 0,
    barberId: null, barberName: "", date: "", time: ""
  });

  const { data: services = [], isLoading: servicesLoading } = useListServices(BARBERSHOP_ID, {
    query: { queryKey: getListServicesQueryKey(BARBERSHOP_ID), enabled: true }
  });
  const { data: barbers = [], isLoading: barbersLoading } = useListBarbers(BARBERSHOP_ID, {
    query: { queryKey: getListBarbersQueryKey(BARBERSHOP_ID), enabled: true }
  });
  const createAppt = useCreateAppointment();

  const dates = Array.from({ length: 10 }, (_, i) => addDays(new Date(), i + 1));
  const initials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const bColors = ["bg-indigo-100 text-indigo-700", "bg-violet-100 text-violet-700", "bg-emerald-100 text-emerald-700"];
  const stepLabels = ["Servicio", "Barbero", "Fecha", "Hora", "Confirmar"];

  const handleConfirm = () => {
    if (!sel.serviceId || !sel.date || !sel.time) return;
    createAppt.mutate(
      {
        barbershopId: BARBERSHOP_ID,
        data: {
          barberId: sel.barberId ?? barbers[0]?.id ?? 1,
          clientId: 1,
          serviceId: sel.serviceId,
          date: sel.date,
          time: sel.time
        }
      },
      { onSuccess: () => setConfirmed(true) }
    );
  };

  if (confirmed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-center"
        >
          <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={44} className="text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-2">Cita confirmada</h1>
          <p className="text-muted-foreground mb-2">{sel.serviceName} con {sel.barberName || "tu barbero"}</p>
          <p className="text-muted-foreground text-sm">
            {sel.date && format(new Date(sel.date + "T12:00"), "EEEE d 'de' MMMM", { locale: es })} a las {sel.time}
          </p>
          <div className="mt-10 flex gap-3 justify-center">
            <Link href="/client" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
              Ver mis citas
            </Link>
            <Link href="/" className="px-6 py-3 border border-border rounded-xl font-semibold hover:bg-muted transition-colors">
              Ir al inicio
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border px-4 sm:px-6 py-4 flex items-center gap-4">
        <button onClick={() => step > 1 ? setStep((step - 1) as Step) : navigate("/")} className="p-2 rounded-lg hover:bg-muted">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <Link href="/" className="font-display font-bold">
            Barber<span className="text-indigo-600">OS</span>
          </Link>
          <p className="text-xs text-muted-foreground">Barbería El Maestro</p>
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-6 pb-2">
        <div className="flex gap-1 mb-4">
          {stepLabels.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i + 1 <= step ? "bg-indigo-600" : "bg-muted"}`} />
          ))}
        </div>
        <p className="text-xs text-muted-foreground font-mono">PASO {step} DE 5 — {stepLabels[step - 1].toUpperCase()}</p>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-display font-bold mb-5">Elige tu servicio</h2>
              {servicesLoading ? (
                <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted rounded-2xl animate-pulse" />)}</div>
              ) : (
                <div className="space-y-3">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setSel({ ...sel, serviceId: s.id, serviceName: s.name, servicePrice: s.price, serviceDuration: s.durationMinutes }); setStep(2); }}
                      className={`w-full flex items-center gap-4 p-4 border-2 rounded-2xl text-left transition-all hover:border-indigo-400 group ${sel.serviceId === s.id ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950" : "border-border bg-card"}`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 group-hover:bg-indigo-100 flex items-center justify-center shrink-0 transition-colors">
                        <Scissors size={20} className="text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{s.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-mono font-bold text-sm">${(s.price / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-0.5"><Clock size={10} />{s.durationMinutes}min</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-display font-bold mb-5">Elige tu barbero</h2>
              {barbersLoading ? (
                <div className="grid grid-cols-3 gap-3">{[1, 2, 3].map((i) => <div key={i} className="h-28 bg-muted rounded-2xl animate-pulse" />)}</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {barbers.map((b, idx) => (
                    <button
                      key={b.id}
                      onClick={() => { setSel({ ...sel, barberId: b.id, barberName: b.name }); setStep(3); }}
                      className={`flex flex-col items-center p-4 border-2 rounded-2xl transition-all hover:border-indigo-400 ${sel.barberId === b.id ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950" : "border-border bg-card"}`}
                    >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold mb-2 ${bColors[idx % bColors.length]}`}>
                        {initials(b.name)}
                      </div>
                      <p className="text-sm font-semibold text-center line-clamp-1">{b.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 text-center line-clamp-1">{b.specialties.split(",")[0]}</p>
                    </button>
                  ))}
                </div>
              )}
              <button onClick={() => setStep(3)} className="mt-6 w-full py-3 border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
                Cualquier barbero disponible
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-display font-bold mb-5">Elige una fecha</h2>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dates.map((d, i) => {
                  const ds = format(d, "yyyy-MM-dd");
                  const isSelected = sel.date === ds;
                  return (
                    <button
                      key={i}
                      onClick={() => setSel({ ...sel, date: ds })}
                      className={`flex flex-col items-center px-4 py-3 rounded-2xl border-2 shrink-0 transition-all ${isSelected ? "border-indigo-500 bg-indigo-600 text-white" : "border-border bg-card hover:border-indigo-300"}`}
                    >
                      <span className={`text-xs font-medium uppercase ${isSelected ? "text-indigo-200" : "text-muted-foreground"}`}>
                        {format(d, "EEE", { locale: es })}
                      </span>
                      <span className="text-xl font-display font-bold">{format(d, "d")}</span>
                      <span className={`text-xs ${isSelected ? "text-indigo-200" : "text-muted-foreground"}`}>{format(d, "MMM", { locale: es })}</span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => sel.date && setStep(4)}
                disabled={!sel.date}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-40"
              >
                Continuar <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-display font-bold mb-1">Elige una hora</h2>
              <p className="text-sm text-muted-foreground mb-5">
                {sel.date && format(new Date(sel.date + "T12:00"), "EEEE d 'de' MMMM", { locale: es })}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {TIMES.map((t) => {
                  const taken = TAKEN.includes(t);
                  const isSelected = sel.time === t;
                  return (
                    <button
                      key={t}
                      disabled={taken}
                      onClick={() => setSel({ ...sel, time: t })}
                      className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all min-h-[44px] ${
                        taken ? "border-border bg-muted text-muted-foreground/40 cursor-not-allowed line-through" :
                        isSelected ? "border-indigo-500 bg-indigo-600 text-white" :
                        "border-border bg-card hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => sel.time && setStep(5)}
                disabled={!sel.time}
                className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-40"
              >
                Continuar <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-display font-bold mb-5">Confirma tu cita</h2>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {[
                  { label: "Servicio", value: sel.serviceName },
                  { label: "Barbero", value: sel.barberName || "Cualquiera disponible" },
                  { label: "Fecha", value: sel.date ? format(new Date(sel.date + "T12:00"), "EEEE d 'de' MMMM yyyy", { locale: es }) : "" },
                  { label: "Hora", value: sel.time },
                  { label: "Duración", value: `${sel.serviceDuration} minutos` },
                  { label: "Precio", value: `$${(sel.servicePrice / 1000).toFixed(0)}K COP`, bold: true },
                ].map((row, i) => (
                  <div key={i} className={`flex justify-between items-center px-5 py-4 ${i < 5 ? "border-b border-border" : ""}`}>
                    <span className="text-sm text-muted-foreground">{row.label}</span>
                    <span className={`text-sm ${row.bold ? "font-bold font-mono text-indigo-600" : "font-medium"}`}>{row.value}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={handleConfirm}
                disabled={createAppt.isPending}
                className="mt-6 w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-base hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-500/20"
              >
                {createAppt.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Procesando...
                  </span>
                ) : (
                  <><Check size={18} /> Confirmar Cita</>
                )}
              </button>
              <p className="text-center text-xs text-muted-foreground mt-3">Recibirás confirmación por email</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
