---
layout: post
title: Detecting IE with JS conditional comments
category: Code
tags: [ webdev, javascript ]
---

I just stumbled upon a short yet excellent post on Dean Edwards blog. It shows
how to use IE proprietary javascript conditional comments to detect if we’re
running on IE in a secure and very short way.

{% highlight javascript %}
var isMSIE = /*@cc_on!@*/false;
{% endhighlight %}

Further down in the post’s comments someone named Lucky propose the use of a
variant to check against IE 5.5+ and IE7. javascript:

{% highlight javascript %}
var ieScript/*@cc_on=@_jscript_version@*/;
if (ieScript) // IE
if (ieScript>=5.5) // IE 5.5 +
if (ieScript==5.7) // IE 7.0 VistaCopy to clipboard
{% endhighlight %}

Moreover Dean also shows in one of the comments how to check for the rendering
path used by IE (quirks VS strict modes)

{% highlight javascript %}
var ieStrict = document.compatMode == 'CSS1Compat';Copy to clipboard
{% endhighlight %}

While is not very wise to abuse the sniffing of browsers vendors it’s also true
that sometimes it’s required to split the code path in order to support the
incompatibilities among browser vendors and versions.


[1]: http://dean.edwards.name/weblog/2007/03/sniff
[2]: http://dean.edwards.name/