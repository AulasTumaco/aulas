# AulasTumaco — Sistema de Gestión de Aulas en Tiempo Real

**Equipo:** Alexander Rodriguez· Darwin Iturre

**Idea:** Plataforma web que permite visualizar y gestionar en tiempo real el estado
de los salones de clase de la Universidad de Nariño sede Tumaco. Muestra si cada
salón está libre, ocupado o reservado, qué materia se dicta en él, qué docente lo
tiene asignado, cuántos estudiantes hay versus la capacidad física del espacio, y
hasta qué hora está en uso. El sistema alerta automáticamente cuando hay
incompatibilidad entre el número de matriculados y la capacidad del salón.

**Usuario objetivo:** Coordinadores académicos y personal administrativo de la
Universidad de Nariño sede Tumaco que necesitan conocer y gestionar la ocupación
de espacios físicos sin depender de llamadas, papeles o consultas manuales.

**Problema que resuelve:** La asignación de salones se hace de forma manual o con
información desactualizada, lo que provoca conflictos de horario, salones
subutilizados y grupos numerosos asignados a espacios insuficientes. AulasTumaco
centraliza toda esa información en una sola pantalla, actualizada en tiempo real,
y avisa cuando hay un problema antes de que ocurra.

---

## Entidades del sistema (mínimo 5)

| Entidad | Datos principales |
|---|---|
| **Salón** | código, nombre, edificio, capacidad máxima, equipamiento (proyector, AC, tablero) |
| **Materia** | nombre, código, programa académico, número de matriculados |
| **Docente** | nombre completo, correo, programa al que pertenece |
| **Reserva** | salón + materia + docente + fecha + hora inicio + hora fin + estado |
| **Programa académico** | nombre del programa (ej. Ingeniería de Sistemas, Administración) |

---

## Páginas principales

- **Dashboard en tiempo real** — vista general de todos los salones con su estado
  actual (libre / ocupado / reservado), barra de ocupación y hora de liberación
- **Listado de salones** — tabla con filtros por estado, capacidad y edificio
- **Formulario de registro de salón** — crear o editar un salón con sus atributos
- **Formulario de reserva** — asignar materia + docente a un salón en una franja
  horaria específica
- **Listado de materias** — con número de matriculados y programa al que pertenecen
- **Vista de horario semanal** — grilla por salón y por día con todas las franjas
- **Panel de alertas** — salones en sobrecupo, espacios sin asignar, conflictos de
  horario detectados automáticamente

---

## Distribución de roles

| Rol | Integrante | Responsabilidades |
|---|---|---|
| Frontend | Alexander Rodriguez | HTML5, CSS, Bootstrap, diseño responsivo |
| Backend | Darwin Iturre | NestJS, rutas, conexión a base de datos, sesiones, API REST |



## Tecnologías propuestas

- **Frontend:** HTML5 + CSS + Bootstrap
- **Backend:** NestJS (Node.js)
- **Base de datos:** MySQL

---

## Opiniones del equipo sobre la idea

- **Alexander Rodriguez: esta de web ayudaria a la organizzacion academica de la udenar sede tumaco 
- **Darwin Iturre:es una idea bien diseñada para la inconformidad de muchos estudiantes
