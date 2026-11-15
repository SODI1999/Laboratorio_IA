import React, { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Textarea } from "../ui/textarea";
import type {
  Asset,
  AssetCategory,
  Custodian,
  AssetCreateFormData,
  AssignFormData,
  ReturnFormData,
  MaintenanceFormData,
  ReleaseMaintenanceFormData,
} from "../../types/asset";

export type ModalMode = 'create' | 'assign' | 'return' | 'maintenance' | 'release' | null;

interface AssetModalProps {
  mode: ModalMode;
  asset: Asset | null;
  custodians: Custodian[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSubmit: (data: AssetCreateFormData) => Promise<void>;
  onAssignSubmit: (id: number, data: AssignFormData) => Promise<void>;
  onReturnSubmit: (id: number, data: ReturnFormData) => Promise<void>;
  onMaintenanceSubmit: (id: number, data: MaintenanceFormData) => Promise<void>;
  onReleaseSubmit: (id: number, data: ReleaseMaintenanceFormData) => Promise<void>;
}

export function AssetModal({
  mode,
  asset,
  custodians,
  open,
  onOpenChange,
  onCreateSubmit,
  onAssignSubmit,
  onReturnSubmit,
  onMaintenanceSubmit,
  onReleaseSubmit,
}: AssetModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states initialized cleanly from props when modal mounts
  const [assetTag, setAssetTag] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<AssetCategory>("COMPUTO");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [warehouseLocation, setWarehouseLocation] = useState(() => {
    if (mode === 'return' && asset) return asset.warehouseLocation || "Pasillo A - Estante 1";
    if (mode === 'release' && asset) return asset.warehouseLocation || "Pasillo B - Estante 2";
    return "Pasillo A - Estante 1";
  });
  const [acquisitionCost, setAcquisitionCost] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [custodianId, setCustodianId] = useState<number | "">(() =>
    mode === 'assign' && custodians.length > 0 ? custodians[0].id : ""
  );
  const [serviceProvider, setServiceProvider] = useState(() =>
    mode === 'maintenance' ? "Metrología Andina SAS" : ""
  );
  const [reason, setReason] = useState(() =>
    mode === 'maintenance' ? "Revisión preventiva por alerta de antigüedad > 90 días" : ""
  );
  const [notes, setNotes] = useState(() =>
    mode === 'release' ? "Inspección y calibración completada satisfactoriamente" : ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === 'create') {
        const costNum = parseFloat(acquisitionCost);
        if (isNaN(costNum) || costNum <= 0) {
          throw new Error("El costo de adquisición debe ser mayor a 0.");
        }
        await onCreateSubmit({
          assetTag: assetTag.trim(),
          name: name.trim(),
          category,
          brand: brand.trim(),
          model: model.trim(),
          serialNumber: serialNumber.trim(),
          warehouseLocation: warehouseLocation.trim(),
          acquisitionCost: costNum,
          purchaseDate,
        });
      } else if (mode === 'assign' && asset) {
        if (!custodianId) throw new Error("Debe seleccionar un custodio.");
        await onAssignSubmit(asset.id, {
          custodianId: Number(custodianId),
          notes,
        });
      } else if (mode === 'return' && asset) {
        await onReturnSubmit(asset.id, {
          warehouseLocation: warehouseLocation.trim(),
        });
      } else if (mode === 'maintenance' && asset) {
        if (!serviceProvider.trim() || !reason.trim()) {
          throw new Error("Taller y motivo son obligatorios.");
        }
        await onMaintenanceSubmit(asset.id, {
          serviceProvider: serviceProvider.trim(),
          reason: reason.trim(),
        });
      } else if (mode === 'release' && asset) {
        await onReleaseSubmit(asset.id, {
          warehouseLocation: warehouseLocation.trim(),
          notes: notes.trim(),
        });
      }
      onOpenChange(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocurrió un error al procesar la solicitud.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || !mode) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' && "Registrar Nuevo Activo en Bodega (RF-02)"}
            {mode === 'assign' && `Asignar Activo: ${asset?.assetTag}`}
            {mode === 'return' && `Devolución a Bodega: ${asset?.assetTag}`}
            {mode === 'maintenance' && `Despacho a Mantenimiento: ${asset?.assetTag}`}
            {mode === 'release' && `Liberar de Mantenimiento: ${asset?.assetTag}`}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' && "Diligencie la ficha para ingresar un nuevo equipo al inventario físico."}
            {mode === 'assign' && `Seleccione el empleado responsable de la custodia del equipo (${asset?.name}).`}
            {mode === 'return' && "Confirme la ubicación física en estante para reintegrar el activo a DISPONIBLE."}
            {mode === 'maintenance' && "Registre el taller técnico y motivo. El activo pasará a EN_MANTENIMIENTO."}
            {mode === 'release' && "Se actualizará la fecha de última inspección a la fecha de hoy y volverá a DISPONIBLE."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mb-4 rounded-md bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
            {error}
          </div>
        )}

        {/* MODE: CREATE */}
        {mode === 'create' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Código Placa *</label>
              <Input
                required
                placeholder="Ej. ACT-021"
                value={assetTag}
                onChange={(e) => setAssetTag(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Categoría *</label>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as AssetCategory)}
              >
                <option value="COMPUTO">Equipos de Cómputo</option>
                <option value="HERRAMIENTAS">Herramientas Especializadas</option>
                <option value="REDES_TI">Redes y Telecom</option>
                <option value="MAQUINARIA_LIVIANA">Maquinaria Liviana</option>
              </Select>
            </div>
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700">Nombre / Denominación *</label>
              <Input
                required
                placeholder="Ej. Laptop ThinkPad T14s Gen 4"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Marca *</label>
              <Input
                required
                placeholder="Ej. Lenovo"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Modelo *</label>
              <Input
                required
                placeholder="Ej. T14s"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Número de Serie *</label>
              <Input
                required
                placeholder="Ej. SN-998234"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Ubicación en Bodega *</label>
              <Input
                required
                placeholder="Ej. Pasillo A - Estante 2"
                value={warehouseLocation}
                onChange={(e) => setWarehouseLocation(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Costo Adquisición (COP) *</label>
              <Input
                required
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Ej. 4500000"
                value={acquisitionCost}
                onChange={(e) => setAcquisitionCost(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Fecha de Compra *</label>
              <Input
                required
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* MODE: ASSIGN */}
        {mode === 'assign' && (
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Custodio Responsable (P05) *</label>
              <Select
                required
                value={custodianId}
                onChange={(e) => setCustodianId(Number(e.target.value))}
              >
                <option value="" disabled>Seleccione un custodio</option>
                {custodians.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} — {c.department}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Notas de Asignación / Justificación</label>
              <Textarea
                placeholder="Ej. Equipo entregado para operaciones de campo..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        )}

        {/* MODE: RETURN */}
        {mode === 'return' && (
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Ubicación de Reingreso en Bodega *</label>
              <Input
                required
                placeholder="Ej. Pasillo A - Estante 1"
                value={warehouseLocation}
                onChange={(e) => setWarehouseLocation(e.target.value)}
              />
              <p className="text-[11px] text-slate-500">
                El custodio asignado quedará desvinculado y el activo pasará a DISPONIBLE.
              </p>
            </div>
          </div>
        )}

        {/* MODE: MAINTENANCE */}
        {mode === 'maintenance' && (
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Taller o Proveedor de Servicio Técnico *</label>
              <Input
                required
                placeholder="Ej. Metrología Andina SAS"
                value={serviceProvider}
                onChange={(e) => setServiceProvider(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Motivo del Mantenimiento / Calibración *</label>
              <Textarea
                required
                placeholder="Ej. Calibración periódica y reemplazo de empaque..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}

        {/* MODE: RELEASE */}
        {mode === 'release' && (
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Ubicación en Bodega para Reingreso *</label>
              <Input
                required
                placeholder="Ej. Pasillo B - Estante 3"
                value={warehouseLocation}
                onChange={(e) => setWarehouseLocation(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Notas de Liberación</label>
              <Textarea
                placeholder="Ej. Certificado de calibración N° 4582 emitido conforme..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            variant={mode === 'maintenance' ? 'amber' : 'default'}
          >
            {submitting ? "Procesando..." : "Confirmar Acción"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
