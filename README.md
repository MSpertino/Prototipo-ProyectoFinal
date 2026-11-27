# Transporte JP Zampa — prototipo interactivo

Prototipo navegable para la presentación del Proyecto Final. Es una versión local, sin backend, enfocada en las dos vistas solicitadas:

- Administrador: resumen operativo, recorridos, vehículos, choferes, alertas y alta de recorridos.
- Chofer: jornada, recorrido asignado, checklist de salida, avisos, inicio/finalización y reporte de incidentes.
- La vista del chofer está optimizada como aplicación móvil: en escritorio se muestra dentro de un ancho tipo celular y en teléfonos ocupa todo el ancho disponible.
- La vista del chofer tiene tres accesos inferiores: Inicio, Recorrido y Checklist.
- La IA está disponible desde Inicio mediante el asistente “IA JP Zampa”, con respuestas orientativas y consultas libres.

## Organización del código

- `app.js`: navegación, autenticación, sesión y eventos generales.
- `roles/administrador/`: pantallas y componentes propios del Administrador.
- `roles/chofer/`: pantallas móviles y navegación inferior del Chofer.
- `modulos/ia/`: tarjeta y modal conversacional del asistente IA.
- Login: primero se selecciona el perfil y luego aparece únicamente el formulario correspondiente para Administrador o Chofer.

## Cómo iniciar el servidor

Desde esta carpeta ejecutá:

```bash
npm start
```

Después abrí [http://localhost:5173](http://localhost:5173). No conviene abrir `index.html` directamente como `file://`, porque los módulos separados necesitan cargarse desde un servidor HTTP.

## Flujo sugerido para la presentación

1. Seleccionar Administrador o Chofer en la pantalla inicial.
2. Ingresar con el formulario del perfil elegido.
3. En Administrador, mostrar el resumen y entrar en Recorridos, Vehículos y Choferes.
4. Cambiar a vista Chofer, completar el checklist, iniciar y finalizar el recorrido.
5. Mostrar el modal de “Reportar incidente” y el panel de notificaciones.

El archivo `documentacion.pdf` es una copia local de la última entrega usada como referencia durante el armado del prototipo.
