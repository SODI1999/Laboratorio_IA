# [TASKS-001] Tareas de Implementación y Verificación

Plan de tareas ordenado para la especificación `001-gestion-activos-bodega` (Ruta FULL).

---

## Fase 1: Scaffolding de Backend, Entidades y Persistencia H2

- [x] **TASK-01 / AC-01**: Inicializar estructura Maven en `backend/` con `mvnw.cmd` y dependencias (`spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `h2database`, `spring-boot-starter-validation`, `spring-boot-starter-test`). Implementar modelo JPA (`Asset.java`, `Custodian.java`, `AssetStatus.java`, `AssetCategory.java`) con restricción de unicidad en `assetTag`, y repositorios `AssetRepository.java` y `CustodianRepository.java`. Escribir y ejecutar `AssetRepositoryTest.testUniqueAssetTagConstraint`.
  - *Archivos afectados*: `backend/pom.xml`, `backend/src/main/java/com/bodegacore/model/*`, `backend/src/main/java/com/bodegacore/repository/*`, `backend/src/test/java/com/bodegacore/repository/AssetRepositoryTest.java`.
  - *Verificación*: `mvnw.cmd test -Dtest=AssetRepositoryTest#testUniqueAssetTagConstraint`.

---

## Fase 2: Servicios de Negocio, Precarga H2 y Pruebas Unitarias

- [x] **TASK-02 / AC-04, AC-06, AC-07**: Implementar `AssetService.java` con lógica de cambio de estados (`assignAsset`, `returnToWarehouse`, `sendToMaintenance`, `releaseMaintenance`), validación de prohibición de asignación para activos en mantenimiento o de baja, consultas para filtros desacoplados (`findByStatusIn` para P03 y `findByLastInspectionDateBefore` para P04), y regla de negocio para recomendaciones de mantenimiento preventivo (P06). Escribir y ejecutar `AssetRepositoryTest.testFindCriticalAssetsOlderThan90Days`, `AssetServiceTest.testCannotAssignAssetInMaintenanceOrDeBaja`, `AssetServiceTest.testAssignAssetTransitionsToAsignado` y `AssetServiceTest.testPreventiveMaintenanceRecommendationRule`.
  - *Archivos afectados*: `backend/src/main/java/com/bodegacore/service/AssetService.java`, `backend/src/test/java/com/bodegacore/service/AssetServiceTest.java`, `backend/src/test/java/com/bodegacore/repository/AssetRepositoryTest.java`.
  - *Verificación*: `mvnw.cmd test -Dtest=AssetServiceTest,AssetRepositoryTest`.

- [x] **TASK-03 / AC-05**: Implementar `DashboardService.java` para cálculo agregado de KPIs (total activos, valorización económica total, tasa de disponibilidad %, desglose de estados, conteo de activos >90d sin inspección y lista de recomendaciones inteligentes de mantenimiento preventivo para P06). Implementar `DataInitializer.java` con la precarga de exactamente 20 registros iniciales representativos en H2 (10 disponibles, 6 asignados, 3 en mantenimiento, 1 de baja, con $\ge 4$ activos con >90 días).
  - *Archivos afectados*: `backend/src/main/java/com/bodegacore/service/DashboardService.java`, `backend/src/main/java/com/bodegacore/config/DataInitializer.java`, `backend/src/main/resources/application.properties`.
  - *Verificación*: Inspección de arranque en H2 y logs de precarga.

---

## Fase 3: Controladores REST, Validaciones y Manejo de Errores

- [x] **TASK-04 / AC-02, AC-03, AC-05, AC-07**: Implementar controladores REST (`AssetController.java`, `DashboardController.java`, `CustodianController.java` con endpoints `/api/custodians` y `/api/custodians/{id}/assets` para P05, y `/api/assets/{id}/release-maintenance` para P10), `GlobalExceptionHandler.java` (mapeo RFC 7807 para 400 Bad Request y 404 Not Found) y configuración CORS en `CorsConfig.java`. Escribir y ejecutar `AssetControllerIntegrationTest.testCreateAssetSuccess201`, `AssetControllerIntegrationTest.testCreateAssetValidationErrors400`, `AssetControllerIntegrationTest.testFilterByAntiquityOlderThan90Days` y `DashboardControllerIntegrationTest.testGetDashboardMetrics`.
  - *Archivos afectados*: `backend/src/main/java/com/bodegacore/controller/*`, `backend/src/main/java/com/bodegacore/exception/*`, `backend/src/main/java/com/bodegacore/config/CorsConfig.java`, `backend/src/test/java/com/bodegacore/controller/*`.
  - *Verificación*: `mvnw.cmd test -Dtest=AssetControllerIntegrationTest,DashboardControllerIntegrationTest`.

---

## Fase 4: Scaffolding de Frontend, Tipos TypeScript y Componentes Atómicos shadcn/ui

- [x] **TASK-05 / AC-08, AC-11**: Inicializar aplicación React con Vite y TypeScript en `frontend/`, configurar Tailwind CSS con tokens de `design.md`, utilidades `cn()` en `src/lib/utils.ts` y contratos de tipos en `src/types/asset.ts`. Implementar primitivas atómicas en `src/components/ui/` (`button.tsx` con micro-interacción `active:scale-[0.96]`, `card.tsx`, `badge.tsx`, `input.tsx`, `select.tsx`, `textarea.tsx`, `table.tsx`, `dialog.tsx`, `sheet.tsx`, `skeleton.tsx`, `tabs.tsx`).
  - *Archivos afectados*: `frontend/package.json`, `frontend/tsconfig.json`, `frontend/tailwind.config.js`, `frontend/src/types/asset.ts`, `frontend/src/lib/utils.ts`, `frontend/src/components/ui/*`.
  - *Verificación*: Compilación limpia `npm run build` sin errores de tipos TypeScript.

---

## Fase 5: Página Workbench (Component Showcase) y Auditoría Visual Aislada

- [x] **TASK-06 / AC-08, AC-09, AC-10, AC-11**: Implementar `ComponentShowcase.tsx` y componentes de estado (`SkeletonTable.tsx`, `EmptyState.tsx`, `ErrorAlert.tsx`, `TopNavbar.tsx`). Desplegar la vista de previsualización para auditar en navegador: catálogo de botones y badges en todos sus estados, badges de recomendación de mantenimiento (P06), simulación de los 4 estados de UI (Loading con CLS = 0, Empty con CTA, Error con reintento, Ideal), y prueba interactiva del modal de asignación y drawer lateral de detalle antes de conectar con el backend.
  - *Archivos afectados*: `frontend/src/views/ComponentShowcase.tsx`, `frontend/src/components/shared/*`, `frontend/src/App.tsx`.
  - *Verificación*: Inspección visual en navegador (`npm run dev`) y comprobación de accesibilidad WCAG 2.2 AA.

---

## Fase 6: Vistas Finales (Dashboard & Catálogo), Integración REST y Cierre del Laboratorio

- [x] **TASK-07 / AC-02, AC-05, AC-06, AC-07**: Implementar servicios cliente (`api.ts`, `assetService.ts`, `dashboardService.ts`, `custodianService.ts`). Construir `DashboardView.tsx` (con banner de sugerencias de mantenimiento preventivo para P06 y KPIs de P01) y `CatalogView.tsx` con filtros desacoplados para estado crítico (P03) y antigüedad >90 días (P04). Integrar el modal de asignación/mantenimiento (`AssetModal.tsx`), el drawer de ficha rápida con consulta de custodio (`AssetDrawer.tsx` para P05) y el directorio de custodios (`CustodianDirectoryModal.tsx`).
  - *Archivos afectados*: `frontend/src/services/*`, `frontend/src/views/DashboardView.tsx`, `frontend/src/views/CatalogView.tsx`, `frontend/src/components/assets/*`, `frontend/src/App.tsx`.
  - *Verificación*: Flujo integrado completo en navegador: consulta de dashboard, filtrado por categorías, filtro de estado crítico (P03), filtro de >90 días (P04), consulta de custodio (P05), alerta de mantenimiento preventivo (P06), asignación de activo (P07), devolución (P08), envío a taller (P09) y liberación de mantenimiento (P10).

- [x] **TASK-08 / AC-01 a AC-11**: Ejecutar suite completa de pruebas en backend (`mvnw.cmd test`), validar exhaustivamente las pruebas funcionales P01 a P10 de la guía de laboratorio, redactar `README.md` con instrucciones reproducibles de despliegue local (backend y frontend) y completar la matriz de verificación en `verification.md`.
  - *Archivos afectados*: `README.md`, `specs/001-gestion-activos-bodega/verification.md`.
  - *Verificación*: Suite de pruebas automatizadas en verde y checklist de pruebas P01 a P10 diligenciado con evidencia observable.
