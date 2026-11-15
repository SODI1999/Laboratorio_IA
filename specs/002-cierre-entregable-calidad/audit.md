# [DEBT-002] Cierre de Entregable, Limpieza Técnica y Alineación Documental

- **Tipo**: `debt`
- **Ruta Fit**: `STANDARD`
- **Estado**: Especificado (pendiente de `/omni-plan` e implementación)
- **Fecha**: 2026-11-15

---

## 1. Evidencia y Costo Actual (Hallazgos Observados)

Auditoría frente a [Guia_Laboratorio_IA.pdf](../../Guia_Laboratorio_IA.pdf) (Sección 7 *Entregables*, Fases 4–8 y *Anexo A. Checklist de entrega*):

| Área | Evidencia Observada / Ejecutada | Riesgo / Deuda frente a la Rúbrica |
| :--- | :--- | :--- |
| **UI estática residual (`Showcase UI`)** | [TopNavbar.tsx](../../frontend/src/components/shared/TopNavbar.tsx#L75-L85) y [App.tsx](../../frontend/src/App.tsx#L67-L69) exponen [ComponentShowcase.tsx](../../frontend/src/views/ComponentShowcase.tsx), que renderiza datos hardcoded (`ACT-001` y 4 custodios fijos) sin persistencia. | Incumple el criterio del Anexo A: *"Los datos que aparecen en la interfaz proceden del backend"* y expone un workbench temporal en la navegación principal. |
| **Warnings de Linter Frontend y `any` explícitos** | `npm run lint` (`oxlint`) ejecutado en `frontend/` reporta `0` errores y `5` warnings `react(set-state-in-effect)` en `DashboardView.tsx:34`, `CatalogView.tsx:76,80`, `CustodiansView.tsx:50` y `AssetModal.tsx:64`. Adicionalmente se observaron `7` anotaciones `: any` en `api.ts` (`9,11,30`), `DashboardView.tsx:26`, `CatalogView.tsx:68`, `CustodiansView.tsx:29` y `AssetModal.tsx:136`. | Deuda de calidad en hooks React (`setState` síncrono dentro de `useEffect`) y ruptura de la regla *Zero Any* declarada en [SPEC-TECNICA.md](../../SPEC-TECNICA.md) §4.1. |
| **Brecha PRD vs. Implementación** | [PRD.md](../../PRD.md#L45) y [PRD.md](../../PRD.md#L68) mencionan edición de activos y marcado manual de bajas (`DE_BAJA`), pero [AssetController.java](../../backend/src/main/java/com/bodegacore/controller/AssetController.java) y [AssetModal.tsx](../../frontend/src/components/assets/AssetModal.tsx) no implementan esos flujos. | Inconsistencia documental entre requisitos declarados del MVP y comportamiento real del prototipo. |
| **`SPEC-TECNICA.md` incompleta** | [SPEC-TECNICA.md](../../SPEC-TECNICA.md) carece de **Plan de Pruebas** (exigido en §6.4.1 y §7 de la guía), omite `GET /api/assets/recommendations`, `CustodiansView.tsx` y componentes recientes, y declara `React 18+` frente a `react ^19.3.1` en [package.json](../../frontend/package.json#L16). | Incumple *"SPEC-TECNICA.md actualizado con decisiones aprobadas"* y la regla de la guía (pág. 3) sobre registrar versiones exactas configuradas. |
| **Hallazgos de calidad y evidencia en vivo** | [README.md](../../README.md) carece de la sección de **Hallazgos de calidad y limitaciones** (Anexo A y Fase 8) y su matriz `P01–P10` omite los casos explícitos de la guía para estados vacío/error, validación de formularios, reinicio de H2 y diseño adaptable. Las capturas `workbench.png` (`581289` B) y `empty-state.png` (`1138815` B) en `specs/001-gestion-activos-bodega/evidence/` son copias idénticas de [mockups/stitch/](../../mockups/stitch). | Faltan evidencia de prueba REST directa en ejecución, capturas reales de la SPA corriendo y documentación formal de limitaciones/deuda técnica. |
| **Control de versiones** | `git status` ejecutado en la raíz retorna `fatal: not a git repository`. No existe `.gitignore` en la raíz (solo en `backend/`, `frontend/` y `specs/`), aunque la configuración global de Git (`user.name`/`user.email`) ya está presente en el entorno local. | La guía (§5) recomienda un repositorio Git local para conservar el historial de cambios del proyecto. |

### Análisis de Blast Radius (`omni-spec blast-radius`)
- **Archivos candidatos analizados**: `ComponentShowcase.tsx`, `App.tsx`, `TopNavbar.tsx`, `DashboardView.tsx`, `CatalogView.tsx`, `CustodiansView.tsx`, `AssetModal.tsx`.
- **Resultado**: Riesgo global `low` (`score: 20.47`, gate: `proceed`), consumidores directos limitados a `App.tsx`, `main.tsx` y `CatalogView.tsx`, con `testCoverage: 0` en frontend (requiere verificación explícita mediante `tsc -b`, `vite build`, `oxlint` e inspección renderizada en navegador).

---

## 2. Decisiones Confirmadas por el Usuario

1. **Showcase UI**: Eliminar completamente `ComponentShowcase.tsx` y su pestaña en `TopNavbar.tsx` / `App.tsx`.
2. **Edición y Bajas (`DE_BAJA`)**: Reclasificarlas a *Fase Futura* en `PRD.md` y documentarlas como limitación del MVP.
3. **Cierre de calidad y evidencias**: Actualizar `SPEC-TECNICA.md` y `README.md`, corregir los `5` warnings de `oxlint`, ejecutar prueba REST directa en vivo y capturar pantallas reales de la aplicación en funcionamiento.
4. **Control de versiones**: Inicializar repositorio Git únicamente local (sin remoto) con commit inicial convencional en español.

---

## 3. Scope, Acceptance Criteria (EARS) and Non-Goals

### Alcance Incluido
- Eliminación de `ComponentShowcase.tsx` y limpieza de navegación en `App.tsx` y `TopNavbar.tsx`.
- Corrección de los `5` warnings `react(set-state-in-effect)` en `DashboardView.tsx`, `CatalogView.tsx`, `CustodiansView.tsx` y `AssetModal.tsx` sin alterar la lógica de negocio ni las llamadas REST.
- Alineación documental de `PRD.md`, `SPEC-TECNICA.md` y `README.md` con el código real, versiones exactas, Plan de Pruebas, Matriz de Pruebas completa y sección de Hallazgos de Calidad y Limitaciones.
- Ejecución en vivo de backend (`localhost:8080`) y frontend (`localhost:5173`) para registrar evidencia de petición REST directa y capturas reales de la aplicación.
- Inicialización de `.gitignore` raíz (si no existe) y repositorio Git local con commit inicial convencional.

### Criterios de Aceptación (Sintaxis EARS)

- **AC-01 [functional]**: El sistema DEBERÁ eliminar [ComponentShowcase.tsx](../../frontend/src/views/ComponentShowcase.tsx) y remover la pestaña `showcase` de [TopNavbar.tsx](../../frontend/src/components/shared/TopNavbar.tsx) y [App.tsx](../../frontend/src/App.tsx), de modo que el 100% de las vistas accesibles en la UI consuman datos del backend.
- **AC-02 [functional]**: CUANDO se ejecuten `npm run build` y `npm run lint` en `frontend/`, el proyecto DEBERÁ compilar con `0` errores TypeScript/Vite y `0` warnings en `oxlint` (corrigiendo los `5` warnings `react(set-state-in-effect)` y reemplazando las `7` anotaciones `: any` en `src/` por `unknown`), preservando la carga inicial de métricas, catálogo, custodios y reinicio de formularios en modales.
- **AC-03 [functional]**: CUANDO se ejecute `node run-tests.mjs` desde la raíz del repositorio, las `11` pruebas automatizadas del backend Spring Boot DEBERÁN aprobar sin regresiones (`BUILD SUCCESS`, código de salida `0`).
- **AC-04 [ubiquitous]**: [PRD.md](../../PRD.md) DEBERÁ reclasificar la edición de activos y el marcado manual de bajas (`DE_BAJA`) como elementos de Fase Futura fuera del alcance MVP v1.0, manteniendo trazabilidad exacta con la API implementada.
- **AC-05 [ubiquitous]**: [SPEC-TECNICA.md](../../SPEC-TECNICA.md) DEBERÁ registrar las versiones reales configuradas (`react ^19.3.1`, `vite ^8.3.6`, `typescript ~7.0.2`, `Spring Boot 3.3.5`, Java `17`), incluir `GET /api/assets/recommendations`, actualizar el árbol real de componentes (sin `ComponentShowcase.tsx` e incluyendo `CustodiansView.tsx`, `CustodianDirectoryModal.tsx`, `RecommendationsBanner.tsx`, `SkeletonKPI.tsx`, `SkeletonTable.tsx` y `custodianService.ts`) e incorporar una sección explícita de **Plan de Pruebas**.
- **AC-06 [ubiquitous]**: [README.md](../../README.md) DEBERÁ incorporar una sección dedicada de **Hallazgos de Calidad, Deuda Técnica y Limitaciones** (Fase 8 y Anexo A), actualizar las versiones reales y el árbol del repositorio, y completar la **Matriz de Pruebas** cubriendo explícitamente validación de formularios, estados vacío/error de API, comportamiento de H2 en memoria al reiniciar y diseño adaptable.
- **AC-07 [visual]**: MIENTRAS el backend (`http://localhost:8080`) y el frontend (`http://localhost:5173`) estén activos en vivo, se DEBERÁ registrar evidencia ejecutada de al menos una ruta REST consultada directamente y capturas de pantalla reales de la aplicación web en ejecución (Dashboard, Catálogo, Custodios, estado vacío/modal) guardadas en `specs/002-cierre-entregable-calidad/evidence/`.
- **AC-08 [functional]**: El directorio raíz DEBERÁ estar inicializado como repositorio Git local (sin remotos configurados), con exclusiones apropiadas para artefactos generados (`node_modules/`, `dist/`, `backend/target/`) y un commit inicial siguiendo Conventional Commits con descripción en español.

### Non-Goals (Fuera de Alcance)
- No se implementarán nuevos endpoints de edición (`PUT /api/assets/{id}`) ni transición manual a `DE_BAJA`.
- No se añadirá autenticación ni base de datos persistente externa (se mantiene H2 in-memory).
- No se instalarán librerías externas adicionales en `backend/` ni `frontend/`.
- No se configurarán repositorios remotos ni se ejecutará `git push`.
