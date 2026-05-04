import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useListServices, getListServicesQueryKey, useCreateService } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Scissors, Clock, X } from "lucide-react";

const BARBERSHOP_ID = 1;

export default function AdminServices() {
  const { data: services = [], isLoading } = useListServices(BARBERSHOP_ID, {
    query: { queryKey: getListServicesQueryKey(BARBERSHOP_ID), enabled: true }
  });
  const createService = useCreateService();
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", durationMinutes: 30, price: 0 });

  const handleCreate = () => {
    createService.mutate(
      { barbershopId: BARBERSHOP_ID, data: { ...form, price: Number(form.price) } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListServicesQueryKey(BARBERSHOP_ID) });
          setShowModal(false);
          setForm({ name: "", description: "", durationMinutes: 30, price: 0 });
        }
      }
    );
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Servicios</h1>
            <p className="text-sm text-muted-foreground mt-1">Gestiona los servicios de tu barbería</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} /> Nuevo servicio
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted rounded-2xl animate-pulse" />)}
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Scissors size={24} className="text-muted-foreground" />
            </div>
            <p className="font-semibold">Sin servicios</p>
            <p className="text-sm text-muted-foreground mt-1">Agrega el primer servicio de tu barbería</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Servicio</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Descripción</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Duración</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Precio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
                          <Scissors size={15} className="text-indigo-600" />
                        </div>
                        <span className="font-semibold text-sm">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground hidden sm:table-cell max-w-xs truncate">{s.description}</td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-muted px-2.5 py-1 rounded-full">
                        <Clock size={11} /> {s.durationMinutes}min
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-mono font-semibold text-sm">${(s.price / 1000).toFixed(0)}K</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg">Nuevo servicio</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-muted rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1.5">Nombre *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 bg-background"
                  placeholder="Ej: Fade + Barba" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Descripción</label>
                <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 bg-background"
                  placeholder="Descripción breve del servicio" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1.5">Duración (min)</label>
                  <input type="number" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 bg-background" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Precio (COP)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 bg-background" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-border py-3 rounded-xl text-sm font-semibold hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleCreate} disabled={createService.isPending || !form.name}
                className="flex-[2] bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50">
                {createService.isPending ? "Guardando..." : "Guardar servicio"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
