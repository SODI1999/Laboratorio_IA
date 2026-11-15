# Documento de Requerimientos de Producto (PRD)
## Sistema de Administración de Activos de Bodega (Equipos / Herramientas / TI)

- **Asignatura**: Fundamentos de Sistemas de Información
- **Proyecto**: Laboratorio de Construcción Asistida por IA
- **Versión**: 1.0 (MVP)
- **Fecha**: 11 de noviembre de 2026
- **Estado**: Aprobado para Especificación e Implementación

---

## 1. Introducción y Contexto del Negocio

Una organización con operaciones industriales y tecnológicas requiere optimizar el control de los activos físicos custodiados en su bodega central. Estos activos incluyen:
1. **Equipos de cómputo** (portátiles, estaciones de trabajo, servidores).
2. **Herramientas de trabajo** (equipos de medición, herramientas de precisión, maquinaria liviana).
3. **Infraestructura de telecomunicaciones y redes** (switches, routers, access points, UPS).

### 1.1 Problema Central
El proceso manual actual o disperso en hojas de cálculo adolece de:
- **Pérdida de trazabilidad de ubicación**: Desconocimiento del pasillo, estante o nivel exacto donde reposa un activo dentro de la bodega.
- **Incertidumbre en el estado del activo**: Dificultades para saber de inmediato si un activo está *Disponible*, *Asignado* a un empleado, *En Mantenimiento* en taller o *De Baja*.
- **Riesgo de obsolescencia y falta de mantenimiento**: Inexistencia de alertas sobre activos con más de 90 días sin inspección técnica o con garantía a punto de expirar.
- **Falta de visibilidad financiera**: Desconocimiento del valor económico total inmovilizado en activos bajo custodia.

---

## 2. Objetivos del Producto y Métricas de Éxito

### 2.1 Objetivo General
Desarrollar un prototipo de aplicación web empresarial para la administración, localización, control de estados, valorización económica y seguimiento de mantenimiento de activos de bodega, bajo un enfoque de ingeniería de software asistido por IA y guiado por especificaciones.

### 2.2 Métricas de Éxito (KPIs del Negocio)
- **Localización ágil**: Reducir el tiempo necesario para ubicar y consultar la ficha física de un activo en bodega a menos de 5 segundos en la interfaz.
- **Detección de activos críticos / obsolescencia**: Identificar el 100% de los activos con más de 90 días de inactividad o mantenimiento pendiente mediante filtros reactivos de un solo clic.
- **Precisión de valorización**: 100% de exactitud en el cálculo automático del capital inmovilizado (suma de costos de adquisición de activos vigentes).
- **Control de custodia**: Cero activos asignados sin registro de responsable y fecha de entrega.

---

## 3. Usuarios y Roles (Perfiles de Uso)

1. **Jefe de Bodega / Almacén**:
   - Consulta el dashboard ejecutivo para monitorear valorización total y estado global del parque de activos.
   - Da de alta nuevos activos y define su ubicación física (pasillo/estante) en bodega.
2. **Encargado de Operaciones y Mantenimiento**:
   - Registra entregas de activos a empleados/custodios y recepciona devoluciones a bodega.
   - Envía equipos a servicio técnico preventivo/correctivo y registra proveedores de soporte.

*(Nota: En la versión MVP inicial no se requiere autenticación de usuarios con login/contraseña; la diferenciación de roles es conceptual a nivel de caso de uso).*

---

## 4. Alcance del Proyecto

### 4.1 En el Alcance (MVP)
- **Módulo 1: Tablero de Control de Activos y Valorización (Dashboard)**
  - Resumen de métricas: Total de activos registrados, valor monetario acumulado del inventario, porcentaje de disponibilidad operativa, cantidad por estado (*Disponible*, *Asignado*, *En Mantenimiento*, *De Baja*).
  - Alerta ejecutiva de activos críticos (equipos en taller o con más de 90 días sin inspección técnica).
  - Panel de recomendaciones inteligentes de mantenimiento preventivo (regla de negocio para activos >90 días sin servicio).
- **Módulo 2: Catálogo e Inventario de Activos**
  - Listado tabular completo con: Código Placa (`assetTag`), Nombre, Categoría (`COMPUTO`, `HERRAMIENTAS`, `REDES_TI`, `MAQUINARIA_LIVIANA`), Marca/Modelo, Ubicación en bodega, Costo de adquisición, Fecha de compra, Fecha de última inspección, Estado actual y Custodio asignado.
  - **Filtros reactivos desacoplados**:
    - Filtro por Estado: Selección de estado crítico / `EN_MANTENIMIENTO` (Caso de prueba P03).
    - Filtro por Antigüedad: Filtro independiente de activos con más de 90 días sin inspección (Caso de prueba P04).
    - Filtro por Categoría de activo.
  - Búsqueda en tiempo real por placa o nombre.
  - Registro de nuevos activos con validaciones en servidor y cliente.
- **Módulo 3: Gestión de Asignaciones, Custodios y Mantenimiento**
  - Consulta y directorio de custodios responsables y proveedores técnicos (Caso de prueba P05).
  - Acción de asignación de activo disponible a un custodio con registro de fecha y área.
  - Acción de devolución de activo asignado a bodega (restablece a *Disponible* con asignación de estante).
  - Acción de envío a mantenimiento con registro de motivo y taller.
  - Regla automática de alerta preventiva para mantenimiento programado (Caso de prueba P06).
- **Base de datos en memoria H2**: Precargada con al menos 20 registros iniciales realistas para pruebas.

### 4.2 Fuera del Alcance Inicial (Exclusiones Deliberadas)
- Autenticación y autorización basada en roles (RBAC) con login y contraseñas.
- Edición de fichas de activos ya registrados y transición manual a `DE_BAJA` desde la UI (en v1.0 MVP la baja se representa únicamente en datos semilla).
- Integración con sistemas tributarios, facturación electrónica o ERPs contables (SAP, Oracle).
- Módulo de depreciación fiscal multinormativa (NIIF/NIC).
- Escaneo mediante cámara web o hardware físico de lectores ópticos (la placa se ingresa como texto).
- Notificaciones automáticas por correo electrónico o SMS.

---

## 5. Requisitos Funcionales y No Funcionales

### 5.1 Requisitos Funcionales (RF)

| ID | Nombre | Descripción | Mapeo Guía Laboratorio |
| :--- | :--- | :--- | :--- |
| **RF-01** | Identificación única y validación | El sistema debe validar que cada activo posea un código de placa (`assetTag`) alfanumérico único e irrepetible, y costo estrictamente positivo. | P01, P02 |
| **RF-02** | Registro y alta de activos | Permitir el alta de activos capturando código, nombre, categoría, marca, modelo, serie, costo, fecha de adquisición, fecha de última inspección y ubicación física en estante. | P01, P02 |
| **RF-03** | Cálculo de valorización y KPIs | El sistema debe computar automáticamente el valor económico total sumando los costos de adquisición de activos vigentes y tasas de disponibilidad operativa. | P01 |
| **RF-04A** | Filtro por estado crítico / mantenimiento | Proveer un filtro dedicado para listar exclusivamente activos en estado crítico / `EN_MANTENIMIENTO`. | **P03** |
| **RF-04B** | Filtro por antigüedad (>90 días) | Proveer un filtro independiente para consultar activos cuya última fecha de inspección o adquisición supere los 90 días respecto a la fecha actual. | **P04** |
| **RF-05** | Directorio y consulta de custodios | Proveer la consulta detallada de custodios y responsables asignados, incluyendo datos de contacto, departamento y activos bajo su poder. | **P05** |
| **RF-06** | Motor de sugerencia de mantenimiento | El sistema debe evaluar automáticamente y sugerir mantenimiento preventivo (alerta visual y bandera de recomendación) para activos que superen 90 días sin revisión técnica. | **P06** |
| **RF-07** | Flujo de asignación a custodio | Permitir asignar un activo únicamente si su estado actual es `DISPONIBLE`, vinculando el custodio y registrando la fecha de entrega. | P07 |
| **RF-08** | Flujo de devolución a bodega | Permitir retornar un activo `ASIGNADO` a la bodega, actualizando su estado a `DISPONIBLE` y confirmando su ubicación en estante. | P08 |
| **RF-09** | Flujo de taller / mantenimiento | Permitir cambiar el estado de un activo a `EN_MANTENIMIENTO`, registrando taller/proveedor técnico y motivo, bloqueando su asignación mientras esté en taller. | P09 |
| **RF-10** | Retorno y liberación de taller | Permitir cerrar el mantenimiento de un activo, registrando fecha de inspección renovada y retornándolo a estado `DISPONIBLE`. | P10 |
| **RF-11** | Precarga de datos semilla (H2) | El sistema debe iniciar automáticamente con 20 registros iniciales en H2 (10 Disponibles, 6 Asignados, 3 en Mantenimiento, 1 de Baja, con $\ge 4$ activos con >90 días). | P01 - P10 |

### 5.2 Requisitos No Funcionales (RNF)

| ID | Categoría | Criterio de Aceptación |
| :--- | :--- | :--- |
| **RNF-01** | Rendimiento y Persistencia | El backend debe utilizar Spring Boot con H2 in-memory, respondiendo peticiones REST en menos de 200 ms en entorno local. |
| **RNF-02** | Arquitectura Limpia | Separación estricta de responsabilidades en backend: Controladores REST, Servicios con lógica de negocio y Repositorios Spring Data JPA. |
| **RNF-03** | Estados de Interfaz (4 Estados) | Toda vista interactiva en React debe implementar explícitamente: *Loading* (skeletons CLS=0), *Empty* (mensaje claro con CTA), *Error* (banner comprensible con reintento) e *Ideal* (datos completos). |
| **RNF-04** | Cero Clichés de IA | La interfaz debe priorizar jerarquía tipográfica, espaciado deliberado y paleta empresarial sobria, evitando gradientes artificiales, bordes con glow o sombras excesivas. |
| **RNF-05** | Accesibilidad | Cumplimiento de pautas WCAG 2.2 AA en contraste tipográfico, nombres accesibles en botones interactivos y navegación básica con teclado. |

---

## 6. Flujos Principales de Usuario

### Flujo 1: Consulta del Dashboard y Detección de Activos Críticos
1. El usuario abre la aplicación y visualiza inmediatamente las 4 tarjetas de KPI (Total Activos, Valorización $, Tasa Disponibilidad %, Críticos >90d).
2. Hace clic en la tarjeta o botón "Ver Activos Críticos".
3. El sistema navega al catálogo aplicando automáticamente el filtro de criticidad, mostrando solo los equipos que requieren atención.

### Flujo 2: Alta de un Nuevo Activo en Bodega
1. El usuario hace clic en el botón "Nuevo Activo" en el catálogo.
2. Diligencia el formulario modal (placa, nombre, categoría, marca, serie, costo, ubicación en estante).
3. Hace clic en "Guardar".
4. El servidor valida unicidad y montos; al ser exitoso, retorna HTTP 201 y la tabla se actualiza de inmediato sin recargar la página.

### Flujo 3: Asignación de Herramienta o Equipo a un Empleado
1. En la tabla de catálogo, el usuario localiza un activo con estado `DISPONIBLE` y presiona la acción "Asignar".
2. Se abre un diálogo modal solicitando el nombre del custodio y el departamento solicitante.
3. Al confirmar, el sistema actualiza el estado a `ASIGNADO` y refresca el contador de disponibilidad del dashboard.

### Flujo 4: Envío y Retorno de Mantenimiento
1. El usuario selecciona un activo que presenta fallas o requiere calibración y presiona "Enviar a Mantenimiento".
2. Registra el motivo y taller/proveedor técnico. El estado cambia a `EN_MANTENIMIENTO`.
3. Cuando el taller devuelve el activo reparado, el usuario presiona "Finalizar Mantenimiento", el activo vuelve a estado `DISPONIBLE` y se le asigna estante en bodega.

---

## 7. Priorización (MVP vs. Mejoras Futuras)

| Característica | Fase MVP (Laboratorio) | Fase Futura (Post-Entrega) |
| :--- | :---: | :---: |
| Dashboard con KPIs y Valorización | **Sí (Obligatorio)** | - |
| Catálogo con búsqueda y filtros reactivos | **Sí (Obligatorio)** | - |
| Filtro por estado crítico / mantenimiento (P03) | **Sí (Obligatorio)** | - |
| Filtro por antigüedad (>90 días sin revisión) (P04) | **Sí (Obligatorio)** | - |
| Consulta de custodios y directorio de asignaciones (P05) | **Sí (Obligatorio)** | - |
| Regla automática de sugerencia de mantenimiento (P06) | **Sí (Obligatorio)** | - |
| Gestión de estados operativos (Disponible, Asignado, Taller) | **Sí (Obligatorio)** | - |
| Precarga de 20 datos de prueba en H2 | **Sí (Obligatorio)** | - |
| Edición de ficha de activo y baja manual (`DE_BAJA`) | No | Sí |
| Autenticación JWT y roles de usuario | No | Sí |
| Lector de código de barras mediante cámara web | No | Sí |
| Exportación de reportes a PDF y Excel | No | Sí |
| Integración con ERP empresarial | No | Sí |

---

## 8. Verificación y Criterios de Aceptación del PRD
- [x] Cada requisito es comprensible, medible y verificable mediante pruebas unitarias/REST o de interfaz.
- [x] El alcance delimita explícitamente lo incluido en el prototipo y lo excluido para mantener un desarrollo acotado de 4 a 6 horas.
- [x] Los módulos responden fielmente a los requerimientos didácticos y de sistemas de información de la asignatura.
