---
layout: post
title: Finally HTML5 goodness for the real world
category: Technology
tags: [webdev, mozilla, firefox, html]
---

Firefox 3.1b3 has arrived and it's stuffed with a ton of new web technologies.
Most of the stuff comes from the [WhatWG][] working drafts, which should mean
that major browser vendors (Mozilla, Microsoft, Opera, Apple and Google) are
aware of the specifications and will incorporate them at some point.

I love this release of Firefox because it is really a giant step forward for web
developers, stuff like [web workers][] (a simple threading scheme for web
applications), cross site XMLHttpRequest via [access control in the server][1],
native JSON support (really fast!), [Drag-n-Drop events][2] and
[Offline persistance][3].

Together with the inclusion by default of the [TraceMonkey javascript engine][4],
these features put Firefox again as the ultimate web development platform.


[WhatWG]: http://www.whatwg.org/
[web workers]: http://www.whatwg.org/specs/web-workers/current-work
[1]: http://dev.w3.org/2006/waf/access-control
[2]: http://www.whatwg.org/specs/web-apps/current-work/multipage/editing.html#dnd
[3]: http://www.whatwg.org/specs/web-apps/current-work/multipage/offline.html
[4]: https://wiki.mozilla.org/JavaScript:TraceMonkey