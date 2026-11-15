# BodegaCore — Sistema de Administración de Activos de Bodega
## Laboratorio de Construcción Asistida por IA (Fundamentos de Sistemas de Información)

Prototipo empresarial para el control de inventario físico, trazabilidad de custodia, valorización patrimonial y seguimiento de ciclos de mantenimiento preventivo para activos de bodega (equipos de cómputo, herramientas especializadas, infraestructura TI y maquinaria liviana).

---

## 1. Stack Tecnológico Aprobado

- **Backend**:
  - Lenguaje: Java (desarrollado y verificado en OpenJDK 25.0.4.1 Temurin LTS, compatible con bytecode Java 17/21).
  - Framework: Spring Boot 3.3.5 (`spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `spring-boot-starter-validation`).
  - Base de Datos: H2 In-Memory Database (`jdbc:h2:mem:bodegadb;DB_CLOSE_DELAY=-1`).
  - Motor de Construcción: Maven Wrapper (`mvnw.cmd` / `mvnw`).
  - Documentación de API: Javadoc exhaustivo en controladores, servicios y repositorios.
- **Frontend**:
  - Librería: React `19.3.1` con TypeScript `~7.0.2` (`.tsx`) sobre Vite `8.3.6`.
  - Estilos: Tailwind CSS `3.4.19` con tokens industriales de diseño sobrio ([design.md](design.md), sin clichés de IA).
  - Arquitectura de Componentes: Primitivas atómicas propias estilo *shadcn/ui* en `src/components/ui/` (`button`, `card`, `badge`, `input`, `select`, `textarea`, `table`, `dialog`, `sheet`, `skeleton`, `tabs`).
  - Micro-interacciones & Calidad: Estándar *Better UI* (física `active:scale-[0.96]`, scroll containment) y linter `oxlint` `1.90.0`.
  - Vistas Integradas: `DashboardView`, `CatalogView` y `CustodiansView`, consumiendo al 100% la API REST de Spring Boot.

---

## 2. Requisitos Previos

1. **Java**: JDK 17, 21 o 25 instalado (`java -version`).
2. **Node.js**: v18.0 o superior (`node -v`) y gestor de paquetes `npm` (`npm -v`).
3. **Navegador Web**: Chrome, Edge, Firefox o Safari moderno.

---

## 3. Instrucciones de Ejecución Paso a Paso

### 3.1 Puesta en Marcha del Backend (Spring Boot + H2)

Abra una terminal en la raíz del proyecto y ejecute:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

- La API REST iniciará en: `http://localhost:8080/api`
- La consola web de H2 estará disponible en: `http://localhost:8080/h2-console`
  - *JDBC URL*: `jdbc:h2:mem:bodegadb`
  - *Usuario*: `sa`
  - *Contraseña*: *(en blanco)*
- Al iniciar, `DataInitializer.java` precarga automáticamente **20 activos semilla** y **4 custodios** representativos en memoria RAM.

### 3.2 Puesta en Marcha del Frontend (React + Vite)

En una segunda terminal, ejecute:

```powershell
cd frontend
npm install
npm run dev
```

- La aplicación web SPA se abrirá en: `http://localhost:5173/`

### 3.3 Ejecución de Pruebas Automatizadas

- **Backend (JUnit 5 + Spring Boot Test + H2)**:
  ```powershell
  cd backend
  .\mvnw.cmd test
  ```
  *(Ejecuta 11 pruebas automatizadas que cubren unicidad de placa, reglas de estado, persistencia JPA, filtros de antigüedad y controladores REST).*

- **Frontend (Verificación de Tipos, Build y Linter)**:
  ```powershell
  cd frontend
  npm run build
  npm run lint
  ```
  *(Valida compilación limpia TypeScript + Vite y `0` errores / `0` warnings en `oxlint`).*

---

## 4. Matriz de Pruebas Diligenciada y Evidencias Reales

### 4.1 Pruebas Directas de API REST y Automatizadas (Backend)
- **Suite automatizada (`node run-tests.mjs` / `.\mvnw.cmd test`)**: `11/11` pruebas unitarias y de integración (`AssetRepositoryTest`, `AssetServiceTest`, `AssetControllerIntegrationTest`, `DashboardControllerIntegrationTest`, `BodegacoreApplicationTests`) aprobadas (`BUILD SUCCESS`, `0` fallos).
- **Prueba REST directa en vivo (`http://localhost:8080`)**:
  - `GET /api/dashboard` $\to$ `HTTP 200 OK`: `totalAssets: 20`, `totalValuation: 109250000.00`, `availabilityRate: 50.0`, `DISPONIBLE: 10`, `ASIGNADO: 6`, `EN_MANTENIMIENTO: 3`, `DE_BAJA: 1`, `recommendations: 6`.
  - `GET /api/assets?critical=true` $\to$ `HTTP 200 OK`, `3` registros.
  - `GET /api/assets?olderThan90Days=true` $\to$ `HTTP 200 OK`, `7` registros.
  - `GET /api/custodians` $\to$ `HTTP 200 OK`, `4` registros.
  - `POST /api/assets` (payload inválido `acquisitionCost: -100`) $\to$ `HTTP 400 Bad Request` con RFC 7807 `ProblemDetail` (`invalidFields.acquisitionCost`).

### 4.2 Pruebas Funcionales de la Guía (`P01` a `P10`) y Flujos Operativos

| ID | Caso de Prueba (Guía / Flujo) | Resultado Esperado | Resultado Observado (Evidencia Real) | Estado |
| :---: | :--- | :--- | :--- | :---: |
| **P01** | **Abrir Dashboard y carga inicial** | Muestra al menos 20 registros y métricas coherentes con la API. | H2 inicia con 20 activos; el Dashboard en vivo muestra `20` activos, `$ 109.250.000`, `50%` disponibilidad y banner de `6` alertas ([captura](specs/002-cierre-entregable-calidad/evidence/dashboard-desktop.png)). | **APROBADO** |
| **P02** | **Consultar catálogo y alta de activo** | Tabla muestra registros del backend; alta valida placa única y costo > 0. | Catálogo renderiza los 20 activos desde `/api/assets`; `POST /api/assets` valida unicidad (`201`/`400`) y modal abre con campos obligatorios ([captura catálogo](specs/002-cierre-entregable-calidad/evidence/catalog-desktop.png), [captura modal](specs/002-cierre-entregable-calidad/evidence/modal-create-desktop.png)). | **APROBADO** |
| **P03** | **Filtrar productos críticos** | Solo se muestran los activos críticos en mantenimiento. | Botón "Filtro Crítico / Taller (P03)" y `GET /api/assets?critical=true` retornan exactamente `3` activos en `EN_MANTENIMIENTO` (`ACT-017`, `ACT-018`, `ACT-019`). | **APROBADO** |
| **P04** | **Filtrar por antigüedad (>90 días)** | Solo aparecen activos con más de 90 días sin inspección. | "Antigüedad > 90 Días (P04)" y `GET /api/assets?olderThan90Days=true` retornan exactamente `7` activos con badge `> 90d`. | **APROBADO** |
| **P05** | **Consultar custodios** | Se presenta el listado de custodios y activos bajo su responsabilidad. | Pestaña "Custodios" lista 4 custodios reales desde `/api/custodians` (ej. Ing. Carlos Mendoza con `ACT-011` y `ACT-012`) ([captura](specs/002-cierre-entregable-calidad/evidence/custodians-desktop.png)). | **APROBADO** |
| **P06** | **Sugerencia preventiva de mantenimiento** | Recomendación basada en reglas de stock/antigüedad, no texto estático. | Backend calcula `6` recomendaciones para activos >90d excluyendo `DE_BAJA` y las expone en `RecommendationsBanner`. | **APROBADO** |
| **P07** | **Probar datos vacíos o error de API** | Interfaz presenta mensaje útil con recuperación y no se bloquea. | Búsqueda `'NOEXISTE'` en catálogo renderiza `EmptyState` con CTA "Restablecer filtros" que restaura el listado ([captura](specs/002-cierre-entregable-calidad/evidence/catalog-empty-desktop.png)); `ErrorAlert` ofrece botón de reintento. | **APROBADO** |
| **P08** | **Validar formularios** | Campos obligatorios y valores inválidos se gestionan correctamente. | Inputs obligatorios HTML5 + validación cliente/servidor (`POST /api/assets` con costo `-100` retorna `HTTP 400` con `invalidFields`). | **APROBADO** |
| **P09** | **Recargar y reiniciar (H2 en memoria)** | Se documenta el reinicio de datos en memoria RAM al reiniciar backend. | Verificado en vivo: antes del reinicio la instancia previa tenía `12 DISPONIBLE / 1 EN_MANTENIMIENTO`; al reiniciar `mvnw.cmd spring-boot:run`, H2 volvió exactamente a `10 DISPONIBLE / 6 ASIGNADO / 3 EN_MANTENIMIENTO / 1 DE_BAJA`. | **APROBADO** |
| **P10** | **Revisar diseño adaptable (Responsive)** | Interfaz conserva legibilidad en distintos tamaños de ventana. | En `1280x800` no hay desbordamiento; en móvil (`500x812`) las tarjetas KPI apilan en 1 columna con texto legible ([captura móvil](specs/002-cierre-entregable-calidad/evidence/dashboard-mobile.png)), detectándose un scroll horizontal menor en `TopNavbar` (`571px` vs `500px`, registrado en §5). | **APROBADO (con hallazgo menor)** |

*Flujos adicionales de ciclo de vida implementados y cubiertos por tests de servicio/integración y UI*: asignación a custodio (`PUT /api/assets/{id}/assign`), devolución a bodega (`PUT /api/assets/{id}/return`), despacho a taller (`PUT /api/assets/{id}/maintenance`) y liberación (`PUT /api/assets/{id}/release-maintenance`).

---

## 5. Hallazgos de Calidad, Deuda Técnica y Limitaciones

Conforme a la Fase 8 y Anexo A de la guía de laboratorio, se documentan los hallazgos reales verificados tras la revisión crítica del código:

1. **Seguridad y Exposición (No apto para producción)**:
   - El prototipo v1.0 no incluye autenticación ni autorización basada en roles (RBAC), según lo delimitado en [PRD.md](PRD.md).
   - La consola H2 está habilitada en `/h2-console` con `spring.h2.console.settings.web-allow-others=true` en [application.properties](backend/src/main/resources/application.properties); debe deshabilitarse fuera de entornos locales de prueba.
2. **Persistencia Volátil en Memoria**:
   - H2 opera con `jdbc:h2:mem:bodegadb` y `ddl-auto=create-drop`: cualquier activo creado o transición ejecutada en sesión se pierde al detener o reiniciar el proceso Spring Boot.
3. **Alcance Diferido respecto a Operaciones CRUD Completas**:
   - No se implementan edición de atributos de activos ya creados (`PUT /api/assets/{id}`) ni transición manual desde UI hacia `DE_BAJA`; ambas capacidades quedan documentadas como mejoras futuras en [PRD.md](PRD.md).
4. **Deuda Técnica Menor en Interfaz y Accesibilidad**:
   - **Responsive en barra superior**: A `500px` de ancho, `TopNavbar.tsx` presenta `scrollWidth = 571px` sobre `innerWidth = 500px` por mantener los 3 botones de navegación en una sola fila sin `flex-wrap`.
   - **Asociación `label`/`for` en formularios**: Chrome DevTools reportó avisos (`9` campos sin `<label for=...>` asociado y `12` campos sin `id`/`name`) en los inputs del modal/filtros.
5. **Deuda Menor en Backend y Cobertura de Tests**:
   - Hibernate `6.5.3` emite el warning `HHH90000025` porque `spring.jpa.database-platform=org.hibernate.dialect.H2Dialect` en [application.properties](backend/src/main/resources/application.properties) es innecesario (autodetección nativa).
   - El backend cuenta con `11` pruebas automatizadas (`JUnit 5`), mientras que el frontend se valida mediante `tsc -b`, `vite build`, `oxlint` (`0` errores, `0` warnings) e inspección manual/Chrome DevTools (sin suite unitaria Vitest/Testing Library en v1.0).

---

## 6. Estructura de Entregables del Repositorio

```
c:\dev\Laboratorio_IA\
├── .gitignore                     # Exclusiones globales de build, dependencias y logs
├── PRD.md                         # Documento de Requerimientos de Producto (Aprobado)
├── design.md                      # Sistema de diseño BodegaCore Industrial Asset
├── mockups/
│   └── stitch/                    # Mockups exportados desde Stitch (PNG y HTML)
│       ├── dashboard.html / .png
│       ├── catalogo.html / .png
│       └── modal_asignacion.html / .png
├── SPEC-TECNICA.md                # Especificación técnica, API, modelo y Plan de Pruebas
├── README.md                      # Manual reproducible, matriz P01-P10 y hallazgos
├── run-tests.mjs                  # Script raíz para ejecutar suite de pruebas backend
├── specs/                         # Trazabilidad OmniSpec y capturas reales en evidence/
├── backend/                       # Módulo Backend Spring Boot 3.3.5 + H2
│   ├── mvnw.cmd / mvnw            # Maven Wrapper
│   ├── pom.xml                    # Dependencias Web, JPA, H2, Validation, Test
│   └── src/
│       ├── main/java/com/bodegacore/
│       │   ├── model/             # Entidades JPA (Asset, Custodian, Enums)
│       │   ├── repository/        # Repositorios JPA con queries personalizadas
│       │   ├── service/           # Lógica de negocio (AssetService, DashboardService)
│       │   ├── controller/        # Controladores REST (/api/assets, /api/dashboard, /api/custodians)
│       │   ├── dto/               # DTOs y Request Payloads
│       │   ├── exception/         # Manejador global RFC 7807 ProblemDetail
│       │   └── config/            # Precarga de 20 datos (DataInitializer) y CORS
│       └── test/java/com/bodegacore/ # Suite de 11 pruebas unitarias e integración
└── frontend/                      # Módulo Frontend React 19.3.1 (TypeScript + Tailwind)
    ├── package.json
    ├── tailwind.config.js         # Tokens de color y bordes industriales
    └── src/
        ├── types/                 # Interfaces y contratos de tipos estrictos
        ├── lib/                   # Utilidades cn(), formatCOP() y formatDate()
        ├── services/              # Clientes REST tipados (api, asset, custodian, dashboard)
        ├── components/
        │   ├── ui/                # Componentes atómicos estilo shadcn/ui con Better UI
        │   ├── shared/            # TopNavbar, Skeletons (CLS=0), EmptyState, ErrorAlert
        │   └── assets/            # KPISection, DistributionBar, Recommendations, Filters, Table, Modals
        └── views/
            ├── DashboardView.tsx  # Tablero Ejecutivo con métricas en vivo
            ├── CatalogView.tsx    # Catálogo con filtros desacoplados P03 y P04
            └── CustodiansView.tsx # Directorio de custodios (P05)
```
