---
layout: post
title: Introducing DBGp Path Mapper intercepting proxy
category: Code
tags: [xdebug, dbgp, php, webdev]
---

My current IDE of choice, [Komodo][], brings native support for the [DBGp protocol][]
to debug source code either locally or from a remote server. <del>It has however some
issues with its path mapping implementation</del>[^1].

Since it’s not the first time I stumbled upon this kind of issue (my previous
[Eclipse PDT][] experience was troublesome too) I finally tried to solve it. The
solution is an intercepting proxy server which listen for connection from the
debugger to modify the messages it sends to the IDE with custom path mappings.

To define the path mappings we use a file with a set of paths on each line. The
path tuples are separated by the => operator, placing the path understood by the
debugger on the left side and on the right the path as understood by the IDE.
The file looks like this.

    # Mapping for projects
    file:///var/www/projects => file:///c:/Users/DrSlump/projects
    # this one is for my subdomains
    file:///var/www/subdomains => file:///c:/subdomainsCopy to clipboard

Note that the path mappings are case insensitive to avoid problems on Windows.

To run the path mapper server we just need to call it from a terminal like so:

    $ php5 dbgp-mapper.php -i 192.168.0.5 -m dbgp.mapCopy to clipboard

The **-i** option specifies the IP or host of the computer where the IDE is running,
while the **-m** option points to the file where the path mappings are defined.
There are also other options which you can check by seeing the built in help using
the **-h** argument.

By default it will bind itself to the port 9000, which is DBGp default one, so
if you are running this on the same computer as your IDE you will have to change
the port either in this tool or on your IDE.

The source is available via [this subversion repository](http://svn.pollinimini.net/public/dbgp-mapper)

[^1]: It seems that Komodo's uri mapping works properly after version 4.2.0. In
      my case I was having problems but after rebooting the system it started to
      work properly.


[Komodo]: http://www.activestate.com/
[DBGp protocol]: http://xdebug.org/docs-dbgp.php
[Eclipse PDT]: http://www.eclipse.org/pdt