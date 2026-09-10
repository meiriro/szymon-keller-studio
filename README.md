# Szymon Keller — Referencias

Prototipo estático, sin dependencias de instalación. Abrir mediante un servidor HTTP, no con `file://`.

## Edición
- `dist/data/references.json`: todo el contenido. `references` conserva las notas fijas. `projects` contiene títulos, operación visual, aplicación propuesta e imágenes.
- Cada imagen contiene `src` local, `originalUrl`, `source`, `credit`, `caption`, `alt` y `annotations`. La posición de una anotación usa coordenadas `x`, `y` de 0 a 1.
- `dist/app.js`: componentes reutilizables, navegación y estados de error.
- `dist/styles.css`: reglas comunes de layout.
- `DESIGN_SYSTEM.md`: reglas visuales y cambios explícitos.
- `CONTENT.md`: decisiones editoriales y registro vivo 1–8.
- `research/allowed-links.json`: inventario autorizado original. Waves House se autorizó adicionalmente y está documentado en CONTENT.md.

## Navegación
Índice → click o Enter sobre proyecto. Ficha → flechas de pantalla, flechas del teclado o desplazamiento horizontal. Escape regresa al índice. Fuentes y notas conserva las notas de cada referente y enlaza las fichas relacionadas.

Los créditos pendientes no deben completarse por inferencia. Las aplicaciones a Szymon son propuestas para la reunión, no afirmaciones sobre su práctica.
