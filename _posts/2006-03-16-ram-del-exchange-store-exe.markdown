---
layout:   post
title:    El uso de RAM del Exchange Store.EXE
category: Technology
tags: [ exchange, software, windows ]
---

Ya me he encontrado en varios servidores que el proceso Store.EXE del Microsoft
Exchange usa cantidades desmesuradas de memoria.

En realidad esto lejos de ser un problema, es una característica del Exchange
desde la versión 2000 creo. Para explicar porque hace esto de chupar memoria
como si fuera un vampiro biteriano, primero hay que explicar como funciona el
sistema de almacenamiento del Exchange.

Cuando recive un nuevo correo/contacto/fichero, vamos lo que sea que tenga que
ser almacenado en los buzones, lo primero que hace es escribirlo en un fichero
de logeado. De esta forma no tiene que estar esperando a que la base de datos
este disponible para meter el mensaje, así que simplemente guarda la nueva
petición en un fichero de log y vuelve a la espera de nuevas entradas. Por otro
lado, un subproceso se encarga de ir procesando esos logs y va introduciendo las
nuevas entidades en la base de datos. Como no tiene prisa por volver a escuchar
nuevas peticiones, puede introducir los elementos en la base de datos de una
forma adecuada. Adicionalmente, este sistema tiene la ventaja de que si se
colgara el servidor (se va la luz, peta el exchange, vuelcas el café en el
teclado…), no se perdería nada, ya que los datos se han guardado en los fichero
de log, y aunque la base de datos quede corrupta por una operación no finalizada,
Exchange puede restaurarla a un estado optimo haciendo uso de esos mismos logs.

Todo este rollo, nos viene al pelo para explicar el porque del alto consumo de
RAM del proceso Store.EXE. Lo que hace es guardar los datos en el log y al mismo
tiempo mantenerlos en memoria, a modo de cache, así que usará toda la memoria
que tengamos disponible para crear un cache lo más eficiente posible. Por
supuesto, los ingenieros de Microsoft no son tan tontos como para pensar que
por ser quienes son tienen derecho a ‘secuestrar’ toda la RAM de un servidor. Lo
que hace este proceso es usar una técnica llamada Dynamic Buffer Allocation, la
cual va usando toda la memoria que quiere pero vigila el uso de la memoria
virtual (cache de disco), si detecta que empieza a usarse la memoria virtual, el
proceso comenzará a reducir su cache para dejar RAM libre a otras aplicaciones.

Como nota adicional, en mi busqueda de información he leido que para calcular la
RAM necesaria para un Exchange (version 2003) se puede usar esta formula:
256Mb + 1Mb * Buzón Logicamente cuanto más RAM tenga mejor rendimiento, debido
al uso del mencionado cache. Por cierto, para servidores con más de 1Gb se
recomienda usar las opciones /3GB /USERVA=3030 en el boot.ini, y cambiar el
valor del registro HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\HeapDeCommitFreeBlockThreshold
a 0×00040000, para evitar la fragmentación de la memoria.