---
layout: post
title: Some brief notes on TextAreaPlus
category: Personal
---

Been a quite long time since the last update. I’m a bit ashamed for not keeping
the blog updated regularly but I must confess that I’ve been expending my time
on other affairs more important to me.

Anyways, in this weeks I’ve been working again on TextAreaPlus, actually I’ve
been busy making a full rewrite of the lexing scanner and optimizing the
implementation to the limits of my knowledge. The algorithm used is described
in the [project wiki][1].

Today I was re-installing the PC at work since it broke havoc yesterday. After
finishing the installation of almost all softwares I decided to have a look for
a notepad replacement which was more feature packed than [Scite][2] and a bit
faster than [Notepad++][3] to perform some minor editing of config files mainly.
In the search I found a couple of new editors which I didn’t knew about but which
seem to be gaining momentum. Both seem to be based on a successful Mac text editor
called [TextMate][4], which I have heard about from Ruby-on-Rails evangelists but
given my allergic reactions to anything mac related lately I didn’t check before.
Today, trying those two new editors I got interested in TextMate and I’ve been
learning about it in the last hour.

So long history short, I thought I had invented the sliced bread with my
implementation and design ideas for TextAreaPlus but it turns out that Allan
Oddgaard, the TextMate developer, already implemented it in a very similar way
a couple of years ago. My feelings are a bit conflictive right now, in one way
I feel sad because I just reinvented the wheel but in the other I feel reassured
to have come up with a solution which turns out to be proved and successful.

I’ve written a couple hundred words with a couple of links in this post using a
lame browser textarea, in moments like this I wish I had already a production
ready version of TextAreaPlus. Lets hope I don’t keep wishing for it too long.


[1]: http://code.google.com/p/textareaplus/wiki/Lexer
[2]: http://www.scintilla.org/SciTE.html
[3]: http://notepad-plus.sourceforge.net/
[4]: http://macromates.com/