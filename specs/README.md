# Laboratorio_IA — OmniSpec

Aquí quedan los acuerdos de cada cambio: qué se decidió, por qué y con qué evidencia se cerró. Todo empieza en el chat de tu agente: `/omni-init` para conocer el proyecto y `/omni-discuss` para explorar una idea sin crear documentos.

## Cómo avanza un cambio

1. **Conversar:** `/omni-discuss` explora y responde; no crea archivos.
2. **Especificar:** `/omni-specify` crea solo el documento principal del cambio.
3. **Clasificar:** el agente evalúa riesgo, claridad y tamaño con `fit`. La ruta decide cuánta documentación hace falta.
4. **Construir y cerrar:** se implementa y `/omni-converge` registra la evidencia con `verify` y `complete`.

| Ruta | Cuándo | Documentos |
| :--- | :--- | :--- |
| **Ligera** | Cambio claro, de bajo riesgo, fácil de revertir y con pruebas | Solo el documento principal |
| **Estándar** | Toca varios archivos o módulos, o no tiene pruebas | Documento principal + diseño |
| **Completa** | Riesgo alto, contratos públicos, ambigüedad o difícil de revertir | Documento principal + diseño + tareas |

## Tipos de cambio

| Tipo | Para qué | Documento principal | Se suma en rutas estándar/completa |
| :--- | :--- | :--- | :--- |
| **Feature** | Capacidades nuevas | `spec.md` | `plan.md`, `tasks.md` |
| **Bugfix** | Errores e incidentes | `bug.md` (incluye causa raíz y prueba de regresión) | `rca.md`, `fix.md` |
| **Deuda técnica** | Refactors y actualizaciones | `audit.md` | `migration-plan.md`, `tasks.md` |
| **RFC** | Decisiones de arquitectura | `rfc.md` | — |

Las plantillas maestras vienen integradas en OmniSpec y se invocan desde el chat con tu agente. `specs/project-context.md` guarda el contexto y las decisiones del proyecto.

Las ramas y los commits los decides tú; OmniSpec no los crea.
