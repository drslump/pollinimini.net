---
layout: post
title: Programmatic reflection effect
category: Code
tags: [webdev, php]
---

Today [Haripako][] pointed us to [Thomas Fuchs][] (of [script.aculo.us][] fame)
[DHTML image reflection effect][1]

It uses 1px tall divs with an adjusted top offset for the containing image and
the opacity property to perform it. Well, you just need to know some basic
arithmetics to create this kind of effects, but I guess that if people find
this kind of stuff so cool is just because most of them only do maths to check
their wages :)

So here is some PHP to perform the same effect on the server side

{% highlight php %}
<?php
$file = 'test.png';

// Configuration params
$mirrorSize = 1.35;   /* 1 .. 2 */
$startAlpha = 80;     /* 0 .. 127 */

// Adjust params to supported limits
$mirrorSize = max( 1, min($mirrorSize, 2) );
$startAlpha = max( 0, min($startAlpha, 127) );

// Load the source file
$imgSrc = ImageCreateFromPng( $file );

// Create the reflect portion
$imgRfl = ImageCreateTrueColor( ImagesX( $imgSrc ), floor(ImagesY( $imgSrc ) * ($mirrorSize-1)) );
ImageAlphaBlending($imgRfl, true);
ImageFill( $imgRfl, 0,0, ImageColorAllocate( $imgRfl, 255,255,255 ) );

$offset = ImagesY( $imgSrc ) - ImagesY( $imgRfl );

// In this loop we flip the source image and apply a fade out
for ($y = 0; $y < ImagesY( $imgRfl ); $y++)
{
    ImageCopy( $imgRfl, $imgSrc, 0,$y, 0,ImagesY( $imgSrc )-$y-1, ImagesX( $imgRfl ), 1 );
    $alpha = floor( ($y*(127-$startAlpha)) / ImagesY( $imgRfl ) );
    $color = ImageColorAllocateAlpha( $imgRfl, 255,255,255, 127-$startAlpha-$alpha );
    ImageFilledRectangle( $imgRfl, 0, $y, ImagesX( $imgRfl )-1, $y+1, $color );
}

// Create the image buffer which will be outputted
$imgDst = ImageCreateTrueColor( ImagesX( $imgSrc ), ImagesY( $imgSrc ) * $mirrorSize );
ImageAlphaBlending($imgDst, false);

// Paste into the output buffer the original image and the reflect portion
ImageCopy( $imgDst, $imgSrc, 0, 0, 0, 0, ImagesX( $imgSrc ), ImagesY( $imgSrc ) );
ImageCopy( $imgDst, $imgRfl, 0, ImagesY( $imgSrc ), 0, 0, ImagesX( $imgRfl ), ImagesY( $imgRfl ) );

ImageDestroy( $imgSrc );
ImageDestroy( $imgRfl );

// Output the image
header('Content-type: image/png');
ImageSaveAlpha( $imgDst, true );
ImagePng( $imgDst );

ImageDestroy( $imgDst );
{% endhighlight %}

I’ve tried to keep it very simple, so it’ll only work with PNG files. Moreover
it’s hardcoded for white backgrounds, althought it can be easily changed.

If you use this be sure to cache the result, since the cpu cycles to process
images is quite high.


[Haripako]: http://franciscovargas.net/
[Thomas Fuchs]: http://mir.aculo.us/
[script.aculo.us]: http://script.aculo.us/
[1]: http://mir.aculo.us/articles/2006/04/27/like-reflections-try-the-reflector
