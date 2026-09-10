# Sistema visual — v1 · 09.09.2026

Reglas fijadas por el usuario. Cualquier cambio sustancial debe registrarse aquí antes de aplicarlo.

- Blanco puro, texto negro, líneas finas grises. Sin sombras, redondeados ni decoración startup.
- Helvetica Neue / Helvetica / Arial / sans-serif. Peso 400 en todo el sitio; jerarquía por tamaño.
- Desktop 16:9 prioritario. Lectura horizontal en fichas, índice organizado en filas.
- Índice: grid de proyectos, cada uno con varias imágenes reales superpuestas en una pila rectangular. Inspiración: captura facilitada de Scheltens & Abbenes.
- Hover y foco revelan ROLE + NAME + PROJECT. En pantallas táctiles la identificación permanece visible.
- Detalle: secuencia horizontal, imágenes grandes sin recortar, anotaciones editoriales y llamadas numéricas pequeñas.
- Mucho aire, márgenes de 40 px en desktop, divisiones de 1 px, tamaño de cuerpo 16 px, metadatos 12–14 px.
- Acceso por teclado, foco visible, movimiento reducido y adaptación móvil.
- Fotografías existentes exclusivamente de fuentes autorizadas. No generar imágenes ni simular proyectos.

## Registro de cambios
- v1: dirección original trasladada a reglas de implementación. Sin modificaciones de criterio.
- v2: implementación en cuatro columnas desktop y dos en móvil; fichas con columna editorial y secuencia horizontal. Llamadas numéricas cuadradas con coordenadas relativas a cada fotografía. Se ajusta la altura de la ficha para mantener los controles visibles en 16:9; fondo blanco también en los márgenes de las imágenes. Sin cambios en tipografía, peso, paleta ni estética.
- Las pilas utilizan imágenes de la ficha. Cuando una fuente ofrece menos de tres imágenes, se repiten láminas como representación de archivo; el contador de la ficha refleja las imágenes únicas reales. No se simulan créditos ni tomas adicionales.
- v7: las fichas de la línea «objeto en exterior, instalación y paisaje» incorporan en el encabezado una etiqueta contextual tras el rol. La regla utiliza la misma tipografía, peso y jerarquía ya fijados; no introduce una categoría visual nueva.
- v8: el índice incorpora una barra lateral de filtro con botones de texto y subrayado como único estado activo. Filtrar oculta las fichas ajenas a la categoría; en móvil, los mismos controles pasan a una fila sobre la cuadrícula.
- v9: las categorías se presentan en una columna, alineada con el margen de «Szymon Keller» y «Archivo de investigación», sin rótulo adicional. Al filtrar, la cuadrícula conserva las posiciones y numeración originales; las fichas no coincidentes dejan un hueco en vez de provocar reordenamiento.
- v11: el control «Guardar» aparece bajo el número de ficha durante hover o foco.
- v12: las pilas del índice usan miniaturas cuadradas. El hover abre el acordeón sin alterar el orden de las capas; tras 0,7 segundos, la portada se desvanece para revelar la imagen siguiente. Los metadatos se sitúan próximos a la pila.
- v13: se ocultan los números superpuestos en las fotografías de las fichas. Se conservan los números de las anotaciones editoriales y los controles de navegación.
- v14: solo en móvil, se compacta la altura de las fichas para dejar aproximadamente 20 px entre la pila y los metadatos. «Guardar» se representa con un corazón negro de 17 px; queda delineado al inicio y se rellena al guardar.
