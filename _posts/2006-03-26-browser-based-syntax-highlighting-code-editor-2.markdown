---
layout:   post
title:    Browser based syntax highlighting code editor (part ||)
category: Code
tags: [ webdev, javascript ]
---

In a previous post I was moaning about the lack of a proper browser based (dhtml
powered) syntax highlighting code editor.

I took the aproach descrived in that post of using a translucent textarea over
the syntax highlighted code to achieve the result with the minimum of effort.
Well, it hast turned out that it won’t work as fast as spected. The performance
is horrible, at least in Firefox, so I’ve abandoned this aproach.

However, as I already have the code to highlight the code in real-time, I’m
trying to implement the code editor following a more natural aproximation, which
is to capture the keyboard input and process it. To speed up development time
I’m focussing just in Firefox, but I guess it’ll be portable to IE, Opera 8.x
and Safari quite easily.

To capture the input from the user we need to handle some events: onFocus,
onBlur and onKeypress. Unfortunatly Gecko only allows onKeypress events on input
and textarea fields (IE doesn’t have this limitation). To sort this problem out
we just need to create a non-visible text input field (style.display: none)
which receives the focus when the element containing the editor does. This way
we can trick Gecko and make use of onKeypress evens (in IE this won’t work,
since it doesn’t fire events on non-visible elements). The drawback with this
is that the selection, if any, is lost when changing the focus to the input
field, however it can be easily solved by recreating the selection range after
switching focus.

The syntax highlighting algorithm uses regular expressions, since they should be
much faster than implementing a traditional tokenizer/lexer in javascript. This
means that, at least for now, the highlighting can’t be nested (“Hello $userName”
is rendered in one color, as string, without applying another style to the
variable $userName). Basicly, what the code does is create an internal structure
divided in lines which in turn have N blocks. Each block defines an offset from
the start of the line and a style (normal, comment, string …)

{% highlight javascript %}
// comment
$text = "string test";
{% endhighlight %}

becomes

{% highlight javascript %}
[
    {
        offset: 0,
        blocks : [
            {
                    offset: 0,
                    style: 'comment',
            }
        ]
    },
    {
        offset: 10,
        blocks: [
            {
                offset: 0,       // $text
                style: 'var',
            },
            {
                offset: 5,       //  =
                style: 'normal',
            },
            {
                offset: 8,       // "string text"
                style: 'string',
            },
            {
                offset: 22,      // ;
                style: 'normal',
            }
        ]
    },
]
{% endhighlight %}

This data structure is specially suited to parse source code, where most tokens
can’t span over multiple lines. However, it’ll be very limited for languages
like XML until we don’t support a stack based tokenizer (just a simple finite
state machine).

That’s it for now, next installment will probably focus on how to handle the
keyboard events :)
