import { useState, useEffect } from "react";
import { TopNavbar, type ActiveTab } from "./components/shared/TopNavbar";
import { DashboardView } from "./views/DashboardView";
import { CatalogView } from "./views/CatalogView";
import { CustodiansView } from "./views/CustodiansView";
import { dashboardService } from "./services/dashboardService";
import type { AssetFilterState, MaintenanceRecommendation } from "./types/asset";

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [catalogFilters, setCatalogFilters] = useState<Partial<AssetFilterState>>({});
  const [recommendationsCount, setRecommendationsCount] = useState<number>(0);

  // Poll or check recommendations count for top badge
  useEffect(() => {
    dashboardService.getDashboardMetrics()
      .then((metrics) => {
        setRecommendationsCount(metrics.recommendations?.length || 0);
      })
      .catch(() => {
        // Backend not ready yet or loading
      });
  }, [activeTab]);

  const handleNavigateToCatalog = (filter?: { criticalOnly?: boolean; olderThan90DaysOnly?: boolean }) => {
    if (filter) {
      setCatalogFilters(filter);
    } else {
      setCatalogFilters({});
    }
    setActiveTab("catalog");
  };

  const handleProgramMaintenance = (_rec: MaintenanceRecommendation) => {
    setCatalogFilters({ olderThan90DaysOnly: true });
    setActiveTab("catalog");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <TopNavbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingRecommendationsCount={recommendationsCount}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "dashboard" && (
          <DashboardView
            onNavigateToCatalog={handleNavigateToCatalog}
            onProgramMaintenance={handleProgramMaintenance}
          />
        )}

        {activeTab === "catalog" && (
          <CatalogView
            key={JSON.stringify(catalogFilters)}
            initialFilters={catalogFilters}
          />
        )}

        {activeTab === "custodians" && (
          <CustodiansView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>BodegaCore Asset Management • Fundamentos de Sistemas de Información</span>
          <span className="font-mono text-slate-400">Spring Boot 3.3.5 • React 19 • Tailwind CSS v3 • H2 in-memory</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
