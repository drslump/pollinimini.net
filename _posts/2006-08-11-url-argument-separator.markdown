---
layout: post
title: URL argument separator
category: Code
tags: [webdev, php]
---

Quite so often a web developer starts thinking what’s wrong with the guys who
make the rules of how Internet works. And if we dig a bit in the problem, we
can many times see that the ‘non-sense’ is there not because the specs were
flawed but because the popular implementations didn’t follow completely the spec.

The ‘non-sense’ I’ve been thinking about lately is why the hell we use the
ampersand **&** to separate the arguments in a URL. My problem with using the
**&** as separator is that in todays world of XML crazyness, the ampersand must
be handled with care. It seems that the specs said that any character could be
used after the initial query char mark **?** but the **#** which marks the start
of the fragment. Actually, in the current specs for URI/URL syntaxis they
recommend the semicolon **;**

So the decision to choose the ampersand as the defacto standard was taken by
the guys who took the lead with the CGI scripts and the dynamic web content
generation.

Since the specs recommend the use of the semicolon I thought “ok, no problem,
I’ll just use it from now on” with a grin in my face. If you are thinking the
same keep reading because it’s not that easy. My server-side language of choice
right now is PHP, so I build up a simple test script to check out if the
semicolon worked ok, but it didn’t. After consulting php.net for a bit more of
information I found the solution, there are two ini directives which define the
argument separators, one for input and the other for output (I guess this last
one is used to manage the session id without cookies). `arg_separator.input` and
`arg_separator.output` are the names of the directives. The first one takes a
string as argument and every char in that string becomes an argument separator,
the second one defines what will PHP use when building URLs as separator.

The bad news is that the default value is just the ampersand **&**. The good news
is that both directives can be defined per directory, so we can put them in our
.htaccess in a shared host. If you control the host just edit the php.ini file.
Logically we can’t modify them with ini_set() because the URL is already
processed when our script starts execution (see below for a solution to this).

    php_value arg_separator.input "&;"
    php_value arg_separator.output ";"

Note that I left both: the ampersand **&** and the semicolor **;** as valid
argument separators, I’m far too used to the ampersand and I don’t want to
expend my whole life debugging an application just because I forgot that I
decided that the semicolon was a better suit :)

Even if we can’t use the `ini_set()` function to modify the PHP behaviour for
this, we can still make use of a different argument separator by processing the 
`$_GET` and `$_REQUEST` arrays and splitting them by our preffererd argument
separator. The following code snippet show do it but please don’t use it in
production environments, it’s probably flawed!


{% highlight php %}
<?php
// first join the PHP splitted arguments
$get = '';
foreach ($_GET as $k=>$v) {
          $get.= $k . '=' . $v . ';';
          // remove from the arrays, we'll add the correct ones later
          unset($_GET[$k]);
          unset($_REQUEST[$k]);
}

// split the query string using our desired char
$args = split(';', $get);
// process the query string and rebuild the _GET and _REQUEST array
foreach ($args as $arg) {
          // now separate the key from the value and assign them to the arrays
          list($k,$v) = explode('=', $arg);
          if (! empty($k)) {
              $_GET[ $k ] = $v;
              $_REQUEST[ $k ] = $v;
          }
}
{% endhighlight %}


Changing the argument separator does not only help out when working with XML
based technologies but also to give your site URLs a geeky look ;)