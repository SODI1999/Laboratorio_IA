# [SPEC-001] Gestión de Activos de una Bodega (Equipos / Herramientas / TI)

Fecha: 2026-11-11  
Estado: ESPECIFICADO  
Ruta Fit: FULL  

---

## 0. Clarification & Assumptions (Anti-Hallucination Gate)

- **Decisiones confirmadas**:
  - Dominio: Administración de Activos de Bodega, seleccionado a partir del ejercicio propuesto en la sección 7 de [Guia_Laboratorio_IA.pdf](../../Guia_Laboratorio_IA.pdf).
  - Stack tecnológico: Spring Boot (Java) + React (Vite) + Base de datos H2 in-memory.
  - Convención de documentación: Javadoc (backend) y JSDoc/TSDoc (frontend).
  - Convención de commits: Conventional Commits con descripciones en español.
  - Alcance: Prototipo MVP sin autenticación ni módulos tributarios/fiscales en la v1.
- **Supuestos y restricciones**:
  - Los 20 registros iniciales en memoria H2 cubren las 4 categorías (`COMPUTO`, `HERRAMIENTAS`, `REDES_TI`, `MAQUINARIA_LIVIANA`) y los 4 estados (`DISPONIBLE`, `ASIGNADO`, `EN_MANTENIMIENTO`, `DE_BAJA`).
  - La interfaz web cumple estrictamente los 4 estados de UI (Loading con skeletons CLS=0, Empty con CTA, Error comprensible con reintento, Ideal con datos).

---

## 1. Need and scope

### 1.1 Problema del Negocio
La administración de la bodega carece de visibilidad unificada sobre el ciclo de vida de los activos corporativos. Esto genera pérdidas por equipos extraviados, costos innecesarios por compras redundantes de herramientas ya existentes pero no localizadas, y deterioro prematuro de infraestructura de TI por falta de mantenimiento preventivo.

### 1.2 Usuarios Previstos
- **Jefe de Bodega / Almacén**: Responsable de registrar ingresos, asignar ubicaciones físicas (pasillo, estante), controlar el estado de conservación y verificar la valorización total del inventario.
- **Encargado de Soporte y Operaciones**: Asigna herramientas y equipos a custodios/empleados, registra devoluciones y tramita órdenes de servicio técnico/mantenimiento.

### 1.3 Módulos del MVP
1. **Tablero de Mando y Salud del Inventario (Dashboard)**:
   - Métricas ejecutivas: Total de activos, valorización económica total (\$ monetario), porcentaje de disponibilidad operativa, conteo por estados.
   - Panel de alertas de atención inmediata: activos con más de 90 días sin revisión/movimiento y activos actualmente en taller/mantenimiento.
2. **Catálogo Maestro de Activos**:
   - Listado con código de placa (`assetTag`), número de serie, nombre, categoría (`COMPUTO`, `HERRAMIENTAS`, `REDES_TI`, `MAQUINARIA_LIVIANA`), ubicación en bodega, estado y custodio.
   - Filtros reactivos por estado, categoría y filtro directo de criticidad (>90 días / mantenimiento).
   - Formulario de alta y edición con validación de unicidad y montos positivos.
3. **Control de Custodia y Mantenimiento**:
   - Asignación de activo a responsable/custodio (cambio de estado a `ASIGNADO`).
   - Retorno a bodega (cambio de estado a `DISPONIBLE` con asignación de estante).
   - Envío a mantenimiento preventivo/correctivo (cambio a `EN_MANTENIMIENTO` asociando proveedor técnico).

---

## 2. Acceptance Criteria and Non-Goals

### Acceptance Criteria (EARS Syntax)

- **AC-01 [functional]**: El sistema DEBERÁ garantizar un código de placa único (`assetTag`, e.g., `ACT-001`) para cada activo registrado en la base de datos (Casos P01, P02).
- **AC-02 [functional]**: CUANDO el usuario registre un activo con placa, nombre, categoría, costo de adquisición, fecha de compra y ubicación válidos, el backend DEBERÁ persistir el registro en H2 y retornar código HTTP 201 Created (Caso P02).
- **AC-03 [functional]**: SI un usuario intenta registrar un activo con un `assetTag` duplicado o con costo menor o igual a cero, ENTONCES el backend DEBERÁ rechazar la petición con HTTP 400 Bad Request y un mensaje de error descriptivo (Caso P02).
- **AC-04 [functional]**: MIENTRAS un activo se encuentre en estado `EN_MANTENIMIENTO` o `DE_BAJA`, el sistema DEBERÁ prohibir su asignación a cualquier custodio (Regla de negocio P07, P09).
- **AC-05 [functional]**: CUANDO se consulte el dashboard, el backend DEBERÁ totalizar y entregar: cantidad de activos, costo total acumulado, desglose por los 4 estados, conteo de activos con >90 días de antigüedad y lista de recomendaciones automáticas de mantenimiento preventivo (Casos P01, P06).
- **AC-06 [functional]**: El sistema DEBERÁ proveer filtros reactivos independientes en el catálogo: (a) filtro por estado crítico / `EN_MANTENIMIENTO` (Caso P03), y (b) filtro por antigüedad para activos con más de 90 días desde su última inspección o adquisición (Caso P04).
- **AC-07 [functional]**: El sistema DEBERÁ permitir consultar los datos detallados del custodio o responsable asignado a cualquier activo y el directorio de custodios (Caso P05), así como ejecutar la transición a estado `ASIGNADO` registrando fecha y responsable (Caso P07).
- **AC-08 [visual]**: MIENTRAS los datos del dashboard o del catálogo estén cargando desde la API, la interfaz DEBERÁ mostrar skeletons contextuales con CLS = 0 (Cumulative Layout Shift nulo).
- **AC-09 [visual]**: MIENTRAS un filtro o búsqueda resulte en cero coincidencias, la interfaz DEBERÁ renderizar una vista de estado vacío con ícono claro, mensaje de guía y botón de acción para limpiar filtros.
- **AC-10 [interaction]**: SI ocurre un error de comunicación con el backend o la API falla, ENTONCES la interfaz DEBERÁ presentar un banner de alerta comprensible con mecanismo de reintento, sin bloquear la navegación ni exponer trazas de error internas.
- **AC-11 [accessibility]**: La interfaz DEBERÁ proporcionar nombres accesibles (ARIA labels) para botones de acción, filtros y badges de estado, garantizando contraste conforme a WCAG 2.2 AA.

### Non-Goals
- No se implementará autenticación con login/contraseña ni gestión de roles en el MVP (v1).
- No se conectará con servicios externos de facturación electrónica ni sistemas tributarios.
- No se integrará escaneo físico por cámara web de códigos QR/código de barras en el navegador; los códigos se digitan o precargan como texto.
- No se implementará cálculo contable de depreciación fiscal multinormativa (NIIF/US-GAAP); se gestiona el costo histórico de adquisición y estado de conservación.

---

## 3. Domain applicability

| Security & Compliance Control | Required? | Technical Enforcement |
| :--- | :---: | :--- |
| **Does it touch sensitive personal data (PII)?** | No | Solo nombres ficticios de custodios/empleados para asignación de equipos en datos de prueba. |
| **Does it expose cross-tenant data?** | No | Prototipo mono-bodega de instancia única; N/A justificado. |
| **Does it require audit logging?** | Parcial | Registro en logs de consola de cambios de estado críticos (asignación, envío a mantenimiento, bajas). |
| **Does it access or process sensitive data?** | No | Base de datos H2 volátil en memoria con 20 registros ficticios de prueba. Cero secretos en código o repositorios. |

---

## 4. Experience and limits

| Superficie | Loading | Empty | Error | Ideal / Contenido |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard de Activos** | Skeletons de 4 tarjetas de KPI y 1 tabla de resumen | Banner: "Sin activos en el sistema" con CTA para crear el primer activo | Tarjeta con mensaje de error de conexión y botón "Reintentar" | Indicadores clave, desglose de estados y panel de activos críticos |
| **Catálogo de Activos** | Skeleton de tabla con 5 filas placeholder | Mensaje "No se encontraron activos con los filtros seleccionados" + botón "Restablecer filtros" | Alerta emergente inline con código de error y opción de reintento | Tabla interactiva con ordenamiento, badges de estado y acciones (editar, asignar, taller) |
| **Modal Asignación / Mantenimiento** | Spinner de acción en botón de submit | N/A (formulario siempre muestra campos requeridos) | Validación visible campo por campo (rojo accesible) con mensajes claros | Formulario limpio con selección de custodio/taller y confirmación |

---

## 5. Traceability

| Criterio | Módulo / Capa Backend | Componente Frontend | Verificación Planificada | Caso Guía |
| :--- | :--- | :--- | :--- | :---: |
| **AC-01** | `AssetRepository` / `Asset.java` (`@Column(unique=true)`) | Formulario `AssetModal` | Test unitario de restricción de unicidad | P01, P02 |
| **AC-02** | `AssetController.createAsset` | `AssetForm` | Test de integración REST POST 201 | P02 |
| **AC-03** | `GlobalExceptionHandler` + `@Valid` | Manejo de errores en formulario | Test unitario HTTP 400 con payload inválido | P02 |
| **AC-04** | `AssetService.assignAsset` | Deshabilitación de botón "Asignar" | Test unitario de regla de negocio de estado | P07, P09 |
| **AC-05** | `DashboardService.getDashboardMetrics` | `DashboardView.tsx` + Banner Alertas | Test REST GET `/api/dashboard` y regla >90d | P01, P06 |
| **AC-06** | `AssetService.getAssets` (filtros `status`, `olderThan90Days`) | Botones independientes de filtro en `CatalogView.tsx` | Test de consulta JPA / servicio (P03 estado, P04 >90d) | P03, P04 |
| **AC-07** | `AssetService.assignAsset` + `CustodianService` | Drawer de detalle, Modal y `CustodianDirectoryModal` | Test endpoint PUT `/api/assets/{id}/assign` y GET `/api/custodians` | P05, P07 |
| **AC-08** | N/A (Frontend) | `SkeletonCard`, `SkeletonTable` | Inspección visual en navegador (CLS = 0) | P01 |
| **AC-09** | N/A (Frontend) | `EmptyStateCard` | Inspección visual con filtro sin coincidencias | P03, P04 |
| **AC-10** | N/A (Frontend) | `ErrorAlertBanner` | Simulación de endpoint apagado y verificación de botón reintentar | Resiliencia |
| **AC-11** | N/A (Frontend) | Atributos `aria-label`, contraste WCAG | Inspección de accesibilidad DevTools | WCAG 2.2 |
