import { Eye, UserCheck, RotateCcw, Wrench, CheckCircle, Clock } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { formatCOP, formatDate } from "../../lib/utils";
import type { Asset } from "../../types/asset";

interface AssetTableProps {
  assets: Asset[];
  onViewDetails: (asset: Asset) => void;
  onAssign: (asset: Asset) => void;
  onReturn: (asset: Asset) => void;
  onMaintenance: (asset: Asset) => void;
  onReleaseMaintenance: (asset: Asset) => void;
}

export function AssetTable({
  assets,
  onViewDetails,
  onAssign,
  onReturn,
  onMaintenance,
  onReleaseMaintenance,
}: AssetTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-28 font-mono">Código Placa</TableHead>
            <TableHead>Nombre / Denominación</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Costo (COP)</TableHead>
            <TableHead>Última Revisión</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Responsable (P05)</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow key={asset.id} className="h-16 hover:bg-slate-50/70 transition-colors">
              {/* Placa */}
              <TableCell className="font-mono font-bold text-slate-900">
                {asset.assetTag}
              </TableCell>

              {/* Nombre y Modelo */}
              <TableCell>
                <div className="font-medium text-slate-900">{asset.name}</div>
                <div className="text-xs text-slate-400">
                  {asset.brand} • {asset.model}
                </div>
              </TableCell>

              {/* Categoría */}
              <TableCell>
                <Badge variant="secondary" className="text-[11px] font-normal">
                  {asset.category}
                </Badge>
              </TableCell>

              {/* Ubicación */}
              <TableCell className="text-xs text-slate-600 font-medium">
                {asset.warehouseLocation}
              </TableCell>

              {/* Costo */}
              <TableCell className="font-mono text-xs font-semibold text-slate-900">
                {formatCOP(asset.acquisitionCost)}
              </TableCell>

              {/* Última Inspección & Antigüedad */}
              <TableCell>
                <div className="text-xs text-slate-700">{formatDate(asset.lastInspectionDate)}</div>
                {asset.isOlderThan90Days && (
                  <Badge variant="warning" className="text-[10px] mt-0.5 space-x-1 py-0">
                    <Clock className="h-2.5 w-2.5 inline" />
                    <span>&gt; 90d</span>
                  </Badge>
                )}
              </TableCell>

              {/* Estado */}
              <TableCell>
                {asset.status === 'DISPONIBLE' && <Badge variant="disponible">DISPONIBLE</Badge>}
                {asset.status === 'ASIGNADO' && <Badge variant="asignado">ASIGNADO</Badge>}
                {asset.status === 'EN_MANTENIMIENTO' && <Badge variant="mantenimiento">TALLER</Badge>}
                {asset.status === 'DE_BAJA' && <Badge variant="baja">DE BAJA</Badge>}
              </TableCell>

              {/* Custodio (P05) */}
              <TableCell>
                {asset.custodian ? (
                  <div>
                    <span className="text-xs font-semibold text-blue-900">{asset.custodian.fullName}</span>
                    <p className="text-[11px] text-slate-400">{asset.custodian.department}</p>
                  </div>
                ) : asset.serviceProvider ? (
                  <div>
                    <span className="text-xs font-medium text-amber-900">{asset.serviceProvider}</span>
                    <p className="text-[11px] text-amber-700 truncate max-w-[140px]">{asset.maintenanceReason}</p>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400 italic">En bodega</span>
                )}
              </TableCell>

              {/* Acciones */}
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onViewDetails(asset)}
                    title="Ver ficha técnica completa"
                    className="h-8 px-2"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>

                  {/* Contextual actions based on status */}
                  {asset.status === 'DISPONIBLE' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onAssign(asset)}
                        title="Asignar a empleado/custodio"
                        className="h-8 px-2 text-blue-700 hover:text-blue-900 hover:bg-blue-50 border-blue-200"
                      >
                        <UserCheck className="h-3.5 w-3.5 mr-1" />
                        <span className="text-xs">Asignar</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onMaintenance(asset)}
                        title="Enviar a mantenimiento preventivo"
                        className="h-8 px-2 text-amber-700 hover:bg-amber-50"
                      >
                        <Wrench className="h-3.5 w-3.5" />
                      </Button>
                    </>
                  )}

                  {asset.status === 'ASIGNADO' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onReturn(asset)}
                      title="Registrar devolución a bodega"
                      className="h-8 px-2 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 border-emerald-200"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Retornar</span>
                    </Button>
                  )}

                  {asset.status === 'EN_MANTENIMIENTO' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onReleaseMaintenance(asset)}
                      title="Liberar de mantenimiento y renovar inspección"
                      className="h-8 px-2 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 border-emerald-200"
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Liberar (P10)</span>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
