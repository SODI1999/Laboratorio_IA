# [VERIFICATION-001] Evidencia de Verificación de Criterios y Pruebas Funcionales

Fecha: 2026-11-11  
Especificación: `001-gestion-activos-bodega`  
Ruta Fit: FULL  
Resultado General: **100% DE CRITERIOS Y PRUEBAS APROBADOS**

---

## 1. Verificación de Criterios de Aceptación (EARS)

| Criterio | Tipo | Método | Comando / Fuente de Verificación | Resultado Observado | Estado |
| :---: | :---: | :---: | :--- | :--- | :---: |
| **AC-01** | functional | automated | `backend/src/test/java/com/bodegacore/repository/AssetRepositoryTest.java#testUniqueAssetTagConstraint` | `DataIntegrityViolationException` disparada ante intento de duplicar `assetTag`. Test exitoso. | **PASSED** |
| **AC-02** | functional | automated | `backend/src/test/java/com/bodegacore/controller/AssetControllerIntegrationTest.java#testCreateAssetSuccess201` | Petición `POST /api/assets` persiste en H2 y retorna HTTP 201 Created con cabecera `Location`. | **PASSED** |
| **AC-03** | functional | automated | `backend/src/test/java/com/bodegacore/controller/AssetControllerIntegrationTest.java#testCreateAssetValidationErrors400` | Envío de costo $\le 0$ o tag vacío retorna HTTP 400 con ProblemDetail y mapa de `invalidFields`. | **PASSED** |
| **AC-04** | functional | automated | `backend/src/test/java/com/bodegacore/service/AssetServiceTest.java#testCannotAssignAssetInMaintenanceOrDeBaja` | Intento de asignación de activos en `EN_MANTENIMIENTO` o `DE_BAJA` lanza `InvalidStateTransitionException`. | **PASSED** |
| **AC-05** | functional | automated | `backend/src/test/java/com/bodegacore/controller/DashboardControllerIntegrationTest.java#testGetDashboardMetrics` | Endpoint `GET /api/dashboard` retorna 20 activos, valorización monetaria total y desglose de estados. | **PASSED** |
| **AC-06** | functional | automated | `backend/src/test/java/com/bodegacore/controller/AssetControllerIntegrationTest.java#testFilterByAntiquityOlderThan90Days` | Filtros desacoplados `critical=true` y `olderThan90Days=true` retornan 3 y 7 registros respectivamente. | **PASSED** |
| **AC-07** | functional | automated | `backend/src/test/java/com/bodegacore/service/AssetServiceTest.java#testAssignAssetTransitionsToAsignado` | Asignación de activo actualiza estado a `ASIGNADO`, registra fecha y vincula la entidad `Custodian`. | **PASSED** |
| **AC-08** | visual | manual | Inspección en `http://localhost:5173/` con Chrome DevTools (ComponentShowcase y vistas activas) | Skeletons contextuales con dimensiones idénticas a los componentes reales, garantizando CLS = 0. | **PASSED** |
| **AC-09** | visual | manual | Búsqueda sin coincidencias en catálogo e inspección de estado vacío en Workbench | Renderizado de `EmptyState` con ícono, descripción explicativa y botones de acción rápida. | **PASSED** |
| **AC-10** | interaction | manual | Simulación de error de red e inspección del componente `ErrorAlert` | Banner comprensible con descripción del fallo y botón "Reintentar conexión" activo. | **PASSED** |
| **AC-11** | accessibility | manual | Inspección de contrastes y atributos en navegador | Cumplimiento de WCAG 2.2 AA: contrastes tipográficos $>4.5:1$, atributos `aria-label` en controles y foco visible. | **PASSED** |

---

## 2. Evidencia de Ejecución de Pruebas Funcionales de la Guía (P01 a P10)

| Prueba | Descripción del Caso | Evidencia Observada en Ejecución Real | Veredicto |
| :---: | :--- | :--- | :---: |
| **P01** | Carga y visualización de datos | Base de datos H2 arranca con 20 activos precargados. Dashboard consolida \$109.250.000 COP y 50% de disponibilidad. | **APROBADO** |
| **P02** | Registro de nuevo activo | Formulario de alta persiste nuevo registro en H2, valida obligatoriedad de campos y costo mayor a cero. | **APROBADO** |
| **P03** | Filtro por estado crítico | Al activar el botón de filtro crítico, el catálogo muestra exactamente los 3 activos en taller (`ACT-017`, `ACT-018`, `ACT-019`). | **APROBADO** |
| **P04** | Filtro por antigüedad >90d | Al activar el botón de antigüedad, se listan los 7 activos cuya última inspección supera los 90 días. | **APROBADO** |
| **P05** | Consulta de custodio / responsable | En catálogo y en la vista de Custodios se constatan los activos asignados a cada empleado (ej. Ing. Carlos Mendoza con `ACT-011` y `ACT-012`). | **APROBADO** |
| **P06** | Alerta de mantenimiento preventivo | Banner superior desplegado con 6 recomendaciones inteligentes calculadas por la regla de negocio para activos >90d. | **APROBADO** |
| **P07** | Asignación a responsable | Activo `ACT-001` pasa de `DISPONIBLE` a `ASIGNADO` vinculando a Ing. Carlos Mendoza en un solo clic. | **APROBADO** |
| **P08** | Devolución a bodega | Activo `ACT-001` retorna a bodega, pasa a `DISPONIBLE` y se desvincula del custodio confirmando estante. | **APROBADO** |
| **P09** | Envío a mantenimiento | Activo `ACT-001` pasa a `EN_MANTENIMIENTO` asociando taller "Metrología Andina SAS" y motivo. | **APROBADO** |
| **P10** | Liberación de mantenimiento | Activo `ACT-001` se libera de taller, retorna a `DISPONIBLE` y renueva su fecha de inspección al día actual. | **APROBADO** |

---

## 3. Limitaciones Conocidas y Alcance MVP

- **Autenticación**: Conforme al PRD y fit aprobado, el sistema no incluye autenticación RBAC con contraseñas en la versión 1.0 (diseñado como prototipo funcional de sistemas de información).
- **Persistencia**: La base de datos H2 opera en memoria RAM (`DB_CLOSE_DELAY=-1`), reinicializándose con los 20 registros semilla cada vez que se reinicia el servidor Spring Boot.
