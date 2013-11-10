---
layout: post
title: Como escribir números
category: Technology
---

Vaya por delante que el tema no está demasiado estandarizado a nivel
internacional. Lo que realmente supone un problema a la hora de interpretar
números en un mundo globalizado como el actual.

Una cosa si que hay en común, según el Sistema Internacional, no se deben
separar los millares, en el caso de que haya de hacerse para mejorar su lectura,
se hará mediante el uso de un espacio de no rotura, que viene a ser un poco más
estrecho que un espacio normal. Este espacio puede introducirse en un editor de
textos como Microsoft Word mediante la combinación Ctrl+Shift+Espacio
(Ctrl+Espacio para OpenOffice). El código unicode es U+00A0 y en HTML es el
conocido &nbsp.

Para los decimales la cosa es algo más complicada. Hay dos grandes zonas
geográficas con dos estilos distintos. La notación anglosajona usa un punto,
mientras que en la mayoria del resto de paises se usa la coma.

Así pues todas las siguientes formas son correctas:

 * 123456\.78
 * 123 456.78 
 * 123456,78
 * 123 456,78

A la hora de implementar una aplicación, donde se deben introducir números, lo
mejor es soportar todos los formatos en la entrada de información y
normalizarlos a la hora de operar con ellos. Si nuestra aplicación solo operará
en una región, podemos limitarnos al uso de ese formato específico, aunque hoy
en día, y especialmente en apliaciones web, nunca es bueno suponer que solo
será usada en una región límitada.

