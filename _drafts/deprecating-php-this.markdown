---
layout:   post
title:    Deprecating PHP's $this-> in favour of Ruby inspired @
category: Code
tags: [ webdev, php, streamwrapper ]
---

One of the things I hate the most about PHP is how verbose it is
with the use of the `$this->` statement to refer to the object's 
instance members.

I was pair programming the other day with a [hardcore Ruby
programmer](1)
and one of the things that most attracted my attention was how instance
variables are defined in Ruby. Just by using `@variable` you can access
them form inside your methods. Their version of static variables is
accessed with `@@variable`, which is not as nice but still better
than `self::$variable` in my humble opinion.

Since I've got some additional experience lately with PHP's user
defined stream wrappers, I've decided to experiment a bit about
this issue. It's fairly trivial to setup an implementation that 
replaces occurrences of `@` with `$this->`. We just need to implement
a stream wrapper, use the `token_get_all` to parse the source code
and search for `@` in the token stream.

This is nothing more than an experiment for now but given that when
using APC, it's able to properly cache the bytecode from sources comming 
from user defined stream wrappers, I don't really see any strong
reassons to not use this in _production_ code.
