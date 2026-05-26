# Requerimientos iniciales del proyecto

## Cliente simulado

**Nombre del cliente:** Santa Cruz  
**Institución:** Universidad de Nariño, sede Tumaco  
**Sector:** Académico  
**Rol dentro del proyecto:** Representante de la perspectiva del usuario final

---

## Presentación del cliente

Buenos días, equipo. Mi nombre es **Santa Cruz**, gerente del área académica-operativa de la **Universidad de Nariño, sede Tumaco**. En este proyecto voy a representar la perspectiva de los usuarios finales: administradores de aulas, instructores y estudiantes.

Nuestra necesidad principal es contar con una **plataforma web que permita visualizar y gestionar en tiempo real el estado de las aulas**. Actualmente tenemos dificultades para saber con claridad qué espacios están libres, ocupados o reservados, qué clase se está desarrollando, quién la orienta y si el aula realmente tiene capacidad suficiente para la cantidad de estudiantes inscritos.

Esta situación genera problemas operativos como cruces de horarios, uso inadecuado de salones, grupos ubicados en aulas pequeñas, pérdida de tiempo al buscar espacios disponibles y poca información para tomar decisiones rápidas.

---

## Contexto del problema

La Universidad de Nariño, sede Tumaco, necesita mejorar la administración de sus espacios académicos. En la operación diaria, los administradores deben conocer rápidamente qué aulas están disponibles, cuáles están siendo utilizadas y cuáles se encuentran reservadas para próximas clases o actividades.

Además, los instructores y estudiantes requieren información clara sobre el aula asignada, la materia correspondiente y el tiempo de uso. Cuando esta información no está organizada, se presentan retrasos, confusiones y dificultades para aprovechar adecuadamente la infraestructura física de la institución.

La plataforma debe ayudar a que la gestión de aulas sea más ordenada, transparente y eficiente.

---

## Objetivo general de la plataforma

Desarrollar una plataforma web que permita visualizar y gestionar el estado de las aulas en tiempo real, mostrando información clara sobre ocupación, reservas, materias, instructores, cantidad de estudiantes, capacidad física y alertas por posibles desajustes entre estudiantes inscritos y capacidad disponible.

---

## Requisitos iniciales prioritarios

### Prioridad 1: Visualización clara del estado de cada aula

La plataforma debe mostrar de forma sencilla si un aula está:

- Libre
- Ocupada
- Reservada

Este requisito es urgente porque los administradores necesitan tomar decisiones rápidas sin revisar listas manuales o preguntar aula por aula. Para los estudiantes e instructores, esta información reduce confusiones sobre dónde deben estar y evita interrupciones durante las clases.

**Valor para los usuarios finales:**

- Los administradores pueden identificar espacios disponibles con rapidez.
- Los instructores pueden confirmar si el aula asignada está lista para su clase.
- Los estudiantes pueden ubicarse mejor dentro de la institución.

---

### Prioridad 2: Información completa del uso actual del aula

Cuando un aula esté ocupada o reservada, la plataforma debe mostrar información básica pero suficiente sobre su uso actual o próximo:

- Materia que se está enseñando o se enseñará.
- Instructor asignado.
- Número de estudiantes inscritos.
- Capacidad física del aula.
- Duración del uso del aula.

Este requisito es importante porque no basta con saber que un aula está ocupada. La institución necesita comprender por qué está ocupada, por quién y hasta cuándo, para organizar mejor los espacios académicos.

**Valor para los usuarios finales:**

- Los administradores pueden planificar cambios o reasignaciones.
- Los instructores pueden verificar que el espacio corresponda a su clase.
- Los estudiantes reciben una mejor organización académica.

---

### Prioridad 3: Alerta por exceso de estudiantes frente a la capacidad del aula

La plataforma debe alertar automáticamente cuando la cantidad de estudiantes inscritos supere la capacidad física del aula asignada.

Este requisito es clave para evitar hacinamiento, incomodidad, problemas de seguridad y una mala experiencia académica. Un instructor no debería llegar al salón y descubrir en ese momento que no caben todos los estudiantes.

**Valor para los usuarios finales:**

- Los administradores pueden actuar antes de que ocurra el problema.
- Los instructores trabajan en condiciones más adecuadas.
- Los estudiantes cuentan con espacios más cómodos y seguros.

---

## Decisiones iniciales acordadas

Por ahora, la plataforma debe concentrarse en resolver tres necesidades centrales:

1. Conocer el estado actual de cada aula.
2. Mostrar la información académica asociada al uso del aula.
3. Generar alertas cuando exista un problema de capacidad.

Estas decisiones permiten iniciar el desarrollo con una base clara y útil para la operación diaria de la universidad.

---

## Preguntas pendientes

Durante las próximas sesiones será necesario aclarar los siguientes puntos:

- ¿La plataforma tendrá una vista general tipo tablero para revisar todas las aulas al mismo tiempo?
- ¿Las aulas se organizarán por sede, bloque, piso o listado general?
- ¿Quiénes podrán consultar la información: solo administradores, también instructores o también estudiantes?
- ¿Qué nivel de detalle debe ver cada tipo de usuario?
- ¿Las reservas se mostrarán únicamente para el día actual o también para fechas futuras?

---

## Siguientes prioridades

La siguiente prioridad será definir la forma en que se visualizarán las aulas dentro de la plataforma. Para la institución es fundamental que la información sea rápida de consultar y fácil de entender, incluso para usuarios que no tienen experiencia usando sistemas complejos.

También será necesario revisar cómo se presentarán las alertas de capacidad para que sean visibles, oportunas y útiles en la toma de decisiones.

---

## Cierre de la sesión inicial

En esta primera sesión se estableció que la plataforma debe responder a una necesidad operativa concreta: mejorar la gestión de aulas en tiempo real dentro de la Universidad de Nariño, sede Tumaco.

Los requisitos más importantes son la visualización del estado del aula, la información completa del uso académico y las alertas por problemas de capacidad. Estos elementos deben guiar las primeras decisiones del equipo de desarrollo.
