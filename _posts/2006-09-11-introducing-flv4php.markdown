---
layout: post
title: Introducing FLV4PHP
category: Code
tags: [ webdev, php, flv, flash ]
---

This weekend I found some time to work in a new project. In the last post I
wrote about streaming video for Flash players, I went thru some different
options for that task and one of them was the HTTP progressive download of FLV
files.

There is an interesting idea to make seeking possible when using a simple HTTP
download (I think Google Video does just this), it has been already [mentioned][1]
in a [few][2] [places][3].

There are some tools already which can inject the needed metadata into an flv
file, namely, [FLVTool2][4] and [flvmdi][5]. The [ffmpeg][6] project can create
FLV files and there seem to be already patches to support the creation of
metadata entries too.

Over the years I’ve come to love to develop readers for obscure (not standard
neither well documented) file formats, it’s quite a challenge to do it but
since the file format spec is not public you have a very good excuse when bugs
are found :)

So I’ve started to work on a system to serve video (and also audio only) files
to Flash based players with support for seeking. The idea is to just limit
ourselves to use PHP and Flash technologies, no shell scripts or compiled
programs, since they are difficult to get running on most shared hosts.

Right now the FLV analyzing library is finnished and the sample metadata
extraction tool can process a 140Mb FLV in just 1.3 seconds on my cheap
DreamHost test system.

So take a look at the project page, right now I’m looking for an Action Script
guru to help out with the development of the player. I’ve tried to get my brains
around Flash but I haven’t got much success :(

By the way, all this work will be used for an upcoming project I’m planning. Am
I the only one who think that current web photo gallery systems suck?



[1]: http://www.flashcomguru.com/index.cfm/2005/11/2/Streaming-flv-video-via-PHP-take-two
[2]: http://xprojects.co.uk/modules/news/article.php?storyid=5
[3]: http://flashforever.homeip.net/blog/?p=16
[4]: http://www.inlet-media.de/flvtool2
[5]: http://www.buraks.com/flvmdi/
[6]: http://ffmpeg.mplayerhq.hu/