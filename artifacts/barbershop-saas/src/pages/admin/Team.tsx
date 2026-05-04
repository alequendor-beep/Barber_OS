import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useListBarbers, getListBarbersQueryKey, useCreateBarber } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, UserCheck, X } from "lucide-react";

const BARBERSHOP_ID = 1;

export default function AdminTeam() {
  const { data: barbers = [], isLoading } = useListBarbers(BARBERSHOP_ID, {
    query: { queryKey: getListBarbersQueryKey(BARBERSHOP_ID), enabled: true }
  });
  const createBarber = useCreateBarber();
  const qc = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "", specialties: "" });

  const handleCreate = () => {
    createBarber.mutate(
      { barbershopId: BARBERSHOP_ID, data: form },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getListBarbersQueryKey(BARBERSHOP_ID) });
          setShowModal(false);
          setForm({ name: "", bio: "", specialties: "" });
        }
      }
    );
  };

  const initials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const colors = ["bg-indigo-100 text-indigo-700", "bg-violet-100 text-violet-700", "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700"];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold">Equipo</h1>
            <p className="text-sm text-muted-foreground mt-1">Gestiona los barberos de tu local</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
            <Plus size={16} /> Agregar barbero
          </button>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse" />)}
          </div>
        ) : barbers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <UserCheck size={24} className="text-muted-foreground" />
            </div>
            <p className="font-semibold">Sin barberos</p>
            <p className="text-sm text-muted-foreground mt-1">Agrega los miembros de tu equipo</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {barbers.map((b, idx) => (
              <div key={b.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-display font-bold mb-4 ${colors[idx % colors.length]}`}>
                  {initials(b.name)}
                </div>
                <h3 className="font-display font-bold text-base">{b.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{b.bio}</p>
                <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
                  {b.specialties.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                    <span key={s} className="text-xs px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full font-medium">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg">Nuevo barbero</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-muted rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1.5">Nombre *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 bg-background"
                  placeholder="Ej: Carlos Mendoza" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 bg-background resize-none h-20"
                  placeholder="Breve descripción del barbero..." />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1.5">Especialidades (separadas por coma)</label>
                <input value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 bg-background"
                  placeholder="Ej: Fade, Barba, Skin Fade" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-border py-3 rounded-xl text-sm font-semibold hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleCreate} disabled={createBarber.isPending || !form.name}
                className="flex-[2] bg-indigo-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50">
                {createBarber.isPending ? "Guardando..." : "Agregar barbero"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
