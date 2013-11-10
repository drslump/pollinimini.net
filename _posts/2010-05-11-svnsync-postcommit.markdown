---
layout:   post
title:    Subversion svnsync post-commit hook work around
category: Code
tags: [ subversion, svn ]
---

Just a quickie for future reference. Svnsync is a tool that comes with Subversion
that allows to create read-only mirrors of Subversion repositories.

Creating a mirror is quite easy and usually involves the following steps:

 * First we create a standard subversion repository.

        mkdir mirror
        svnadmin create mirror

 * Now we have to create a pre-revprop-change hook that only allows the _svnsync_
   write access to it. Remember that the mirror is read-only. Put the following
   contents in `mirror/hooks/pre-revprop-change`.

        #!/bin/sh

        if [ "$3" = "svnsync" ]; then exit 0; fi
        echo "Only svnsync user may edit revision properties through svnsync" >&2
        exit 1

 * To activate the hook we need to give it executable permissions.

        chmod +x mirror/hooks/pre-revprop-change

 * Configure the synchronization

        svnsync init --username svnsync \
            file:///path/to/mirror \
            https://url.to/repository

 * Finally perform the synchronization! You can put this command in the cron
   system for example to ensure the mirror is kept up-to-date.

        svnsync sync file:///path/to/mirror


There is a problem though with this setup if we want to use a _post-commit hook_.
_svnsync_ works by first committing a synced revision with its own user and then, in a
second step, modifies the revision properties to change the author and date to those
of the original repository. This means that _post-commit_ hooks which need to obtain
the revision author or date cannot be property run, since the reported author and date
will be wrong.

The solution is to use a different hook, _post-revprop-change_, which is triggered
each time a revision property is changed. We can have something as the following
script to emulate a normal _post-commit_ hook.

  {% highlight sh %}
  #!/bin/sh

  REPOS="$1"
  REV="$2"
  USER="$3"
  PROPNAME="$4"
  ACTION="$5"

  # Only do actual work when the "svn:date" property is modified, which seems
  # to be the last revision property modified by the svnsync process.
  if [ "$ACTION" = "M" -a "$PROPNAME" = "svn:date" ]; then
    AUTHOR=`svnlook author $REPOS -r $REV`
    DATE=`svnlook date $REPOS -r $REV`
    LOG=`svnlook log $REPOS -r $REV`

    echo "$REPOS@$REV: $LOG by $AUTHOR at $DATE"
  fi
  {% endhighlight %}


