---
layout: post
title: Comprobar un NIF, NIE o CIF
category: Code
tags: [ webdev, php ]
---

Después de postear un simple código para comprobar un NIF, me he mirado un poco
más el tema y para mi sorpresa no hay mucha información sobre esto.

Así que aquí presento una pequeña función para comprobar si el formato de un NIF,
NIE o CIF es válido.

{% highlight php %}
<?php
function checkIdentidadFiscal( $str )
{
    //normalizamos el formato
    $str = preg_replace( '/[^0-9A-Z]/i', '', $str );

    // El formato es de un NIF o un NIE
    if (preg_match('/X?[0-9]{8}[A-Z]/i', $str))
    {
          //para no duplicar código, eliminamos la X en el caso de que sea un NIE
          $str = preg_replace('/^X/i', '', $str);

          //calculamos que letra corresponde al número del DNI o NIE
          $stack = 'TRWAGMYFPDXBNJZSQVHLCKE';
          $pos = substr($str, 0, 8) % 23;
          if (strtoupper( substr($str, 8, 1) ) == substr($stack, $pos, 1) )
              return true;
    }
    // El formato es el de un CIF
    else if (preg_match('/[A-HK-NPQS][0-9]{7}[A-J0-9]/i', $str)) //CIF
    {
          //sumar los digitos en posiciones pares
          $sum = 0;
          for ($i=2; $i<strlen($str)-1; $i+=2) {
              $sum += substr($str, $i, 1);
          }

          //Multiplicar los digitos en posiciones impares por 2 y sumar los digitos del resultado
          for ($i=1; $i<strlen($str)-1; $i+=2) {
              $t = substr($str, $i, 1) * 2;
              //agrega la suma de los digitos del resultado de la multiplicación
              $sum += ($t>9)?($t-9):$t;
          }

          //Restamos el último digito de la suma actual a 10 para obtener el control
          $control = 10 - ($sum % 10);

          //El control puede ser un número o una letra
          if ( substr($str, 8, 1) == $control ||
               strtoupper(substr($str, 8, 1)) == substr('JABCDEFGHI', $control, 1 ))
              return true;
          }

          return false;
    }
}
{% endhighlight %}

El algoritmo para comprobar el CIF lo he sacado de [aquí][1].


[1]: http://es.geocities.com/softcv/codigo/cif.html

