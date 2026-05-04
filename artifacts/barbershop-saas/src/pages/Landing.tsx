import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Clock, Bell, BarChart3, Users, ChevronDown, Check, Star,
  Scissors, Calendar, ArrowRight, Quote
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const features = [
  { icon: Clock, title: "Agenda 24/7", desc: "Tus clientes reservan a cualquier hora, incluso cuando duermes." },
  { icon: Bell, title: "Recordatorios Automáticos", desc: "Notificaciones por WhatsApp o Email para reducir inasistencias al mínimo." },
  { icon: BarChart3, title: "Control de Ingresos", desc: "Estadísticas en tiempo real sobre tus ingresos, servicios más populares y más." },
  { icon: Users, title: "Multi-barbero", desc: "Gestiona a todo tu equipo en un solo lugar. Calendarios individuales por barbero." },
];

const barberSteps = [
  { step: "01", title: "Crea tu perfil", desc: "Registra tu barbería en minutos con tus servicios y horarios." },
  { step: "02", title: "Añade servicios", desc: "Configura precios, duración y fotos de cada servicio." },
  { step: "03", title: "Comparte tu link", desc: "Un enlace único para Instagram, WhatsApp o donde quieras." },
  { step: "04", title: "Recibe reservas", desc: "Las citas llegan solas. Tú solo cortas." },
];

const clientSteps = [
  { step: "01", title: "Encuentra tu local", desc: "Busca barberías cercanas o accede por su enlace directo." },
  { step: "02", title: "Elige servicio y hora", desc: "Selecciona lo que quieres y el horario disponible." },
  { step: "03", title: "Confirma tu cita", desc: "Recibe confirmación instantánea en tu correo o WhatsApp." },
  { step: "04", title: "Disfruta tu corte", desc: "Llega sin filas, tu cita te espera." },
];

const plans = [
  {
    name: "Básico", price: { monthly: "Gratis", annually: "Gratis" }, accent: false,
    features: ["Hasta 50 citas/mes", "1 barbero", "Link de reservas", "Recordatorios por email"],
  },
  {
    name: "Pro", price: { monthly: "$49.900", annually: "$39.900" }, accent: true, badge: "Más popular",
    features: ["Citas ilimitadas", "Hasta 5 barberos", "Recordatorios por WhatsApp", "Dashboard de ingresos", "Gestión de equipo", "Soporte prioritario"],
  },
  {
    name: "Premium", price: { monthly: "$89.900", annually: "$69.900" }, accent: false,
    features: ["Todo en Pro", "Barberos ilimitados", "Múltiples sedes", "API access", "Marca personalizada", "Gestor de cuenta dedicado"],
  },
];

const testimonials = [
  {
    quote: "BarberOS me ahorra 10 horas a la semana de responder mensajes de WhatsApp. Ahora solo corto.",
    name: "Ricardo Montoya",
    barbershop: "Barbería La Esquina, Medellín",
  },
  {
    quote: "Mis clientes aman poder reservar a la 1am. Las inasistencias bajaron un 80% con los recordatorios.",
    name: "Sergio Valencia",
    barbershop: "StyleCuts Premium, Bogotá",
  },
  {
    quote: "El panel de administración es increíble. Veo todo mi negocio en una sola pantalla.",
    name: "Andrés Bermúdez",
    barbershop: "El Barbero Urbano, Cali",
  },
];

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Mini dashboard icon
function LayoutDashboardIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export default function Landing() {
  const [activeTab, setActiveTab] = useState<"barbers" | "clients">("barbers");
  const [billing, setBilling] = useState<"monthly" | "annually">("monthly");
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-24 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <span className="inline-block text-xs font-mono font-semibold text-indigo-600 tracking-widest uppercase mb-6 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 rounded-full border border-indigo-200 dark:border-indigo-800">
            La plataforma #1 para barberías
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold tracking-tight leading-none mb-6">
            La gestión de tu barbería,<br />
            <span className="text-indigo-600">llevada al siguiente nivel.</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Agenda, administra y crece. La plataforma definitiva tanto para barberos profesionales como para clientes exigentes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-500/20 text-sm sm:text-base"
            >
              Registrar mi Barbería
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/book/el-maestro"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-border font-semibold rounded-xl hover:bg-muted transition-colors text-sm sm:text-base"
            >
              Soy Cliente — Buscar Barbería
            </Link>
          </div>
        </motion.div>

        {/* Floating mockup visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="mt-20 flex justify-center gap-6 items-end"
        >
          {/* Phone mockup */}
          <div className="hidden sm:block relative">
            <div className="w-44 h-80 rounded-3xl bg-[#0A0A0A] border-4 border-[#1a1a1a] shadow-2xl overflow-hidden flex flex-col">
              <div className="h-6 bg-[#111] flex items-center justify-center">
                <div className="w-16 h-1 bg-[#333] rounded-full" />
              </div>
              <div className="flex-1 bg-[#0f0f0f] p-3 space-y-2">
                <div className="text-white text-xs font-display font-bold">Mis Citas</div>
                <div className="bg-indigo-600 rounded-xl p-3">
                  <div className="text-white text-xs font-semibold">Hoy, 10:00 AM</div>
                  <div className="text-white/70 text-[10px] mt-1">Carlos Mendoza · Fade + Barba</div>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-emerald-400 text-[10px]">Confirmada</span>
                  </div>
                </div>
                <div className="bg-[#1a1a1a] rounded-xl p-3">
                  <div className="text-white text-xs font-semibold">Mañana, 14:30</div>
                  <div className="text-white/70 text-[10px] mt-1">Andrés Torres · Barba</div>
                </div>
                <div className="bg-[#1a1a1a] rounded-xl p-3">
                  <div className="text-white/50 text-[10px]">+ Agendar nueva cita</div>
                </div>
              </div>
            </div>
          </div>

          {/* Laptop mockup */}
          <div className="relative">
            <div className="w-72 sm:w-[440px] h-52 sm:h-72 rounded-xl bg-[#0A0A0A] border-2 border-[#1a1a1a] shadow-2xl overflow-hidden">
              <div className="h-6 bg-[#111] flex items-center px-3 gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-green-500/60" />
                <div className="ml-auto text-white/20 text-[8px]">barber-os.app/admin</div>
              </div>
              <div className="flex h-full">
                <div className="w-12 sm:w-16 bg-[#080808] flex flex-col items-center pt-3 gap-3 pb-6">
                  {[LayoutDashboardIcon, Calendar, Scissors, Users].map((Icon, i) => (
                    <div key={i} className={`p-1.5 sm:p-2 rounded-lg ${i === 0 ? "bg-indigo-600" : "hover:bg-white/5"}`}>
                      <Icon size={12} className={i === 0 ? "text-white" : "text-white/30"} />
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-3 space-y-2">
                  <div className="text-white text-xs font-display font-semibold">Dashboard</div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { l: "Citas hoy", v: "7" },
                      { l: "Ingresos", v: "$245K" },
                      { l: "Clientes", v: "142" }
                    ].map((c) => (
                      <div key={c.l} className="bg-[#141414] rounded-lg p-2">
                        <div className="text-white/40 text-[8px]">{c.l}</div>
                        <div className="text-white text-xs font-bold">{c.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#141414] rounded-lg p-2">
                    <div className="text-white/40 text-[8px] mb-1">Ingresos esta semana</div>
                    <div className="flex items-end gap-1 h-10">
                      {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-sm ${i === 5 ? "bg-indigo-500" : "bg-indigo-900/50"}`}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-3 bg-[#1a1a1a] rounded-b-2xl mt-0.5 mx-auto max-w-[90%]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex justify-center"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <ChevronDown size={24} className="text-muted-foreground/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">Todo lo que necesitas, nada de lo que no</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Herramientas diseñadas específicamente para barberías que quieren crecer.</p>
            </div>
          </FadeInSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <FadeInSection key={f.title} delay={i * 0.1}>
                <div className="group p-6 bg-background rounded-2xl border border-border hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                    <f.icon size={20} className="text-foreground group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-display font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">Cómo funciona</h2>
              <div className="inline-flex bg-muted rounded-xl p-1 gap-1 mt-2">
                <button
                  onClick={() => setActiveTab("barbers")}
                  className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === "barbers" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Para Barberos
                </button>
                <button
                  onClick={() => setActiveTab("clients")}
                  className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === "clients" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Para Clientes
                </button>
              </div>
            </div>
          </FadeInSection>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {(activeTab === "barbers" ? barberSteps : clientSteps).map((step, i) => (
                <div key={step.step} className="relative flex flex-col">
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-border z-0" />
                  )}
                  <div className="relative bg-background border border-border rounded-2xl p-6 z-10 flex-1">
                    <span className="font-mono text-xs text-indigo-600 font-semibold">{step.step}</span>
                    <h3 className="font-display font-semibold mt-2 mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">Planes y Precios</h2>
              <p className="text-muted-foreground mb-6">Empieza gratis, escala cuando quieras.</p>
              <div className="inline-flex bg-muted rounded-xl p-1 gap-1">
                {(["monthly", "annually"] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBilling(b)}
                    className={`px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${billing === b ? "bg-background shadow text-foreground" : "text-muted-foreground"}`}
                  >
                    {b === "monthly" ? "Mensual" : "Anual"} {b === "annually" && <span className="text-xs text-emerald-600 ml-1">-20%</span>}
                  </button>
                ))}
              </div>
            </div>
          </FadeInSection>

          <div className="grid sm:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <FadeInSection key={plan.name} delay={i * 0.1}>
                <div className={`relative flex flex-col bg-background rounded-2xl border-2 p-6 h-full ${plan.accent ? "border-indigo-500 shadow-xl shadow-indigo-500/10" : "border-border"}`}>
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {plan.badge}
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="font-display font-bold text-lg mb-1">{plan.name}</h3>
                    <div className="text-3xl font-display font-extrabold">
                      {billing === "monthly" ? plan.price.monthly : plan.price.annually}
                    </div>
                    {plan.price.monthly !== "Gratis" && <p className="text-xs text-muted-foreground mt-1">COP / mes</p>}
                  </div>
                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check size={14} className={`mt-0.5 shrink-0 ${plan.accent ? "text-indigo-600" : "text-muted-foreground"}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`block text-center py-3 rounded-xl text-sm font-semibold transition-colors ${plan.accent ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border border-border hover:bg-muted"}`}
                  >
                    {plan.price.monthly === "Gratis" ? "Empezar gratis" : "Comenzar prueba"}
                  </Link>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeInSection>
            <p className="text-xs font-mono font-semibold tracking-widest text-muted-foreground uppercase mb-8">Confiado por las mejores barberías</p>
            <div className="flex justify-center gap-6 mb-16 flex-wrap">
              {["El Maestro", "StyleCuts", "La Esquina", "UrbanBlade", "TrimCo"].map((b) => (
                <span key={b} className="text-muted-foreground/40 font-display font-bold text-sm hover:text-muted-foreground transition-colors cursor-default">
                  {b}
                </span>
              ))}
            </div>
          </FadeInSection>

          <div className="relative min-h-40">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <Quote size={32} className="text-indigo-600/20 mx-auto mb-4" />
                <blockquote className="text-lg sm:text-xl font-display font-medium text-foreground leading-relaxed mb-6">
                  "{testimonials[testimonialIdx].quote}"
                </blockquote>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 font-bold text-sm">
                    {testimonials[testimonialIdx].name[0]}
                  </div>
                  <p className="font-semibold text-sm">{testimonials[testimonialIdx].name}</p>
                  <p className="text-xs text-muted-foreground">{testimonials[testimonialIdx].barbershop}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setTestimonialIdx(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === testimonialIdx ? "bg-indigo-600" : "bg-border"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pre-footer CTA */}
      <section className="mx-4 sm:mx-6 mb-16 rounded-3xl bg-indigo-600 overflow-hidden">
        <div className="max-w-3xl mx-auto px-8 py-20 text-center">
          <FadeInSection>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Listo para modernizar tu barbería?
            </h2>
            <p className="text-indigo-200 mb-8 text-lg">14 días de prueba gratis. Sin tarjeta de crédito.</p>
            <Link href="/register" className="inline-block bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl text-base hover:bg-indigo-50 transition-colors shadow-lg">
              Comenzar prueba gratis de 14 días
            </Link>
          </FadeInSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 sm:px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between gap-8 mb-12">
            <div>
              <span className="font-display font-bold text-xl">Barber<span className="text-indigo-600">OS</span></span>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs">La plataforma SaaS definitiva para barberías modernas.</p>
            </div>
            <div className="grid grid-cols-3 gap-8">
              {[
                { title: "Producto", links: ["Precios", "Funciones", "Changelog"] },
                { title: "Soporte", links: ["Ayuda", "Contacto", "Estado"] },
                { title: "Legal", links: ["Términos", "Privacidad", "Cookies"] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 className="text-sm font-semibold mb-3">{col.title}</h4>
                  <ul className="space-y-2">
                    {col.links.map((l) => (
                      <li key={l}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground">© 2026 BarberOS. Todos los derechos reservados.</p>
            <select className="text-xs bg-transparent text-muted-foreground border border-border rounded px-2 py-1">
              <option>Español (Colombia)</option>
              <option>English</option>
            </select>
          </div>
        </div>
      </footer>
    </div>
  );
}
