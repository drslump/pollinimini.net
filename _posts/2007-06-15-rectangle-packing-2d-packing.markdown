---
layout: post
title: Rectangle Packing (2D packing)
category: Code
tags: [ javascript ]
disqus: http://pollinimini.net/blog/rectangle-packing-2d-packing
---

I’m working on a little thing which I don’t want to speak about just now, lets
see if I can get it to do what I want first before making it public. However
for that project I needed to pack several small rectangles of varying dimensions
into a bigger one without them overlapping.

At first it seem like an easy task but the more I thought about it the more
difficult it was. After a bit of research I found out that until today this
seems to be a non resolved problem, there are algorithms which offer a pretty
decent approximation to the optimal result though. The problem is commonly
known as the Bin Packing problem and in this case I needed to work with two
dimensional objects (rectangles) so it gets a lot more complicated.

After more googling I found an article by Jim Scott with pseudo code to solve a
similar problem, the article explains on how to pack several lightmaps into a
single texture. It was the easiest to understand algorithm I had found so I went
ahead and implemented it in PHP. I had it in a few minutes but I wanted to fine
tune the results by feeding it the rectangles by different sorting criteria,
since it seems to be a good way to achieve the best results. Well, I got tired
to slowly generating the image in PHP to check the results with every minor
variation so I implemented a JavaScript version which allows to see the result
in real time.

This algorithm can be used for a wide variety of problems, from packaging small
sprites in a big image to allocate tasks in complex projects (use the width for
the team developers and the height for the time).

A simple usage example could be as follows:
{% highlight javascript %}
var coords,
    packer = new NETXUS.RectanglePacker( 512, 512 );

for (var i=0; i<images.length; i++) {
    coords = packer.findCoords( images[i].width, images[i].height );
    alert( 'Image of ' + images[i].width + 'x' + images[i].height +
         ' allocated at ' + coords.x + 'x' + coords.y
    );
}
{% endhighlight %}

I’ve put up a [demo][] so you can try it and see the results with different
parameters. Tip: the best results seems to be with the blocks sorted by the
magic method and reversed.

You can [download the source code from this link][dl].


[1]: http://en.wikipedia.org/wiki/Bin_packing_problem
[2]: http://www.blackpawn.com/texts/lightmaps/default.html
[dl]: /files/RectanglePacker.js
[demo]: /demos/RectanglePacker.html