# [MIGRATION-002] Plan de Limpieza, Alineación Documental y Cierre de Entregable

- **Especificación**: `002-cierre-entregable-calidad`
- **Ruta Fit**: `STANDARD`
- **Fecha**: 2026-11-15

---

## 1. Estrategia y Contratos

### 1.1 Secuencia de Ejecución Proporcional
1. **Limpieza de UI Estática (`AC-01`)**:
   - Eliminar [ComponentShowcase.tsx](../../frontend/src/views/ComponentShowcase.tsx).
   - Actualizar [TopNavbar.tsx](../../frontend/src/components/shared/TopNavbar.tsx): remover tipo `'showcase'` de `ActiveTab`, remover import `Palette` y el botón `Showcase UI`.
   - Actualizar [App.tsx](../../frontend/src/App.tsx): remover import y render condicional de `ComponentShowcase`.
2. **Corrección de Linter y Tipado Estricto (`AC-02`)**:
   - **`api.ts`**: reemplazar `data: any` / `errorData: any` por `unknown` y extraer `detail`/`title`/`message` mediante type guard seguro (`Record<string, unknown>`).
   - **`DashboardView.tsx` y `CustodiansView.tsx`**: mover la carga inicial asíncrona dentro de `useEffect` con bandera de cancelación (`let active = true`) sin invocar `setState` síncrono en el cuerpo del efecto; mantener `setLoading(true); setError(null)` exclusivamente en `handleRetry` (evento de usuario). Reemplazar `catch (err: any)` por `catch (err: unknown)`.
   - **`CatalogView.tsx`**: inicializar `loading` en `true`; mover el `setLoading(true)` a los manejadores de eventos (`handleFilterChange`, `handleResetFilters`, `handleRetry`) y ejecutar las peticiones de custodios y activos dentro de `useEffect` con bandera de cancelación. Reemplazar `catch (err: any)` por `catch (err: unknown)`.
   - **`AssetModal.tsx`**: extraer el estado inicial del formulario a la inicialización directa de `useState(...)` y montar `AssetModal` condicionalmente desde `CatalogView.tsx` (`{modalMode !== null && <AssetModal key={...} ... />}`) o resetear mediante `key` interno en el contenido del formulario, eliminando por completo el `useEffect` de reseteo de estado. Reemplazar `catch (err: any)` por `catch (err: unknown)`.
3. **Contrato de Interfaz y Dirección de Arte (según `omni-spec guide design`)**:
   - **Arquetipo estético**: *Precisión Industrial Sobria* (heredado sin cambios de [design.md](../../design.md)); cero clichés de IA, paleta Slate/Emerald/Amber/Blue/Red con bordes de `1px`.
   - **Superficies y estados**: al retirar `Showcase UI`, las 3 vistas visibles (`Dashboard`, `Catálogo`, `Custodios`) mantienen los 4 estados aplicables (`Loading` con skeletons CLS=0, `Empty` con CTA, `Error` con reintento, `Ideal` con datos reales de H2; `Protected` es N/A documentado al no haber autenticación en v1.0).
   - **Contratos API/Backend**: sin cambios en backend Java ni en rutas REST (`AC-03`).
4. **Alineación Documental (`AC-04`, `AC-05`, `AC-06`)**:
   - **[PRD.md](../../PRD.md)**: mover edición de activos y marcado manual de bajas (`DE_BAJA`) a Fase Futura / exclusiones v1.0 para coincidir exactamente con la API implementada.
   - **[SPEC-TECNICA.md](../../SPEC-TECNICA.md)**: actualizar versiones exactas (`react ^19.3.1`, `vite ^8.3.6`, `typescript ~7.0.2`, `Spring Boot 3.3.5`, bytecode Java `17`), agregar `GET /api/assets/recommendations` en §3.1, actualizar árbol de componentes en §4.3 (sin `ComponentShowcase.tsx` e incluyendo `CustodiansView.tsx`, `CustodianDirectoryModal.tsx`, `RecommendationsBanner.tsx`, `SkeletonKPI.tsx`, `SkeletonTable.tsx`, `custodianService.ts`), ajustar §4.4/§6 como referencia histórica de construcción y agregar la sección completa **Plan de Pruebas**.
   - **[README.md](../../README.md)**: actualizar versiones reales y árbol del repositorio, agregar la sección **Hallazgos de Calidad, Deuda Técnica y Limitaciones** (sin auth, H2 en memoria volátil, consola H2 habilitada solo para dev, edición/baja en fase futura, warning `H2Dialect` en Hibernate, estado de linters) y completar la **Matriz de Pruebas** cubriendo todos los casos de la guía (`P01`–`P10`: datos iniciales, filtros, custodios, recomendaciones, flujos operativos, vacío/error de API, validación de formularios, reinicio de H2 en memoria y diseño adaptable).
5. **Evidencia Ejecutada en Vivo (`AC-07`)**:
   - Levantar backend (`mvnw.cmd spring-boot:run`) y frontend (`npm run dev`).
   - Ejecutar al menos una petición REST directa (`Invoke-RestMethod` / `curl` a `GET http://localhost:8080/api/dashboard` y `GET http://localhost:8080/api/assets`) y registrar salida real.
   - Inspeccionar la app real en navegador con `chrome-devtools-mcp` en viewport desktop (`1280x800`) y móvil (`375x812`) comprobando ausencia de errores de consola, carga real desde backend, estado vacío/validación y diseño adaptable; guardar capturas reales en `specs/002-cierre-entregable-calidad/evidence/`.
6. **Control de Versiones Local (`AC-08`)**:
   - Crear `.gitignore` en la raíz (excluyendo `backend/target/`, `frontend/node_modules/`, `frontend/dist/`, logs y archivos temporales del SO).
   - Ejecutar `git init` y crear commit inicial local en formato Conventional Commits en español (`feat: ...` / `chore: ...`), verificando ausencia de remotos.

### 1.2 Mapa de Archivos Afectados

| Archivo | Acción | Criterio |
| :--- | :--- | :--- |
| `frontend/src/views/ComponentShowcase.tsx` | Eliminar archivo | `AC-01` |
| `frontend/src/components/shared/TopNavbar.tsx` | Quitar tab y tipo `showcase` | `AC-01` |
| `frontend/src/App.tsx` | Quitar import y vista `showcase` | `AC-01` |
| `frontend/src/services/api.ts` | Reemplazar `any` por `unknown` | `AC-02` |
| `frontend/src/views/DashboardView.tsx` | Corregir `useEffect` + `unknown` | `AC-02` |
| `frontend/src/views/CatalogView.tsx` | Corregir `useEffect` + `unknown` + key modal | `AC-02` |
| `frontend/src/views/CustodiansView.tsx` | Corregir `useEffect` + `unknown` | `AC-02` |
| `frontend/src/components/assets/AssetModal.tsx` | Eliminar `useEffect` de reset + `unknown` | `AC-02` |
| `PRD.md` | Reclasificar edición y `DE_BAJA` a Fase Futura | `AC-04` |
| `SPEC-TECNICA.md` | Versiones exactas, endpoint, árbol real y Plan de Pruebas | `AC-05` |
| `README.md` | Hallazgos/Limitaciones, Matriz completa y evidencia real | `AC-06` |
| `.gitignore` (raíz) | Excluir artefactos generados antes de `git init` | `AC-08` |

---

## 2. Observabilidad

| Señal / Evento | Dónde se lee | Criterio que verifica |
| :--- | :--- | :--- |
| `oxlint` (`0 errors, 0 warnings`) | Salida stdout de `npm run lint` en `frontend/` | `AC-02` |
| Compilación TypeScript + bundle Vite | Salida stdout de `npm run build` en `frontend/` | `AC-01`, `AC-02` |
| Resultados JUnit/Spring Boot (`11/11`) | Salida stdout de `node run-tests.mjs` en raíz | `AC-03` |
| Respuesta JSON HTTP `200 OK` | Salida de petición REST directa a `http://localhost:8080/api/dashboard` | `AC-07` |
| Consola navegador + layout en `1280x800` y `375x812` | `chrome-devtools-mcp` (`list_console_messages`, `take_screenshot`) | `AC-07` |
| Estado de repositorio limpio sin remotos | `git status` y `git log -1` / `git remote -v` | `AC-08` |

---

## 3. Verificación y Rollback

### 3.1 Línea Base y Verificación de Regresión
- **Backend (`AC-03`)**: `node run-tests.mjs` (`.\mvnw.cmd test`) ejecuta las 5 clases de prueba existentes (`BodegacoreApplicationTests.java`, `AssetControllerIntegrationTest.java`, `DashboardControllerIntegrationTest.java`, `AssetRepositoryTest.java` y `AssetServiceTest.java`) en `backend/src/test/java/com/bodegacore/`, manteniendo `11/11` pruebas exitosas (`0` fallos).
- **Frontend estático (`AC-01`, `AC-02`)**: sin suite Vitest/Jest en el proyecto; se verifica mediante los checks automatizados `frontend-build` (`npm run build`: `tsc -b && vite build`) y `frontend-lint` (`npm run lint`: `oxlint`) con código `0` y `0` warnings sobre los 38 archivos en `frontend/src/`.
- **Documentación y Git local (`AC-04`, `AC-05`, `AC-06`, `AC-08`)**: verificados mediante el check automatizado `deliverables-check` (aserción de marcadores en `PRD.md`, `SPEC-TECNICA.md`, `README.md`, `.gitignore`, existencia de commit local y ausencia de remotos en `git remote`) más inspección directa.
- **Verificación en vivo y visual (`AC-07`)**: arranque real de Spring Boot (`8080`) y Vite (`5173`), prueba REST directa, recorrido de Dashboard/Catálogo/Custodios/Estado vacío/Modal, prueba de reinicio de H2 (documentada) y revisión responsive en `1280x800` y `375x812`, generando [verification.md](verification.md) y `verification.json` al cierre.

### 3.2 Estrategia de Rollback / Recuperación
- Todos los cambios de código son locales, acotados y reversibles antes del commit final; no existen migraciones de esquema ni base de datos persistente (`H2` in-memory se reinicializa en cada arranque).
- Si la eliminación de `ComponentShowcase.tsx` causara algún fallo de importación, `tsc -b` lo detectará inmediatamente antes de pasar a pruebas en vivo.
- Para `.git`, al inicializarse localmente sin remotos, cualquier ajuste posterior puede revertirse con herramientas estándar de Git local sin afectar sistemas externos.
