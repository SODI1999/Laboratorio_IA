import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { ErrorAlert } from "../components/shared/ErrorAlert";
import { Skeleton } from "../components/ui/skeleton";
import { custodianService } from "../services/custodianService";
import { formatCOP, formatDate } from "../lib/utils";
import type { Custodian, Asset } from "../types/asset";
import { Mail, Building, UserCheck, Shield } from "lucide-react";

export function CustodiansView() {
  const [custodians, setCustodians] = useState<Custodian[]>([]);
  const [selectedCustodian, setSelectedCustodian] = useState<Custodian | null>(null);
  const [assignedAssets, setAssignedAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCustodiansFlow = useCallback((isActive: () => boolean) => {
    void custodianService
      .getAllCustodians()
      .then((data) => {
        if (!isActive()) return;
        setCustodians(data);
        setError(null);
        if (data.length > 0) {
          setSelectedCustodian(data[0]);
          setLoadingAssets(true);
          return custodianService
            .getCustodianAssets(data[0].id)
            .then((assets) => {
              if (isActive()) {
                setAssignedAssets(assets);
              }
            })
            .catch(() => {
              if (isActive()) {
                setAssignedAssets([]);
              }
            })
            .finally(() => {
              if (isActive()) {
                setLoadingAssets(false);
              }
            });
        }
      })
      .catch((err: unknown) => {
        if (isActive()) {
          setError(err instanceof Error ? err.message : "Error al cargar la lista de custodios.");
        }
      })
      .finally(() => {
        if (isActive()) {
          setLoading(false);
        }
      });
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    loadCustodiansFlow(() => true);
  };

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

  useEffect(() => {
    let active = true;
    loadCustodiansFlow(() => active);
    return () => {
      active = false;
    };
  }, [loadCustodiansFlow]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Directorio de Custodios y Asignaciones (P05)</h1>
        <p className="text-sm text-slate-500 mt-1">
          Consulta y verificación de personal responsable con inventario institucional asignado a su cargo.
        </p>
      </div>

      {error && <ErrorAlert title="Error de conexión" message={error} onRetry={handleRetry} />}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 md:col-span-2 rounded-xl" />
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Custodians List Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Personal Registrado ({custodians.length})
            </h3>
            <div className="space-y-2">
              {custodians.map((c) => {
                const isSelected = selectedCustodian?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => handleSelectCustodian(c)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-slate-900 bg-white shadow-sm ring-1 ring-slate-900"
                        : "border-slate-200 bg-white hover:bg-slate-50/80 shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-slate-900 block">{c.fullName}</span>
                        <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                          <Building className="h-3.5 w-3.5" />
                          <span>{c.department}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                          <Mail className="h-3.5 w-3.5" />
                          <span>{c.email}</span>
                        </div>
                      </div>
                      <Badge variant="asignado" className="text-xs">
                        {c.assignedAssetsCount || 0}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Assigned Assets Detail Column */}
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center space-x-2">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                      <span>{selectedCustodian ? selectedCustodian.fullName : "Custodio"}</span>
                    </CardTitle>
                    <CardDescription>
                      {selectedCustodian?.department} • {selectedCustodian?.email}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="font-mono">
                    {assignedAssets.length} Activos en Custodia
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {loadingAssets ? (
                  <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
                    Consultando registros de inventario...
                  </div>
                ) : assignedAssets.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs border border-dashed rounded-lg">
                    Este custodio no tiene activos asignados actualmente.
                  </div>
                ) : (
                  <div className="rounded-lg border border-slate-200 overflow-hidden shadow-xs">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-mono text-xs">Placa</TableHead>
                          <TableHead className="text-xs">Nombre</TableHead>
                          <TableHead className="text-xs">Categoría</TableHead>
                          <TableHead className="text-xs">Ubicación</TableHead>
                          <TableHead className="text-xs">Costo (COP)</TableHead>
                          <TableHead className="text-xs">Inspección</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assignedAssets.map((asset) => (
                          <TableRow key={asset.id} className="h-12">
                            <TableCell className="font-mono font-bold text-xs">{asset.assetTag}</TableCell>
                            <TableCell className="text-xs">
                              <span className="font-medium text-slate-900">{asset.name}</span>
                              <span className="text-[11px] text-slate-400 block">{asset.brand} {asset.model}</span>
                            </TableCell>
                            <TableCell className="text-xs">
                              <Badge variant="secondary" className="text-[10px] py-0">{asset.category}</Badge>
                            </TableCell>
                            <TableCell className="text-xs text-slate-600">{asset.warehouseLocation}</TableCell>
                            <TableCell className="font-mono text-xs font-medium">{formatCOP(asset.acquisitionCost)}</TableCell>
                            <TableCell className="text-xs text-slate-600">{formatDate(asset.lastInspectionDate)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <div className="mt-6 rounded-lg bg-blue-50/50 border border-blue-100 p-3 text-xs text-blue-900 flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span>
                    El custodio asume responsabilidad contractual y de uso preventivo de los equipos asignados durante su jornada operativa.
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
