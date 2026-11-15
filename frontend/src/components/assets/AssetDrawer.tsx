import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Sheet } from "../ui/sheet";
import { formatCOP, formatDate } from "../../lib/utils";
import type { Asset } from "../../types/asset";
import { UserCheck, RotateCcw, Wrench, CheckCircle, Clock, AlertTriangle, ShieldCheck } from "lucide-react";

interface AssetDrawerProps {
  asset: Asset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign: (asset: Asset) => void;
  onReturn: (asset: Asset) => void;
  onMaintenance: (asset: Asset) => void;
  onReleaseMaintenance: (asset: Asset) => void;
}

export function AssetDrawer({
  asset,
  open,
  onOpenChange,
  onAssign,
  onReturn,
  onMaintenance,
  onReleaseMaintenance,
}: AssetDrawerProps) {
  if (!asset) return null;

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={`Ficha Técnica: ${asset.assetTag}`}
      description="Detalles de hardware, ubicación en bodega y trazabilidad de custodia"
    >
      <div className="space-y-6 text-sm">
        {/* Header Status */}
        <div className="rounded-lg bg-slate-50 p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="font-mono text-lg font-bold text-slate-900">{asset.assetTag}</span>
            {asset.status === 'DISPONIBLE' && <Badge variant="disponible">DISPONIBLE</Badge>}
            {asset.status === 'ASIGNADO' && <Badge variant="asignado">ASIGNADO</Badge>}
            {asset.status === 'EN_MANTENIMIENTO' && <Badge variant="mantenimiento">EN TALLER</Badge>}
            {asset.status === 'DE_BAJA' && <Badge variant="baja">DE BAJA</Badge>}
          </div>
          <h4 className="text-base font-semibold text-slate-800 mt-2">{asset.name}</h4>
          <p className="text-xs text-slate-500">{asset.brand} • {asset.model} (Serie: {asset.serialNumber})</p>
        </div>

        {/* Technical Attributes */}
        <div className="space-y-2.5">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Atributos Operativos</h5>
          <div className="rounded-lg border border-slate-200 divide-y divide-slate-100 text-xs bg-white">
            <div className="flex justify-between p-2.5">
              <span className="text-slate-500">Categoría</span>
              <span className="font-medium text-slate-900">{asset.category}</span>
            </div>
            <div className="flex justify-between p-2.5">
              <span className="text-slate-500">Ubicación Física</span>
              <span className="font-medium text-slate-900">{asset.warehouseLocation}</span>
            </div>
            <div className="flex justify-between p-2.5">
              <span className="text-slate-500">Costo de Adquisición</span>
              <span className="font-semibold text-slate-900">{formatCOP(asset.acquisitionCost)}</span>
            </div>
            <div className="flex justify-between p-2.5">
              <span className="text-slate-500">Fecha de Compra</span>
              <span className="font-medium text-slate-900">{formatDate(asset.purchaseDate)}</span>
            </div>
            <div className="flex justify-between p-2.5">
              <span className="text-slate-500">Última Inspección</span>
              <span className="font-medium text-slate-900">
                {formatDate(asset.lastInspectionDate)} ({asset.daysSinceInspection ?? 0} días)
              </span>
            </div>
          </div>
        </div>

        {/* Inspection & Maintenance Alerts (P04, P06) */}
        {asset.isOlderThan90Days && (
          <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 flex items-start space-x-2.5">
            <Clock className="h-4 w-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Alerta de Antigüedad (&gt; 90 Días):</span> El equipo supera el ciclo estándar de 90 días sin revisión técnica programada en bodega.
            </div>
          </div>
        )}

        {asset.recommendedMaintenance && (
          <div className="rounded-lg border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-900 flex items-start space-x-2.5">
            <AlertTriangle className="h-4 w-4 text-rose-700 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Recomendación Preventiva (P06):</span> Se sugiere programar calibración o envío a taller antes de una nueva asignación.
            </div>
          </div>
        )}

        {!asset.isOlderThan90Days && !asset.recommendedMaintenance && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-900 flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span>Inspección técnica vigente. Equipo en condiciones óptimas.</span>
          </div>
        )}

        {/* Custodian Information (P05) */}
        <div className="space-y-2.5">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Custodia y Responsabilidad (P05)</h5>
          {asset.custodian ? (
            <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 text-xs space-y-1">
              <div className="font-semibold text-blue-950">{asset.custodian.fullName}</div>
              <p className="text-blue-800">Departamento: {asset.custodian.department}</p>
              <p className="text-blue-700">Contacto: {asset.custodian.email}</p>
            </div>
          ) : asset.serviceProvider ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3 text-xs space-y-1">
              <div className="font-semibold text-amber-950">Taller: {asset.serviceProvider}</div>
              <p className="text-amber-800">Diagnóstico: {asset.maintenanceReason}</p>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500 italic">
              Activo actualmente en custodia general de la bodega (sin asignar).
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
          {asset.status === 'DISPONIBLE' && (
            <>
              <Button
                onClick={() => {
                  onOpenChange(false);
                  onAssign(asset);
                }}
                className="w-full space-x-1.5"
              >
                <UserCheck className="h-4 w-4" />
                <span>Asignar a Custodio (P07)</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  onMaintenance(asset);
                }}
                className="w-full space-x-1.5 text-amber-700 border-amber-300 hover:bg-amber-50"
              >
                <Wrench className="h-4 w-4" />
                <span>Enviar a Mantenimiento (P09)</span>
              </Button>
            </>
          )}

          {asset.status === 'ASIGNADO' && (
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onReturn(asset);
              }}
              className="w-full space-x-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Registrar Retorno a Bodega (P08)</span>
            </Button>
          )}

          {asset.status === 'EN_MANTENIMIENTO' && (
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onReleaseMaintenance(asset);
              }}
              className="w-full space-x-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Concluir Mantenimiento y Renovar Inspección (P10)</span>
            </Button>
          )}
        </div>
      </div>
    </Sheet>
  );
}
