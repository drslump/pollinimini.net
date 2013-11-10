---
layout: post
title: The Binary Search algorithm
category: Code
tags: [ webdev, javascript ]
---

Long time since I last wrote here so I’ll take the opportunity to introduce
(just joking) the Binary Search algorithm.

I was looking for a safe way to find the line of text where a user clicks the
mouse. I needed this for the TextArea+ editor. Fortunately Mozilla supports the
DOM3’s compareDocumentPosition() function, so I took advantatge of it. Since I’m
using a UL with an LI child element for each line of text, I can say that
UL.childNodes is an ordered array, which fits perfectly for the Binary Search
algorithm.

The algorithm is really simple (I’m sure most of you have used it before), we
just need to find the middle point between two points and compare its value with
the one we’re looking for. We do this recursively until we either find the value
or the right point becomes smaller than the left one, which means that the value
is just not there.

Here comes a really simple example of this algorithm (without using recursive calls)

{% highlight javascript %}
var left = 0;
var right = 100;

while (left <= right) {

    middle = floor( (right-left)/2 ) + left;
    if (haystack[mid] == needle) {
        alert('Found!');
        break;
    }
    if ( needle < haystack[middle] )
        right = middle-1;
    else
        left = middle+1;
}
{% endhighlight %}

The Binary Search algorithm performs at O(log n) time, but for TextArea+ I use
a number of further optimizations. Since it’s likely that the user will click
closely to where the cursor currently is, I just check the N precedding and
following lines before. If this fails I check the current viewport and if still
not found, then just do a full search. And this is just for the Mozilla code
path! hell, how I hate cross-browser coding!

This post is meant to remind us how important is to learn already known and
proved algorithms and that even when having a good algorithm, there is always
room to optimize by taking advantge of our specific problem.
