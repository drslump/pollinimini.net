---
layout:   post
title:    Browser based syntax highlighting code editor
category: code
tags: [ javascript, webdev ]
---

I’ve been looking for a working source code / plain text editor which can be run
on a browser. There are dozens of WYSIWYG html editors out there (see [here][1]
for a comprehensive list). However, for pure source code or just plain text I
just found two options: [Helene][2] and [About:Edit][3].

The first one, Helene, is open source software but it’s not ready for production
use. The other one, About:Edit, looks really cool but it’s commercial which is
good but I can’t afford to buy a license, so it’s not a realistic option in my
case.

Thinking a bit about the main problem of that kind of editors, it seems to be
that browsers don’t support natively the editing of hightlighting code, even if
it can be emulated with the WYSIWYG editors it doesn’t feel like it’ll be very
efficient and/or clean. So I took another approach, which is a bit of a hack
but I think that can solve my needs pretty well. The hack is just to use modern
browsers absolute positioning and opacity settings. We just place a div below a
textarea, with the same sizes, then put the opacity of the textarea to 30% and
we set the text color to white. Then we just need to update the underlying div
with the changes in the textarea, all the text editing, cut&paste, selection ...
is handled natively by the browser but we can style the contents (like syntax
highlighting) in the div.

It doesn’t look perfect, since the half transparent textarea makes the colors
look too soft but the speed is great and it’s really easy to implement.

Expect a simple demo sometime next week, I’m a bit too busy right now too expend
my time on this kind of experiments :(


[1]: http://www.geniisoft.com/showcase.nsf/WebEditors
[2]: http://helene.muze.nl/
[3]: http://aboutedit.com/
