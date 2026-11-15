# [PLAN-001] Plan Técnico y Arquitectura de Implementación

Fecha: 2026-11-11  
Especificación Activa: `001-gestion-activos-bodega`  
Ruta Fit: FULL  

---

## Evidence and existing architecture

- **Línea base observada**: Proyecto greenfield en `c:\dev\Laboratorio_IA`. No existe código fuente previo de aplicación en el repositorio.
- **Runtimes verificados en host Windows**:
  - Java: OpenJDK 25.0.4.1 Temurin LTS (`java -version`, código 0).
  - Node.js: v24.22.1 (`node -v`, código 0).
  - npm: 11.19.1 (`npm -v`, código 0).
  - Maven global ausente en PATH; se requiere imperativamente el uso de Maven Wrapper (`mvnw.cmd`) en el módulo backend.
- **Artefactos de especificación previos**:
  - [PRD.md](../../PRD.md): Requerimientos de producto, reglas de negocio y alcance MVP.
  - [design.md](../../design.md): Sistema de diseño BodegaCore Industrial Asset.
  - Mockups aprobados en `mockups/stitch/`: [dashboard.html](../../mockups/stitch/dashboard.html), [catalogo.html](../../mockups/stitch/catalogo.html), [modal_asignacion.html](../../mockups/stitch/modal_asignacion.html).
  - [SPEC-TECNICA.md](../../SPEC-TECNICA.md): Especificación técnica exhaustiva actualizada.

---

## Proposed change

Implementación desacoplada y proporcional de 2 módulos independientes con enfoque de componentes atómicos tipados:

```
c:\dev\Laboratorio_IA\
├── backend/                  # API REST en Spring Boot 3.x (Java)
│   ├── mvnw.cmd              # Maven Wrapper para Windows
│   ├── pom.xml               # Dependencias (Web, Data JPA, H2, Validation)
│   └── src/main/java/com/bodegacore/
│       ├── controller/       # Endpoints REST (AssetController, DashboardController, CustodianController)
│       ├── service/          # Reglas de negocio (AssetService, DashboardService)
│       ├── repository/       # Repositorios JPA (AssetRepository, CustodianRepository)
│       ├── model/            # Entidades JPA (Asset, Custodian, AssetStatus, AssetCategory)
│       ├── exception/        # GlobalExceptionHandler y excepciones de negocio
│       └── config/           # DataInitializer (precarga de 20 datos en H2) y CorsConfig
└── frontend/                 # Aplicación cliente React con Vite + TypeScript + Tailwind + shadcn/ui
    ├── package.json          # Dependencias React 19 (19.3.1), TypeScript, Lucide React, Tailwind
    ├── tsconfig.json         # Configuración TypeScript con paths (@/components/...)
    ├── tailwind.config.js    # Tokens sincronizados con design.md
    └── src/
        ├── types/            # Contratos de tipos estrictos (asset.ts)
        ├── lib/              # Utilidad cn() (clsx + tailwind-merge)
        ├── components/
        │   ├── ui/           # Primitivas atómicas shadcn/ui (button, card, badge, dialog, sheet, table, tabs, skeleton)
        │   ├── shared/       # TopNavbar, EmptyState, ErrorAlert
        │   └── assets/       # KPISection, DistributionBar, AssetTable, AssetFilters, AssetModal, AssetDrawer
        ├── views/
        │   ├── ComponentShowcase.tsx # Workbench aislado para previsualizar componentes antes de integrar
        │   ├── DashboardView.tsx     # Vista Dashboard Ejecutivo
        │   └── CatalogView.tsx       # Vista Catálogo e Inventario
        └── services/         # api.ts, assetService.ts, dashboardService.ts
```

---

## Contracts and compatibility

### API REST Endpoints

| Método | Endpoint | Parámetros / Payload | Respuesta Exitosa | Códigos de Error | Caso Guía |
| :--- | :--- | :--- | :--- | :--- | :---: |
| `GET` | `/api/dashboard` | Ninguno | `200 OK` (JSON con KPIs, valorización total, estados, activos >90d y recomendaciones de mantenimiento) | `500` | P01, P06 |
| `GET` | `/api/assets` | Query params: `category`, `status`, `critical` (boolean), `olderThan90Days` (boolean), `search` (string) | `200 OK` (Lista de activos filtrada) | `400` | P01, P03, P04 |
| `GET` | `/api/assets/{id}` | Path: `id` | `200 OK` (Ficha técnica del activo con flags de inspección) | `404` | P01, P05 |
| `POST` | `/api/assets` | JSON: `assetTag`, `name`, `category`, `brand`, `model`, `serialNumber`, `location`, `acquisitionCost`, `purchaseDate` | `201 Created` (Activo persistido en H2) | `400` (tag duplicado o costo $\le 0$) | P02 |
| `PUT` | `/api/assets/{id}/assign` | JSON: `custodianId`, `notes` | `200 OK` (Estado transiciona a `ASIGNADO`) | `400` (si estado $\neq$ `DISPONIBLE`), `404` | P07 |
| `PUT` | `/api/assets/{id}/return` | JSON: `warehouseLocation` | `200 OK` (Estado transiciona a `DISPONIBLE`) | `400`, `404` | P08 |
| `PUT` | `/api/assets/{id}/maintenance` | JSON: `serviceProvider`, `reason` | `200 OK` (Estado transiciona a `EN_MANTENIMIENTO`) | `400`, `404` | P09 |
| `PUT` | `/api/assets/{id}/release-maintenance` | JSON: `warehouseLocation`, `notes` | `200 OK` (Estado transiciona a `DISPONIBLE`, renueva inspección) | `400`, `404` | P10 |
| `GET` | `/api/custodians` | Ninguno | `200 OK` (Lista de custodios/empleados con métricas de asignación) | `500` | P05 |
| `GET` | `/api/custodians/{id}/assets` | Path: `id` | `200 OK` (Activos actualmente asignados al custodio) | `404` | P05 |

---

## Observability

- **Registro estructurado (SLF4J / Logback)**:
  - Evento `[AUDIT_ASSET_CREATED]`: `assetTag`, `category`, `cost`, `timestamp`.
  - Evento `[AUDIT_ASSET_ASSIGNED]`: `assetTag`, `custodianId`, `timestamp`.
  - Evento `[AUDIT_MAINTENANCE_DISPATCH]`: `assetTag`, `serviceProvider`, `timestamp`.
- **Códigos de Fallo y Criterios asociados**:
  - `400 BAD_REQUEST`: Monitoreado por `AC-03` y `AC-04`.
  - `404 NOT_FOUND`: Manejado cuando un recurso o custodio no existe.
  - `409 CONFLICT`: Monitoreado por `AC-01`.

---

## Technology, setup and documentation decisions

- **Backend**: Spring Boot 3.x, Spring Web, Spring Data JPA, H2 Database 2.x, Hibernate Validator.
  - Configuración H2: `jdbc:h2:mem:bodegadb;DB_CLOSE_DELAY=-1` (persistencia volátil en memoria para la sesión activa).
  - Consola H2 habilitada en `/h2-console` para inspección técnica local.
  - Precarga de 20 registros iniciales representativos mediante `DataInitializer.java`.
- **Frontend**: React 19 (19.3.1), TypeScript (`.tsx`), Vite, Tailwind CSS con configuración alineada a `design.md`, primitivas atómicas estilo shadcn/ui y directrices de *Better UI* (Jaku).
- **Convención de Documentación**: Javadoc riguroso en servicios y controladores REST de Spring Boot. TSDoc en componentes y servicios de React.
- **Convención de Commits**: Conventional Commits 1.0.0 (`feat`, `fix`, `refactor`, etc.) con descripción en español.

---

## UI & Interaction Design

- **Sistema de diseño**: BodegaCore Industrial Asset ([design.md](../../design.md)).
- **Component Workbench**:
  - `ComponentShowcase.tsx`: Vista aislada de componentes que se desplegará antes de montar las vistas completas para validar visualmente:
    * Botones (variantes, tamaños, micro-interacción `active:scale-[0.96]`).
    * Badges de los 4 estados operativos.
    * Inputs, Selects y Textareas con focus rings accesibles.
    * Skeletons contextuales con dimensiones estables (CLS = 0).
    * Diálogo modal (`Dialog`) y Drawer lateral (`Sheet`) con contención de scroll (`overscroll-behavior: contain`).
- **Matriz de los 4 Estados**:
  - *Loading*: `SkeletonTable.tsx` y `SkeletonKPI.tsx` con dimensiones fijas (`AC-08`).
  - *Empty*: `EmptyState.tsx` con botón de reseteo de filtros (`AC-09`).
  - *Error*: `ErrorAlert.tsx` con mensaje claro y botón de reintento (`AC-10`).
  - *Ideal*: Datos consolidados de los 20 registros del backend.

---

## Verification

Mapeo formal de criterios de aceptación a pruebas ejecutables:

| Criterio | Tipo | Método | Prueba de Verificación Planificada | Directorio de Trabajo |
| :--- | :--- | :--- | :--- | :--- |
| **AC-01** | functional | automated | `AssetRepositoryTest.testUniqueAssetTagConstraint` | `backend` (`mvnw.cmd test`) |
| **AC-02** | functional | automated | `AssetControllerIntegrationTest.testCreateAssetSuccess201` | `backend` (`mvnw.cmd test`) |
| **AC-03** | functional | automated | `AssetControllerIntegrationTest.testCreateAssetValidationErrors400` | `backend` (`mvnw.cmd test`) |
| **AC-04** | functional | automated | `AssetServiceTest.testCannotAssignAssetInMaintenanceOrDeBaja` | `backend` (`mvnw.cmd test`) |
| **AC-05** | functional | automated | `DashboardControllerIntegrationTest.testGetDashboardMetrics` | `backend` (`mvnw.cmd test`) |
| **AC-06** | functional | automated | `AssetRepositoryTest.testFindCriticalAssetsOlderThan90Days` | `backend` (`mvnw.cmd test`) |
| **AC-07** | functional | automated | `AssetServiceTest.testAssignAssetTransitionsToAsignado` | `backend` (`mvnw.cmd test`) |
| **AC-08** | visual | manual | Inspección visual en navegador de `SkeletonTable` y `SkeletonKPI` (CLS = 0) en `ComponentShowcase` | `frontend` |
| **AC-09** | visual | manual | Búsqueda sin coincidencias (`ACT-999`) y verificación de renderizado de `EmptyState` | `frontend` |
| **AC-10** | interaction | manual | Verificación de renderizado de `ErrorBanner` con backend desconectado y reintento | `frontend` |
| **AC-11** | accessibility | manual | Auditoría con Chrome DevTools de contrastes WCAG 2.2 AA y atributos `aria-label` | `frontend` |

---

## Rollback / recovery

Proyecto en desarrollo inicial local (greenfield). El estado de la base de datos es en memoria (H2 volátil), por lo que cualquier fallo o reversión se soluciona reiniciando la aplicación o descartando cambios locales mediante control de versiones sin riesgo de pérdida de datos persistentes.
