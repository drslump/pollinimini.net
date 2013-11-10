---
layout: post
title: Los sitios web deberían ser fáciles de crear
category: Technology
tags: [webdev, lamp, mvc]
disqus: http://pollinimini.net/blog/los-sitios-web-deberian-ser-faciles-de-crear
---

Este es un post _filosófico_ que llevo algún tiempo preparando para aclarar mis
ideas. Como dice el título, _los sitios web (aplicaciones web incluidas) deberían
ser fáciles de crear_. El sitio web típico tiene unas pocas docenas de páginas,
un par de formularios y sindicación RSS como mucho. No parece que sea algo muy
complejo, menos aun si tenemos en cuenta que la infraestructura para que
funcionen es asequible, contrastada y potente. Algunos (yo me incluía en ese
grupo hasta hace unos meses) culpan el hecho de la complejidad de crear un buen
sitio web a lo enrevesado del entorno, un entorno no controlado como es un
navegador web, donde las sutiles diferencias entre versiones y marcas suponen
elevar exponencialmente la complejidad de la creación. La realidad en mi
opinión es distinta.

El paradigma de programación más utilizado actualmente para el desarrollo de
sitios web es el popular MVC (Model-View-Controller), algo que ya tiene unos
cuantos años pero que solo en los últimos dos o tres se ha empezado a utilizar
para el desarrollo de webs simples. La idea de ese concepto es que dividimos el
desarrollo en tres capas diferenciadas. El Modelo se encarga de hacer el acceso
a los datos uniforme, la lógica de negocio queda encapsulada en esta capa. La
Vista se encarga de la presentación de la información, formateando los datos
obtenidos del Modelo de una manera atractiva para el visitante. Por último el
Controlador es quien controla quien puede ver que y bajo que circunstancias,
además de ser el pegamento que une todas las piezas. Pues bien, resulta que para
un sitio web normalito no necesitamos tantas capas, porque la realidad es que
esas capas ya existen en la infraestructura utilizada, como por ejemplo con un
stack LAMP.

Apache no es más que un Controlador, MySQL es un Modelo y los ficheros HTML son
la Vista. Estamos de acuerdo en que esa infraestructura es muy genérica y que
trabajar con ella es como construir una casa con herramientas manuales. Pero por
que ocultar totalmente esas herramientas para substituirlas por otras nuevas más
lentas y menos flexibles? Hablemos de REST, la filosofía detrás de la World
Wide Web.

REST es el diseño en el que se modeló la web, se basa en que hay un conjunto de
recursos identificados globalmente (la conocida URL) que pueden obtenerse en
diferentes formatos (HTML, XML, PDF…). El diseño es realmente elegante y lo
mejor de todo es que es algo probado y contrastado durante casi dos décadas. Mi
conclusión es que si hacemos un sitio web este ha de hacerse en base a los
principios básicos del medio donde reside, de lo contrario sería como intentar
hacer un barco para ir por una carretera, seguro que podemos añadir ruedas pero
seguirá pareciendo un barco en vez de un coche.

Así que juntando lo comentado arriba sobre LAMP como framework con el diseño
REST, podemos obtener un sistema muy potente, flexible y fácil de utilizar.
Para empezar tenemos que aprovechar la infraestructura disponible, y
aprovecharla con criterio, como por ejemplo no almacenar las páginas HTML en
una base de datos sino en el disco. A primera vista vemos que solo con el
servidor web, la base de datos y el HTML estamos como hace 10 años, editando
los ficheros con un editor y subiéndolos por FTP para publicarlos. Necesitamos
algo que complete esas herramientas y ese algo son los lenguajes interpretados,
ya sea PHP, Perl, Python, Java o Ruby. Estos lenguajes nos permitirán crear el
pegamento necesario para ofrecer soluciones modernas de una manera simple y
escalable. La idea es volver unos 5 años hacia atrás y retomar la costumbre de
hacer una web con ladrillos, utilizando scripts prácticamente independientes
para crearla. Después de todo PHPNuke fue popular pero no era la solución,
aunque detrás de él hayan aparecido miles de sucesores intentando solucionar
sus problemas, que lo único que han conseguido es ocultar esos problemas con
capas y capas de complejidad añadida.

En un próximo artículo comentaré sobre una posible implementación de todo esto.
La idea básica es la de quitar capas de complejidad de nuestros scripts para
poder concentrarnos en la funcionalidad y el contenido, eliminando posibles
puntos negros de errores y aprovechando la escalabilidad inherente a la web.

