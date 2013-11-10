---
layout: post
title: Commenting regular expressions in Javascript
category: Code
tags: [ webdev, javascript, regexp ]
---

I’ve been working a lot lately with regular expressions in Javascript. Being a
really powerful tool it’s quite easy to get shoot on your own feet if you are
not careful.

After pushing the Javascript built in regular expression engine to its limits I
found it lacking some modern features available in most recent versions of regex
engines used in many languages like .Net, C++ Boost, Perl, Ruby or PHP. The
feature I miss the most is the ability to use [look behind assertions][1], with
JS just supporting look ahead ones. Another feature I miss are [named groups][2]
and then one very useful new feature is the /x modifier (also known as ignore
whitespace) which allows regular expression literals to span over multiple lines,
ignoring white space, new lines and embedded comments!

See the following example regex to match an url:

    /\b(https?|ftp):\/\/([-A-Z0-9.]+)(\/[-A-Z0-9+&@#/%=~_|!:,.;]*)?(\?[-A-Z0-9+&@#/%=~_|!:,.;]*)?/i

Writting it is not difficult but modifiing it or even understanding it becomes
an issue. Using the Perl /x modifier it would look like this:

{% highlight perl %}
m/\b                              # match at word break
  (https?|ftp)://                 # protocol: http, https or ftp
  ([-A-Z0-9.]+)                   # domain
  (/[-A-Z0-9+&@#/%=~_|!:,.;]*)?   # file path - optional
  (\?[-A-Z0-9+&@#/%=~_|!:,.;]*)?  # query string - optional
/ix;
{% endhighlight %}

Much easier to understand, isn’t it? At least I really think so. To imitate this 
behaviour in Javascript I’ve written this simple function which just concatenates 
the regular expressions passed as arguments and returns a new one. This allows 
to break a complex regex into smaller pieces and comment them.

{% highlight javascript %}
function xRegExp() {
    var cur, re;
    var arr = [];
    var n = arguments.length;

    // check if the last argument contains the regexp modifiers
    if (/^[gmi]+$/|>.test(arguments[n-1]))
        n--;

    // go thru all the passed regexes and concatenate them
    for (var i=0; i<n; i++) {
        if (typeof arguments[i] === 'string') {
            arr.push( arguments[i] );
        } else {
            // when we cast a regexp object to a string
            // the / delims and modifiers are included
            cur = String(arguments[i]);
            arr.push( cur.substring(cur.indexOf('/')+1, cur.lastIndexOf('/')) );
        }
    }

    // create a new empty regexp
    re = new RegExp();
    // compile the concatenated regex to speed it up
    re.compile( arr.join(''), arguments[n] );
    return re;
}
{% endhighlight %}

Please note that the same thing can be done by concatenating strings manually,
however regexes syntax is terse enough without having to double escape all the
tokens. That’s why I preffer to write them out in their literal form (between
slashes) instead of using quotes.

Using the given function the above example would look like this. Note that you
can use the regexp literal notation or just pass a simple string. The last
argument can optionally pass the modifiers for the regular expression.

{% highlight javascript %}
var re = new xRegExp(
    /\b/,                                 //match at word break
    '(https?|ftp)://',                    //protocol: http, https and ftp
    '([-A-Z0-9.]+)',                      //domain
    '(/[-A-Z0-9+&@#/%=~_|!:,.;]*)?',      //file path (optional)
    /(\?[-A-Z0-9+&@#/%=~_|!:,.;]*)?/,     //query string (optional)
    'i'                                   //Modifiers: case-insensitive
);
{% endhighlight %}



[1]: http://www.regular-expressions.info/lookaround.html
[2]: http://www.regular-expressions.info/named.html