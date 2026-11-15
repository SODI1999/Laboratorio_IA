# Evidencia de verificación — `002-cierre-entregable-calidad`

> Nota de transparencia: la implementación y esta verificación de cierre fueron ejecutadas en la misma sesión de trabajo. Todas las limitaciones, advertencias y hallazgos abiertos permanecen explícitos.

## 1. Matriz criterio → evidencia → resultado

| Criterio | Tipo / Método | Evidencia verificada | Resultado | Límites y notas |
| --- | --- | --- | --- | --- |
| **AC-01** Eliminar `ComponentShowcase.tsx` y su pestaña en `TopNavbar` / `App` | `functional` / `automated` (`frontend-build`, `frontend-lint`) + DOM | [App.tsx](../../frontend/src/App.tsx) y [TopNavbar.tsx](../../frontend/src/components/shared/TopNavbar.tsx) compilados sin errores (`tsc -b && vite build`, `oxlint` `0` warnings); DOM en `http://localhost:5173/` muestra únicamente `["Dashboard6", "Catálogo", "Custodios"]`. | Aprobado con límites | Sin suite E2E automática en frontend; ausencia verificada por compilación/linter y DOM en Chrome DevTools. |
| **AC-02** Corregir los 5 warnings de `oxlint` y las 7 anotaciones `: any` | `functional` / `automated` (`frontend-build`, `frontend-lint`) | `npm run lint` (`oxlint`) ejecutado sobre 38 archivos con `0 warnings` y `0 errors`; `npm run build` (`tsc -b && vite build`) exitoso; 0 ocurrencias de `: any` en `frontend/src/`. | Aprobado con límites | Sin pruebas unitarias de UI (no existe Vitest/Jest en el proyecto); validación cubre compilación TypeScript y reglas estáticas. |
| **AC-03** Preservar `11/11` tests de backend | `functional` / `automated` (`backend-tests`) | [run-tests.mjs](../../run-tests.mjs) ejecuta `.\mvnw.cmd test` en `backend/`: `Tests run: 11, Failures: 0, Errors: 0, Skipped: 0` (`BUILD SUCCESS`). | Aprobado con límites | Pruebas sobre base H2 en memoria; al arrancar Hibernate emite advertencia de deprecación por `org.hibernate.dialect.H2Dialect` en [application.properties](../../backend/src/main/resources/application.properties). |
| **AC-04** Mover edición de activos y `DE_BAJA` manual a *Fase Futura* en `PRD.md` | `functional` / `automated` (`deliverables-check`) | [PRD.md](../../PRD.md) actualizado en sección de *Fuera del Alcance Inicial / Fase Futura* reflejando únicamente las operaciones soportadas por el MVP actual (`deliverables-check` + inspección documental). | Aprobado con límites | Valida presencia de marcadores esperados y coherencia frente a endpoints implementados. |
| **AC-05** Actualizar `SPEC-TECNICA.md` con versiones reales, endpoint P06, árbol real y Plan de Pruebas | `functional` / `automated` (`deliverables-check`) | [SPEC-TECNICA.md](../../SPEC-TECNICA.md) v1.2 documenta versiones de [pom.xml](../../backend/pom.xml) y [package.json](../../frontend/package.json), `GET /api/assets/recommendations`, árbol real de vistas/componentes y sección 7 *Plan de Pruebas* (`deliverables-check`). | Aprobado con límites | El check verifica marcadores clave; coherencia integral validada por lectura directa. |
| **AC-06** Actualizar `README.md` con `npm run lint`, matriz `P01`–`P10`, REST en vivo y hallazgos | `functional` / `automated` (`deliverables-check`) | [README.md](../../README.md) actualizado con instrucciones reales, matriz `P01`–`P10`, resultados REST contra backend reiniciado y sección 5 *Hallazgos de Calidad, Deuda Técnica y Limitaciones* (`deliverables-check`). | Aprobado con límites | La matriz combina cobertura JUnit (`P01`–`P05`, `P10`), verificación REST directa (`P06`–`P09`) e inspección en navegador. |
| **AC-07** Verificación visual y REST en vivo con Chrome DevTools | `visual` / `manual` (`sessionId`: `71dc019a-c3ab-45ff-8b24-49668855bdc4`) | Desktop `1280x800` en `http://localhost:5173/` (`innerWidth: 1280`, `scrollWidth: 1265`, `0` errores/warnings de consola) y 6 capturas guardadas: [dashboard-desktop.png](evidence/dashboard-desktop.png), [catalog-desktop.png](evidence/catalog-desktop.png), [catalog-empty-desktop.png](evidence/catalog-empty-desktop.png), [modal-create-desktop.png](evidence/modal-create-desktop.png), [custodians-desktop.png](evidence/custodians-desktop.png) y [dashboard-mobile.png](evidence/dashboard-mobile.png). REST en vivo sobre `http://localhost:8080` con `20` activos iniciales tras reinicio. | Aprobado con límites | En viewport estrecho (`375x812` solicitado, mínimo `500 px` aplicado por Chrome) `TopNavbar` desborda horizontalmente (`scrollWidth: 571 > innerWidth: 500`); DevTools Issues reporta 12 campos sin `id`/`name` y 9 sin `<label>`. |
| **AC-08** Repositorio Git estrictamente local con `.gitignore` y Conventional Commit en español | `functional` / `automated` (`deliverables-check`) | [.gitignore](../../.gitignore) creado, repositorio Git inicializado en rama `master`, commit local `bf90bd7` (`feat: implementa BodegaCore MVP con limpieza técnica, documentación completa y evidencias`) y `git remote` vacío (`deliverables-check`). | Aprobado con límites | Los archivos de cierre de OmniSpec modificados durante `/omni-converge` quedan fuera de `bf90bd7` al no realizarse un nuevo commit automático. |

## 2. Entorno y checks registrados

- **Checks en OmniSpec (`specs/checks.json`)**:
  - `backend-tests`: `node run-tests.mjs` (`cwd: "."`, `kind: "automated"`).
  - `frontend-build`: `npm run build` (`cwd: "frontend"`, `kind: "automated"`).
  - `frontend-lint`: `npm run lint` (`cwd: "frontend"`, `kind: "automated"`).
  - `deliverables-check`: aserción Node sobre `PRD.md`, `SPEC-TECNICA.md`, `README.md`, `.gitignore`, ausencia de `ComponentShowcase.tsx`, estado `git` local y ausencia de `git remote` (`cwd: "."`, `kind: "automated"`).
- **Versiones reales observadas**:
  - Backend: `Spring Boot 3.3.5`, `<java.version>17</java.version>` ejecutado con OpenJDK `25.0.4.1` vía `backend/mvnw.cmd`.
  - Frontend: `react ^19.3.1`, `vite ^8.3.6`, `typescript ~7.0.2`, `tailwindcss ^3.4.19`, `oxlint ^1.90.0` sobre Node.js `v24.22.1` / npm `11.19.1`.

## 3. Hallazgos abiertos y deuda técnica declarada

1. **Desbordamiento horizontal móvil en `TopNavbar` (`scrollWidth: 571` vs `innerWidth: 500`)**: observable en [dashboard-mobile.png](evidence/dashboard-mobile.png); la navegación es legible pero requiere refactor responsivo en iteración futura (`flex-wrap` o menú colapsable).
2. **Etiquetado y atributos de formularios en DevTools Issues**: `12` campos de formulario sin `id`/`name` y `9` sin `<label>` asociado por `htmlFor`.
3. **Dialecto H2 deprecado en configuración**: `spring.jpa.database-platform=org.hibernate.dialect.H2Dialect` en [application.properties](../../backend/src/main/resources/application.properties) puede omitirse para autodetección de Hibernate.
4. **Cobertura de tests UI**: no hay suite automatizada Vitest/Playwright en `frontend/`; las regresiones visuales se validan mediante compilación/linting + Chrome DevTools.
