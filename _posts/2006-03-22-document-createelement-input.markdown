---
layout:   post
title:    document.createElement('INPUT')
category: Code
tags: [ webdev, javascript ]
---

Just a quick post about yet another Internet Explorer glitch

When you want to add a new input element to a page, you must define the type
attribute before including the new element in the document tree.

{% highlight javascript %}
var inp = document.createElement('INPUT');
inp.setAttribute('type', 'checkbox');
document.body.appendChild(inp);
{% endhighlight %}

I was going crazy because I had the 2nd and 3rd lines swapped, which makes
Internet Explorer display the input element as type text and gives an exception
when trying to change the type.

In my coding style, even if it’s not the more efficient one, I try to append the
new elements just after creating them so I don’t forget to do it.

Ideally, to optimize the execution speed, we should always add the element when
it’s completely defined, to avoid browser redraws. Even if we need to add a
bunch of elements, it’s better to create them in a document fragment, outside
the document tree, and when we are done just insert the whole fragment.
