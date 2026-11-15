# Contexto del proyecto

Contexto del proyecto para el Laboratorio de IA (Diseño del Sistema).

## 1. Estado del onboarding y alcance
- Estado: CONTEXT_RECORDED
- Validación de la aplicación: APPLICATION_VALIDATED
- Fecha de actualización del inventario: 2026-11-15T07:42:00.000Z
- Cobertura: Código backend y frontend operativos, documentación académica completa ([INFORME-LABORATORIO.pdf](../INFORME-LABORATORIO.pdf) y [README.md](../README.md)) y especificaciones `001` y `002` completadas.
- Caso de estudio aprobado: Administración de Activos de una Bodega (Equipos, Herramientas, Infraestructura TI), conforme al ejercicio propuesto en la sección 7 de la guía académica ([Guia_Laboratorio_IA.pdf](../Guia_Laboratorio_IA.pdf)).

## 2. Mapa de evidencias
- Tipo de proyecto observado: aplicación full-stack (`backend/` + `frontend/`) con entregables académicos completos:
  - [PRD.md](../PRD.md) actualizado con edición manual y `DE_BAJA` movidos a *Fase Futura*.
  - Carpeta de mockups exportados desde Stitch (`../mockups/stitch/`).
  - [SPEC-TECNICA.md](../SPEC-TECNICA.md) v1.2 con arquitectura, modelo de datos, API REST, árbol real de componentes y plan de pruebas.
  - [README.md](../README.md) con requisitos reales, diagramas de arquitectura, instrucciones, matriz de pruebas (`P01`–`P10`), evidencia REST en vivo y hallazgos de calidad/deuda técnica.
  - [INFORME-LABORATORIO.pdf](../INFORME-LABORATORIO.pdf) con informe académico completo en PDF a nombre de Brahian Ospina, trazabilidad OmniSpec, capturas y diagramas Mermaid.
- Herramientas, versiones y runtimes verificados en el host local:
  - Java: `<java.version>17</java.version>` en `backend/pom.xml`, ejecutado sobre OpenJDK `25.0.4.1` Temurin con `Spring Boot 3.3.5` y Maven Wrapper (`backend/mvnw.cmd`).
  - Node.js / npm: `v24.22.1` / `11.19.1`.
  - Frontend (`frontend/package.json`): `react ^19.3.1`, `vite ^8.3.6`, `typescript ~7.0.2`, `tailwindcss ^3.4.19`, `oxlint ^1.90.0`.
  - Git: `v2.51.0.windows.1` inicializado en la raíz (`master`, remoto `origin` autorizado por el usuario en `https://github.com/SODI1999/Laboratorio_IA.git`) con [.gitignore](../.gitignore).
  - Maven: `mvn` no está presente en el `PATH` global; se requiere `backend/mvnw.cmd`.

## 3. Objetivos y decisiones
- Propósito general: Prototipo web **BodegaCore** para gestión integral de activos de bodega (Equipos de Cómputo, Herramientas Especializadas, Infraestructura TI) con trazabilidad de estados (`DISPONIBLE`, `ASIGNADO`, `EN_MANTENIMIENTO`, `DE_BAJA`), ubicación física, valorización económica y alertas de mantenimiento/obsolescencia (>90 días).
- Módulos funcionales del MVP:
  1. **Tablero de Control** (`DashboardView.tsx`): KPIs ejecutivos, desglose por estado y sugerencias de acción desde `GET /api/dashboard`.
  2. **Catálogo de Activos** (`CatalogView.tsx` + `AssetModal.tsx`): listado, búsqueda, filtros (`status`, `category`, `critical`, `olderThan90Days`), registro (`POST /api/assets`), asignación (`PUT /api/assets/{id}/assign`) y mantenimiento (`PUT /api/assets/{id}/maintenance`).
  3. **Custodios y Ubicaciones** (`CustodiansView.tsx`): directorio real desde `GET /api/custodians`.
- Exclusiones explícitas del MVP (Fase Futura): autenticación/roles, ERP/facturación, depreciación contable multimoneda, edición completa de activos y baja manual (`DE_BAJA`).
- Estrategia de Frontend: primitivas propias estilo shadcn/ui, tipado estricto TypeScript sin anotaciones `: any`, 100 % de las vistas visibles consumiendo el backend Spring Boot (`ComponentShowcase.tsx` eliminado en `002-cierre-entregable-calidad`).
- Convención de documentación y commits: Javadoc en backend, TSDoc en frontend, Conventional Commits en español; remoto autorizado por el usuario hacia `https://github.com/SODI1999/Laboratorio_IA.git`.
- Capacidades de sesión registradas: `questions`, `web`, `terminal`, `render` (`chrome-devtools-mcp` sobre `http://localhost:5173`) y `delegation`.

## 4. Matriz de comandos
| Comando | Directorio | Fuente / base | Prerrequisitos | Selección como check / motivo | Ejecución |
| --- | --- | --- | --- | --- | --- |
| `node run-tests.mjs` | `.` | [run-tests.mjs](../run-tests.mjs) | Java / Temurin, Maven Wrapper | Check `backend-tests`: ejecuta `.\mvnw.cmd test` en `backend` (11/11 pruebas exitosas) | EXECUTED |
| `npm run build` | `frontend` | [package.json](../frontend/package.json) | Node.js, dependencias instaladas | Check `frontend-build`: ejecuta `tsc -b && vite build` | EXECUTED |
| `npm run lint` | `frontend` | [package.json](../frontend/package.json) | Node.js, `oxlint` | Check `frontend-lint`: ejecuta `oxlint` sobre 38 archivos | EXECUTED |
| `.\mvnw.cmd spring-boot:run` | `backend` | [README.md](../README.md) | Java / Maven Wrapper | Servidor backend de desarrollo en puerto `8080` | EXECUTED |
| `npm run dev` | `frontend` | [README.md](../README.md) | Node.js | Servidor frontend Vite en puerto `5173` | EXECUTED |

## 5. Línea base de calidad y requisitos
- Backend: `node run-tests.mjs` pasa `11/11` tests (`Failures: 0, Errors: 0, Skipped: 0`). Aviso observado al arranque: `org.hibernate.dialect.H2Dialect` marcado como deprecado en `application.properties` (`spring.jpa.database-platform`).
- Frontend: `npm run build` (`tsc -b && vite build`) exitoso sin errores; `npm run lint` (`oxlint`) con `0 warnings` y `0 errors` en `38` archivos y `0` anotaciones `: any`.
- Interfaz renderizada y limitaciones observadas:
  - Desktop `1280x800`: Tablero, Catálogo, estado Empty con CTA `Restablecer filtros`, Modal `Nuevo Activo` y Custodios operan con `0` errores de consola.
  - Viewport estrecho (solicitado `375x812`, ancho mínimo aplicado por Chrome `500 px`): `TopNavbar` presenta desbordamiento horizontal (`scrollWidth: 571 > innerWidth: 500`).
  - Accesibilidad/formularios en DevTools Issues: 12 campos sin `id`/`name` y 9 sin `<label>` asociado por `for`/`htmlFor`.

## 6. Trabajo existente, riesgos y validación pendiente
- Línea base actual: especificaciones completadas `001-gestion-activos-bodega` y `002-cierre-entregable-calidad`.
### Conflictos entre fuentes
<!-- omni:source-conflicts -->
| Tema / Módulo | Fuente A y declaración | Fuente B y declaración | Consecuencia | Estado | Siguiente evidencia requerida |
| --- | --- | --- | --- | --- | --- |
| Versión de Java en Backend | [Guia_Laboratorio_IA.pdf](../Guia_Laboratorio_IA.pdf) (pág. 3): demostración con Java 17 | `backend/pom.xml` (`17`) sobre host OpenJDK `25.0.4.1` | Bytecode Java 17 compilado y ejecutado sobre OpenJDK 25 | RESOLVED_BY_CONSTRAINT | Suite de 11 tests aprobada exitosamente |
| Disponibilidad de Maven | [Guia_Laboratorio_IA.pdf](../Guia_Laboratorio_IA.pdf) (pág. 3): uso de Maven | Host Windows: `mvn` ausente en el `PATH` global | No se puede invocar Maven globalmente | RESOLVED_BY_CONSTRAINT | Backend ejecuta con `backend/mvnw.cmd` |

## 7. Siguiente acción
- Proyecto listo para entrega académica o nuevas mejoras futuras vía `/omni-discuss` o `/omni-specify`.
