---
layout:   post
title:    Migrating the blog to Jekyll
category: personal
tags: [ blog, ruby, drupal, jekyll ]
---

Since I barely post anything new in this blog any more I thought that migrate it to 
a new system might bring some more life to it. It started years ago running on [Textpattern][],
then I migrated to [Drupal][] since I wanted to experiment with it a bit and now
it's being generated with [Jekyll][].

The former two use a database for persistence of the content while the later, Jekyll, 
generates static files from the content which are then uploaded to the web server hosting
this blog. The change has been quite nice, since now I don't need to login into a CMS
administration web panel and get lost in the little details of each publishing system.
My workflow is improved because I'm _forced_ now to write the content using my preferred
text editor, even when I'm offline, allowing me to concentrate on the content instead
of the _tool_.

Even if publishing gets a bit more complicated, involving _rsync_'ing the new content
on my laptop with the published html files in the server, there is a great advantage in 
having a system which generates a static rendition of the site. Since no database or 
interpreted language is needed, the runtime can be served with a very simple and efficient 
setup. It's allowed me to bring down the server steady memory usage from 120Mb of my 
previous _LAMP_ setup to a mere 30Mb of the current [nginx][] one.


*[LAMP]: Linux Apache MySQL and PHP
[Textpattern]: http://textpattern.com 
[Drupal]: http://drupal.org
[Jekyll]: http://github.com/mojombo/jekyll
[nginx]: http://nginx.net
