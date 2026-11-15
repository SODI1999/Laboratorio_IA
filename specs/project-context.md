# Contexto del proyecto

Contexto del proyecto para el Laboratorio de IA (Fundamentos de Sistemas de Información).

## 1. Estado del onboarding y alcance
- Estado: CONTEXT_RECORDED
- Validación de la aplicación: APPLICATION_NOT_VALIDATED
- Fecha del inventario: 2026-11-11T05:25:00.000Z
- Cobertura: Inspección heurística del entorno Windows y análisis de la guía base ([Guia_Laboratorio_IA.pdf](../Guia_Laboratorio_IA.pdf)). Proyecto greenfield sin código previo en el espacio de trabajo.
- Caso de estudio aprobado: Administración de Activos de una Bodega (Equipos, Herramientas, Infraestructura TI), conforme al ejercicio propuesto en la sección 7 de la guía académica.

## 2. Mapa de evidencias
- Tipo de proyecto observado: greenfield (aplicación en proceso de especificación/planificación).
- Módulos y artefactos requeridos por la sección 7 de la guía ([Guia_Laboratorio_IA.pdf](../Guia_Laboratorio_IA.pdf)):
  - Carpeta del proyecto con código fuente del backend y frontend.
  - `PRD.md` revisado y aprobado por el equipo.
  - Carpeta de mockups exportados desde Stitch (`mockups/stitch/` con capturas y HTMLs completados).
  - `SPEC-TECNICA.md` con arquitectura, modelo de datos, API y plan de pruebas.
  - `README.md` con requisitos, versiones, instrucciones de ejecución y configuración.
  - Matriz de pruebas diligenciada con evidencias y resultados reales.
- Herramientas y runtimes verificados en el host local:
  - Java: JDK 17 (declarado en backend/pom.xml, compilado y ejecutado con Maven Wrapper).
  - Node.js: v24.22.1 (`node -v`, código de salida 0).
  - npm: 11.19.1 (`npm -v`, código de salida 0).
  - Git: v2.51.0.windows.1 instalado (`git --version`, código de salida 0), pero no inicializado en la carpeta del proyecto (`fatal: not a git repository`).
  - Maven: `mvn` no está presente en el PATH global; se requiere Maven Wrapper (`mvnw.cmd`) en el backend.
- Convenciones observadas: Ecosistema Java (Maven) y TypeScript/React (Vite + Tailwind + shadcn/ui).

## 3. Objetivos y decisiones
- Propósito general: Desarrollar un prototipo web para la gestión integral de activos de una bodega (equipos de cómputo, herramientas especializadas e infraestructura TI), abarcando control de inventario físico, trazabilidad de estados (Disponible, Asignado, En Mantenimiento, De Baja), ubicación física en bodega, valorización económica y alertas de mantenimiento/obsolescencia.
- Módulos funcionales del MVP (adaptados al caso de estudio):
  1. Tablero de control de activos y valorización: KPIs ejecutivos (total activos, valorización económica total, distribución por estados, alertas de activos que requieren mantenimiento o tienen alta antigüedad >90/180 días).
  2. Catálogo e inventario de activos: Ficha detallada de activo (código de placa/código interno, número de serie, nombre, categoría, marca/modelo, costo de adquisición, fecha de compra, ubicación en bodega y estado actual) con filtros reactivos por estado y categoría.
  3. Gestión de ubicaciones / custodios y registro de mantenimientos: Trazabilidad de a quién o dónde está asignado el activo, y registro de intervenciones técnicas o proveedores de garantía asociados.
- Exclusiones explícitas iniciales (fuera de alcance MVP):
  - Integración con sistemas ERP corporativos externos o facturación electrónica.
  - Módulos contables avanzados de depreciación fiscal multimoneda.
  - Autenticación y control de roles en la versión 1 del prototipo.
- Stack configurado y aprobado: Spring Boot + React (TypeScript/shadcn) + H2.
- Estrategia de Frontend: Primitivas atómicas propias estilo shadcn/ui, tipado estricto TypeScript (`src/types/asset.ts`), directrices *Better UI* (Jaku) y página aislada **Component Showcase** (`ComponentShowcase.tsx`) para auditar componentes antes de la integración final.
- Convención de documentación por módulo: Javadoc para backend Java; TSDoc para frontend React/TypeScript.
- Convención de commits: Conventional Commits 1.0.0 (`feat`, `fix`, `refactor`, etc.) con descripción en español.
- Límite de control de versiones: Solo local; sin repositorios remotos configurados ni publicación/despliegue autorizados.
- Capacidades de la sesión: Preguntas interactivas (`ask_question`), búsqueda web (`search_web`), terminal (`run_command`), render/browser (`chrome-devtools-mcp`) y delegación (`invoke_subagent`, `swarm`) operativas en el host Antigravity.
- Dirección de interfaz: Diseño limpio sin clichés de IA, enfocado en jerarquía tipográfica y cumplimiento de los 4 estados obligatorios (Loading, Empty, Error, Protected).

## 4. Matriz de comandos
| Comando | Directorio | Fuente / base | Prerrequisitos | Selección como check / motivo | Ejecución |
| --- | --- | --- | --- | --- | --- |
| `mvnw.cmd spring-boot:run` | `backend` | [Guia_Laboratorio_IA.pdf](../Guia_Laboratorio_IA.pdf) §6.6.1 | Java 17, Maven Wrapper | Servidor backend de desarrollo | EXECUTED |
| `mvnw.cmd test` | `backend` | [CONSTITUTION.md](../CONSTITUTION.md) §Quality Gates | Java 17, Maven Wrapper | Suite de pruebas unitarias/integración (11/11 tests exitosos) | EXECUTED |
| `npm run dev` | `frontend` | [Guia_Laboratorio_IA.pdf](../Guia_Laboratorio_IA.pdf) §6.6.2 | Node.js, dependencias instaladas | Servidor frontend de desarrollo (Vite port 5173) | EXECUTED |
| `npm run build` | `frontend` | [CONSTITUTION.md](../CONSTITUTION.md) §Quality Gates | Node.js, TypeScript | Compilación TypeScript limpia | EXECUTED |

## 5. Línea base de calidad y requisitos
- Evidencia de ejecución: Suite de 11 tests automatizados en backend (`mvnw.cmd test`) con 0 fallos, 0 errores. Compilación frontend `npm run build` con 0 errores de tipos.
- Salud de la aplicación: APPLICATION_VALIDATED.
- Requisitos de seguridad y datos: Base H2 en memoria con 20 registros ficticios de prueba representativos precargados por `DataInitializer.java`.
- Requisitos de interfaz: Cumplimiento verificado de los 4 estados (Loading con CLS = 0, Empty con CTA, Error con reintento, Ideal con datos reales de H2) y componentes probados en navegador con Chrome DevTools.
- Fallos observados: Ninguno. Todos los tests y vistas operan al 100%.

## 6. Trabajo existente, riesgos y validación pendiente
- Línea base de trabajo existente: [PRD.md](../PRD.md), [SPEC-TECNICA.md](../SPEC-TECNICA.md), [design.md](../design.md), mockups en `mockups/stitch/`, especificación activa en `specs/001-gestion-activos-bodega/` y código completo en `backend/` y `frontend/`.
### Conflictos entre fuentes
<!-- omni:source-conflicts -->
| Tema / Módulo | Fuente A y declaración | Fuente B y declaración | Consecuencia | Estado | Siguiente evidencia requerida |
| --- | --- | --- | --- | --- | --- |
| Versión de Java en Backend | [Guia_Laboratorio_IA.pdf](../Guia_Laboratorio_IA.pdf) (pág. 3): demostración con Java 17 | `backend/pom.xml`: `<java.version>17</java.version>` | Bytecode Java 17 ejecutado y validado en host | RESOLVED_BY_CONSTRAINT | Suite de 11 tests aprobada exitosamente |
| Disponibilidad de Maven | [Guia_Laboratorio_IA.pdf](../Guia_Laboratorio_IA.pdf) (pág. 3): uso de Maven | Host Windows: `mvn` ausente en el PATH global | No se puede invocar Maven globalmente desde terminal | RESOLVED_BY_CONSTRAINT | El backend opera con Maven Wrapper (`mvnw.cmd`) |

## 7. Siguiente acción
- Proceder con `/omni-converge` para cerrar formalmente la especificación `001-gestion-activos-bodega`.
