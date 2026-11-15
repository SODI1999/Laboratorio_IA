import { Boxes, LayoutDashboard, TableProperties, Users } from "lucide-react";
import { Badge } from "../ui/badge";

export type ActiveTab = 'dashboard' | 'catalog' | 'custodians';

interface TopNavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingRecommendationsCount?: number;
}

export function TopNavbar({ activeTab, onTabChange, pendingRecommendationsCount = 0 }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold tracking-tight text-slate-900">BodegaCore</span>
              <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider py-0 px-1.5 border-slate-200 text-slate-600">
                v1.0 MVP
              </Badge>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Gestión Industrial de Activos y Mantenimiento</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2" aria-label="Navegación principal">
          <button
            onClick={() => onTabChange('dashboard')}
            className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
            {pendingRecommendationsCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-800">
                {pendingRecommendationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('catalog')}
            className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'catalog'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <TableProperties className="h-4 w-4" />
            <span>Catálogo</span>
          </button>

          <button
            onClick={() => onTabChange('custodians')}
            className={`flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === 'custodians'
                ? 'bg-slate-100 text-slate-900 font-semibold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Custodios</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
