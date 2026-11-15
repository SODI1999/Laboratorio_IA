---
name: BodegaCore Industrial Asset
colors:
  surface: '#f8fafc'
  surface-dim: '#f1f5f9'
  surface-bright: '#ffffff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8fafc'
  surface-container: '#f1f5f9'
  surface-container-high: '#e2e8f0'
  surface-container-highest: '#cbd5e1'
  on-surface: '#0f172a'
  on-surface-variant: '#475569'
  outline: '#cbd5e1'
  outline-variant: '#e2e8f0'
  primary: '#0f172a'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#f8fafc'
  secondary: '#2563eb'
  on-secondary: '#ffffff'
  secondary-container: '#eff6ff'
  on-secondary-container: '#1d4ed8'
  tertiary: '#d97706'
  on-tertiary: '#ffffff'
  tertiary-container: '#fef3c7'
  on-tertiary-container: '#92400e'
  error: '#dc2626'
  on-error: '#ffffff'
  error-container: '#fee2e2'
  on-error-container: '#991b1b'
  background: '#f8fafc'
  on-background: '#0f172a'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.375rem
  md: 0.5rem
  lg: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

# BodegaCore: Sistema de Diseño para Gestión de Activos de Bodega

## 1. Identidad Visual y Filosofía
El sistema de diseño para BodegaCore adopta un estilo **Industrial Corporativo y de Alta Precisión**. Está concebido para entornos operativos, almacenes de alta demanda y departamentos de TI donde la legibilidad instantánea, la densidad de información controlada y el contraste inequívoco son primordiales.
- **Cero Clichés de IA**: Se prohíben estrictamente los degradados púrpuras, las sombras flotantes desmedidas y los bordes con resplandores difusos. La interfaz proyecta sobriedad, utilidad e ingeniería.
- **Jerarquía Tipográfica Robusta**: Se fundamenta en la fuente **Inter** para facilitar la lectura rápida de códigos de placa alfanuméricos (`ACT-001`), números de serie y montos financieros.

## 2. Paleta de Colores y Semántica de Estados
- **Fondo Base (`#f8fafc`)**: Slate neutro muy claro que previene la fatiga visual en jornadas prolongadas.
- **Superficies y Tarjetas (`#ffffff`)**: Blanco puro con borde fino perimetral de 1px (`#e2e8f0`).
- **Texto Principal (`#0f172a`)**: Slate oscuro de máximo contraste para títulos y datos críticos.
- **Estados Operativos del Activo**:
  - `DISPONIBLE`: Badge en fondo `#ecfdf5` con texto verde esmeralda `#059669`.
  - `ASIGNADO`: Badge en fondo `#eff6ff` con texto azul zafiro `#1d4ed8`.
  - `EN MANTENIMIENTO`: Badge en fondo `#fef3c7` con texto ámbar preventivo `#b45309`.
  - `DE BAJA`: Badge en fondo `#f1f5f9` con texto gris pizarra `#64748b`.

## 3. Matriz de los 4 Estados Obligatorios
- **Loading**: Skeletons estructurados que respetan el ancho y alto final de las tarjetas y de las filas de la tabla para garantizar Cumulative Layout Shift (CLS) = 0.
- **Empty**: Cuando un filtro no arroja resultados o la bodega no tiene registros, se renderiza una ilustración lineal simple con explicación clara y un botón de acción (CTA) directo (ej. "Limpiar filtros" o "Registrar primer activo").
- **Error**: Alerta de bloque con borde izquierdo acentuado en rojo `#dc2626`, mensaje comprensible y botón de reintento inmediato sin recargar toda la página.
- **Ideal**: Información visualmente estructurada con filtros reactivos, paginación clara y acciones por fila bien definidas.

## 4. Componentes Clave
- **Tarjetas de Indicadores (KPIs)**: Contenedor con valor numérico grande en negrita, etiqueta superior descriptiva y un indicador de tendencia o porcentaje de salud.
- **Tabla de Activos**: Encabezados claros, filas alternas sutiles con hover `#f8fafc`, badges de estado legibles y botones de acción tipo ghost/outline para evitar sobrecarga visual.
- **Modal de Transición (Asignar / Mantenimiento)**: Diálogo centrado con backdrop translúcido oscuro (`rgba(15, 23, 42, 0.4)`), validaciones en línea en rojo accesible y botones de confirmación sólidos.
