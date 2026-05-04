import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Building2, User, Check } from "lucide-react";

type Mode = "select" | "admin" | "client";
type AdminStep = 1 | 2 | 3;
type ClientStep = 1 | 2;

export default function Register() {
  const [mode, setMode] = useState<Mode>("select");
  const [adminStep, setAdminStep] = useState<AdminStep>(1);
  const [clientStep, setClientStep] = useState<ClientStep>(1);
  const [, navigate] = useLocation();

  const [adminData, setAdminData] = useState({ name: "", address: "", openTime: "08:00", closeTime: "20:00" });
  const [adminAccount, setAdminAccount] = useState({ email: "", password: "", confirm: "" });
  const [clientData, setClientData] = useState({ name: "", phone: "" });
  const [clientAccount, setClientAccount] = useState({ email: "", password: "" });

  const handleAdminDone = () => navigate("/admin");
  const handleClientDone = () => navigate("/book/el-maestro");

  if (mode === "select") {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex items-center px-6 py-4 border-b border-border">
          <Link href="/" className="font-display font-bold text-lg">
            Barber<span className="text-indigo-600">OS</span>
          </Link>
        </div>
        <div className="flex-1 flex flex-col md:flex-row">
          <motion.button
            onClick={() => setMode("admin")}
            whileHover={{ scale: 1.01 }}
            className="flex-1 flex flex-col items-center justify-center p-12 bg-[#0A0A0A] text-white hover:bg-[#111] transition-colors group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Building2 size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-3">Quiero gestionar<br />mi Barbería</h2>
            <p className="text-white/60 text-center max-w-xs text-sm leading-relaxed">
              Registra tu barbería, gestiona tu equipo y recibe reservas automáticamente.
            </p>
            <div className="mt-8 flex items-center gap-2 text-indigo-400 font-semibold text-sm group-hover:gap-4 transition-all">
              <span>Empezar como Admin</span>
              <ArrowRight size={16} />
            </div>
          </motion.button>

          <div className="hidden md:flex items-center justify-center w-px bg-border relative">
            <div className="absolute bg-background border border-border rounded-full px-4 py-2 text-xs font-mono text-muted-foreground">o</div>
          </div>

          <motion.button
            onClick={() => setMode("client")}
            whileHover={{ scale: 1.01 }}
            className="flex-1 flex flex-col items-center justify-center p-12 bg-background text-foreground hover:bg-muted/50 transition-colors group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-foreground flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <User size={28} className="text-background" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-3">Quiero agendar<br />un corte</h2>
            <p className="text-muted-foreground text-center max-w-xs text-sm leading-relaxed">
              Encuentra tu barbería favorita y reserva tu cita en menos de 2 minutos.
            </p>
            <div className="mt-8 flex items-center gap-2 font-semibold text-sm group-hover:gap-4 transition-all">
              <span>Empezar como Cliente</span>
              <ArrowRight size={16} />
            </div>
          </motion.button>
        </div>
      </div>
    );
  }

  if (mode === "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0A0A0A]">
        <div className="w-full max-w-md">
          <button onClick={() => setMode("select")} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft size={16} /> Volver
          </button>

          <div className="flex items-center gap-3 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${adminStep >= s ? "bg-indigo-600 text-white" : "bg-white/10 text-white/40"}`}>
                  {adminStep > s ? <Check size={14} /> : s}
                </div>
                {s < 3 && <div className={`w-12 h-px transition-colors ${adminStep > s ? "bg-indigo-600" : "bg-white/10"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {adminStep === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-2xl font-display font-bold text-white mb-1">Tu barbería</h1>
                <p className="text-white/50 text-sm mb-8">Cuéntanos sobre tu negocio</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-white/70 text-xs font-medium block mb-1.5">Nombre de la barbería *</label>
                    <input value={adminData.name} onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-indigo-500"
                      placeholder="Ej: Barbería El Maestro" />
                  </div>
                  <div>
                    <label className="text-white/70 text-xs font-medium block mb-1.5">Dirección *</label>
                    <input value={adminData.address} onChange={(e) => setAdminData({ ...adminData, address: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-indigo-500"
                      placeholder="Ej: Calle 45 #12-34, Bogotá" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/70 text-xs font-medium block mb-1.5">Apertura</label>
                      <input type="time" value={adminData.openTime} onChange={(e) => setAdminData({ ...adminData, openTime: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div>
                      <label className="text-white/70 text-xs font-medium block mb-1.5">Cierre</label>
                      <input type="time" value={adminData.closeTime} onChange={(e) => setAdminData({ ...adminData, closeTime: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500" />
                    </div>
                  </div>
                </div>
                <button onClick={() => setAdminStep(2)} className="w-full mt-6 bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                  Continuar
                </button>
              </motion.div>
            )}
            {adminStep === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-2xl font-display font-bold text-white mb-1">Tu cuenta</h1>
                <p className="text-white/50 text-sm mb-8">Crea tu acceso de administrador</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-white/70 text-xs font-medium block mb-1.5">Correo electrónico *</label>
                    <input type="email" value={adminAccount.email} onChange={(e) => setAdminAccount({ ...adminAccount, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-indigo-500"
                      placeholder="admin@barberia.com" />
                  </div>
                  <div>
                    <label className="text-white/70 text-xs font-medium block mb-1.5">Contraseña *</label>
                    <input type="password" value={adminAccount.password} onChange={(e) => setAdminAccount({ ...adminAccount, password: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-indigo-500"
                      placeholder="Mínimo 8 caracteres" />
                  </div>
                  <div>
                    <label className="text-white/70 text-xs font-medium block mb-1.5">Confirmar contraseña *</label>
                    <input type="password" value={adminAccount.confirm} onChange={(e) => setAdminAccount({ ...adminAccount, confirm: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-indigo-500"
                      placeholder="Repite tu contraseña" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setAdminStep(1)} className="flex-1 border border-white/10 text-white py-3.5 rounded-xl font-semibold hover:bg-white/5 transition-colors">
                    Atrás
                  </button>
                  <button onClick={() => setAdminStep(3)} className="flex-[2] bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                    Continuar
                  </button>
                </div>
              </motion.div>
            )}
            {adminStep === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center mx-auto mb-6">
                  <Check size={36} className="text-white" />
                </div>
                <h1 className="text-2xl font-display font-bold text-white mb-2">Barbería creada</h1>
                <p className="text-white/50 text-sm mb-2">{adminData.name || "Tu barbería"} está lista.</p>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 my-6 text-left">
                  <p className="text-white/50 text-xs font-mono mb-1">Tu link de reservas</p>
                  <p className="text-indigo-400 text-sm font-mono">barber-os.app/book/el-maestro</p>
                </div>
                <button onClick={handleAdminDone} className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                  Ir al Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md">
        <button onClick={() => setMode("select")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Volver
        </button>

        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${clientStep >= s ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}>
                {clientStep > s ? <Check size={14} /> : s}
              </div>
              {s < 2 && <div className={`w-12 h-px transition-colors ${clientStep > s ? "bg-foreground" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {clientStep === 1 && (
            <motion.div key="c1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl font-display font-bold mb-1">Crea tu cuenta</h1>
              <p className="text-muted-foreground text-sm mb-8">Empieza a agendar en segundos</p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5">Nombre completo *</label>
                  <input value={clientData.name} onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Teléfono *</label>
                  <input value={clientData.phone} onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" placeholder="+57 300 000 0000" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Correo electrónico *</label>
                  <input type="email" value={clientAccount.email} onChange={(e) => setClientAccount({ ...clientAccount, email: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" placeholder="tu@correo.com" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Contraseña *</label>
                  <input type="password" value={clientAccount.password} onChange={(e) => setClientAccount({ ...clientAccount, password: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500" placeholder="Mínimo 8 caracteres" />
                </div>
              </div>
              <button onClick={() => setClientStep(2)} className="w-full mt-6 bg-foreground text-background py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                Crear cuenta
              </button>
            </motion.div>
          )}
          {clientStep === 2 && (
            <motion.div key="c2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
              <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center mx-auto mb-6">
                <Check size={36} className="text-background" />
              </div>
              <h1 className="text-2xl font-display font-bold mb-2">Bienvenido, {clientData.name || "Cliente"}</h1>
              <p className="text-muted-foreground text-sm mb-8">Tu cuenta está lista. Encuentra tu barbería favorita.</p>
              <button onClick={handleClientDone} className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                Buscar Barberías
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
