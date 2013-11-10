---
layout: post
title: A really simple include filter for Drupal
category: Code
tags: [webdev, php, drupal]
disqus: http://pollinimini.net/blog/really-simple-include-filter-drupal
---

I've been using [Texy!][1] lately to write in my Drupal powered blog, it's a
great Markdown/Textile replacement and it even has a syntax highlighting addon
which helps a lot to publish source code in the posts.

I've found however a problem. I usually keep my source files in my subversion
repository and sometimes I want to show the syntax highlighted code of one of
those files in the post. I was getting tired to copy-pasting the contents so
I've implemented a dead simple Drupal input filter which dynamically includes
a local or remote file as simple text in the content. I guess it can be useful
too without Texy!

The syntax is very easy to use and remember:

    {include http://myserver.com/myfile.ext}

The module will use the Curl extension if available to fetch remote files, so it can work on hosts like DreamHost, which don't allow URLs via nomal file functions.

Here is the .info

    name = Include Filter
    description = This module allows to include a text file in a node.
    package = Filters
    version = 1.0
    core = 6.xCopy to clipboard

And the .module

{% highlight php %}
<?php

function includefilter_filter($op, $delta = 0, $format = -1, $text = '') {
    switch ($op) {
        case 'list':
            return array('Include filter');

        case 'description':
            return t('Allows to include a text file in the content. Give it a negative weight so it\'s processed before all other filters');

        case 'prepare':
        case 'process':
            $text = preg_replace_callback('!{include\s+([^}]+)}!', '_includefilter_replace', $text);
            return $text;

        case 'no cache':
            return false;
        default:
            return $text;
    }
}

function _includefilter_replace($m) {
    if ( preg_match('!^https?://!i', $m[1]) && function_exists('curl_init') ) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $m[1]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
        $txt = curl_exec($ch);
        curl_close($ch);
    } else {
        $txt = @file_get_contents($m[1]);
    }

    if ( $txt === false ) {
        return '*IncludeFilter: Error including "' . $m[1] . '"*';
    }

    return $txt;
}
{% endhighlight %}


> Note: Remember to give this filter a negative weight so it gets executed before
> any other filter in your input format.

[1]: http://texy.info/en/