---
layout: post
title: Xdebug bookmarklet
category: Code
tags: [php, webdev, xdebug]
---

Nothing really new since there is already a [firefox extension][1] which does
just the same, but I also wanted to support other browsers.

So this bookmarklet toggles the cookie Xdebug uses to check if it should debug
the running script or not!.

<p>
    <a href="javascript:(function(){var idekey='', minutes=10, exp=new Date(); document.title='Xdebug disabled'; if(document.cookie.match(/(^|;)\s*XDEBUG_SESSION=/)){minutes=-minutes;} else { if(!idekey) idekey=prompt('Set the IDE key for this debugging session if needed (cancel to disable)','default'); if(idekey===null){minutes=-minutes}else{document.title='Xdebug enabled'}} exp.setTime(exp.getTime()+minutes*60*1000);document.cookie='XDEBUG_SESSION='+(idekey?idekey:'default')+';expires='+exp.toGMTString()}())">Toggle Xdebug</a>
</p>

Drag it to your bookmarks (or favorites or whatever your browser calls it) toolbar
so it's easy to access. Assign it a keyboard shortcut, if your browser has that
function, and you're done.

By default it'll prompt for the _idekey_ to be used by Xdebug, it's a good idea to
modify the _idekey_ variable at the start of the bookmarklet's source with your
_idekey_ or with _default_ if you're not using a DBGp proxy.


[1]: https://addons.mozilla.org/en-US/firefox/addon/3960