---
layout: post
title: RISON, a compact JSON specially suited for URIs
category: Code
tags: [javascript, webdev, json, rison]
---


I was looking for a way to efficiently pass data between cross-domain iframes
using the location hash trick. The first thing that I checked was JSON but the
payload gets huge when url encoded, then I tried with base64 encoding which
helps but not very much. Finally I found [RISON][] which in short is nothing
more than a reformulation of JSON's control characters to make them more URI
friendly.

It'll basically use `(` instead of `{`, `!(` instead of `[` or
`!` instead of `\` to escape stuff. The result is quite good with savings
of a 50% on average when url encoding the result. The only problem I had was that
the source code no longer seems to be maintained and the only copy I could find
was in the [repository of a project in google code][1].

So I've implemented my own version taking as example [JSON's official reference
implementation][2] API and rolling in a really simple token based parser. It
passes all the [test fragments from RISON's home page][3] and the performance is quite
good for moderately sized payloads.

The code is licensed under the liberal [MIT License][4] and can be downloaded from my
[subversion repository][5].


*[JSON]: JavaScript Object Notation

[RISON]: http://mjtemplate.org/examples/rison.html
[1]: http://code.google.com/p/jsonstore/source/browse/branches/0.3/jsonstore/paster_templates/htdocs/js/rison.js?r=89
[2]: http://json.org/js.html
[3]: http://mjtemplate.org/examples/rison.html#examples
[4]: http://www.opensource.org/licenses/mit-license.php
[5]: http://svn.pollinimini.net/public/rison