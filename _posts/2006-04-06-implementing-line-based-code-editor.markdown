---
layout:   post
title:    Implementing a line based code editor
category: Code
tags: [ webdev, javascript ]
---

To my surprise I couldn’t find much info on the net about implementing text
editors. So I had to figure it out on my own, however as often happens, while
implementing it I found some info when looking for related stuff.

There seems to be two common ways to implement text editors, those which are
line-based and those which are block-based. I started with the block-based
approach, dividing the text buffer in tokens and storing the position and color
attributes in each block. Soon I found that this approach gets pretty complex
quite fast. So I turned the code into a line-based editor. It’s almost like the
block based with the main difference that it makes an intermediate division
based on lines of text. This allows to simplify the code at the expense of a
bit of overhead.

For each line of text we need to store the actual text (or the coordinates to
fetch it from a buffer), the offset relative to the start of the text, the
parser state at the start of the line and block definitions for that line.
Since we have broken down the text in lines, for each block we just need to
store the offset relative to the start of line which contains it, the length
of the block and the style of it. The following figure illustrates the whole
concept.

![Figure](/resources/linebased.png)

To make all this work we just need a function which parses a single line of
text. This function would take as arguments a string with the line of text and
the parser context at the start of that line. It will return the blocks found
and the parser context at the end of the line.

The code would roughly look like this:

{% highlight javascript %}
txtLines = split('\n', text);
lines = new Array();
context = new Context();
offset = 0;
for (i=0; i < count(txtLines); i++) {
   lines[i].source = txtLines[i];
   lines[i].offset = offset;
   lines[i].state = state;
   lines[i].blocks = parseLine( txtLines[i], context );
   offset += strlen( txtLines[i] );
}
{% endhighlight %}

The advantatge of the line based approach is that it’s very easy to reparse the
text to display any changes on the syntax highlighting. To do so we just need to
parse each line from the modified one to the end until the parser context matches

{% highlight javascript %}
context = line[i].context;
do {
   lines[i].blocks = parseLine( lines[i].text, context );
   i++;
} while ( context != line[i].context );
{% endhighlight %}

Most of the time, buffer changes will only affect a line and most lines will
only be a few chars long, so we have a really optimized solution with only a
few lines of code.

In overall, writing a fast text editor is quite simple if we only optimize for
the common cases. In fact, I’m having more problems optimizing the display
routines than the buffer updating ones.
