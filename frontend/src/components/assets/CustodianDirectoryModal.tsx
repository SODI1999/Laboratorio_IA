import { useState } from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { custodianService } from "../../services/custodianService";
import type { Custodian, Asset } from "../../types/asset";
import { Mail, Building, ChevronRight, ArrowLeft } from "lucide-react";

interface CustodianDirectoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  custodians: Custodian[];
  onSelectAsset?: (asset: Asset) => void;
}

export function CustodianDirectoryModal({
  open,
  onOpenChange,
  custodians,
  onSelectAsset,
}: CustodianDirectoryModalProps) {
  const [selectedCustodian, setSelectedCustodian] = useState<Custodian | null>(null);
  const [assignedAssets, setAssignedAssets] = useState<Asset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);

  const handleSelectCustodian = async (custodian: Custodian) => {
    setSelectedCustodian(custodian);
    setLoadingAssets(true);
    try {
      const assets = await custodianService.getCustodianAssets(custodian.id);
      setAssignedAssets(assets);
    } catch {
      setAssignedAssets([]);
    } finally {
      setLoadingAssets(false);
    }
  };

  const handleBackToList = () => {
    setSelectedCustodian(null);
    setAssignedAssets([]);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center space-x-2">
          {selectedCustodian && (
            <button
              onClick={handleBackToList}
              className="mr-1 rounded p-1 hover:bg-slate-100 text-slate-500"
              title="Volver a lista de custodios"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <DialogTitle>
            {selectedCustodian
              ? `Activos a Cargo de: ${selectedCustodian.fullName}`
              : "Directorio de Custodios y Responsables (P05)"}
          </DialogTitle>
        </div>
        <DialogDescription>
          {selectedCustodian
            ? `Listado detallado de equipos y herramientas actualmente en posesión de ${selectedCustodian.department}.`
            : "Consulta del personal autorizado y el volumen de activos corporativos asignados a su custodia."}
        </DialogDescription>
      </DialogHeader>

      <div className="py-2 max-h-[60vh] overflow-y-auto">
        {!selectedCustodian ? (
          /* List of custodians */
          <div className="space-y-3">
            {custodians.map((c) => (
              <div
                key={c.id}
                onClick={() => handleSelectCustodian(c)}
                className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer transition-colors shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-900">{c.fullName}</span>
                    <Badge variant="asignado">{c.assignedAssetsCount || 0} Activos</Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Building className="h-3 w-3" />
                      <span>{c.department}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>{c.email}</span>
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            ))}
          </div>
        ) : (
          /* Assigned assets table */
          <div className="space-y-3">
            {loadingAssets ? (
              <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
                Cargando activos asignados...
              </div>
            ) : assignedAssets.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 border border-dashed rounded-lg">
                Este custodio no tiene activos asignados actualmente.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placa</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Acción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignedAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-mono font-bold text-xs">{asset.assetTag}</TableCell>
                      <TableCell className="text-xs">{asset.name}</TableCell>
                      <TableCell className="text-xs">{asset.category}</TableCell>
                      <TableCell className="text-right">
                        {onSelectAsset && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              onOpenChange(false);
                              onSelectAsset(asset);
                            }}
                            className="h-7 text-xs"
                          >
                            Ver Ficha
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cerrar
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
