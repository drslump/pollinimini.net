---
layout: post
title: Netbeans and Ubuntu 64bits
category: Technology
tags: [ide, java, jdk, jvm, linux, netbeans, ubuntu]
---

I've been having some very annoying problems with Netbeans IDE running under
Ubuntu Jaunty and Karmic. The Java virtual machine process would start to consume
memory, probably due to a bug in Netbeans, at a very fast rate, after just 20
minutes of moderate use it would have consumed about 1Gb of RAM. This means that,
on my 2GB laptop, the system starts to paginate the memory on disk, severely
affecting the overall performance of the system.

It was a strange behavior since one of the reasons why I settled on Netbeans
recently is that it was more responsive and less demanding on resources than
Eclipse. I certainly didn't have any problem with it on Windows (Xp and Vista)
or Apple's OSX.

The culprit seems to be the JDK used. I installed the Sun version of the JDK via
the official apt repositories, since my system is 64bits it installed the 64bits
version of the JDK. Unfortunately there is something wrong with it, at least when
used for Netbeans, since changing to the 32bit version of the JDK seems to have
solved the problem. At least the memory consumption stays below the 300Mb after
a couple of hours.

These are the steps I took to install the 32bit JDK on Ubuntu:

 - Obtain java-package: sudo apt-get install java-package
 - [Download the 32bit binary, just the JDK, from Sun][1]
 - Create a deb package from the JDK binary we just downloaded:

        DEB_BUILD_GNU_TYPE=i486-linux-gnu DEB_BUILD_ARCH=i386 fakeroot make-jpkg jdk.xxx.bin

 - Install the created deb package

        sudo dpkg -i sun-xxx.deb

 - Now edit your [netbeans.conf][2] file and point `netbeans_jdkhome` to the
   newly installed JDK directory. You can know it by checking the installed
   Java environments with `sudo update-alternatives -config java`


[1]: http://java.sun.com/javase/downloads/widget/jdk6.jsp
[2]: http://wiki.netbeans.org/FaqNetbeansConf