---
layout: post
title: A web development environment (II) - Cygwin
category: Code
tags: [software, webdev]
---

Following with the series I will introduce in this chapter [Cygwin][].

Cygwin is an excellent collection of Unix utilities and programs ported to
Windows. While its _emulation_ of an Unix like environment is quite good I
actually don’t use it. I install it just for the helpful utilities it has.
Although I do occasionally use its shell to perform some command line tasks
which on Windows’ cmd.exe would be a real nightmare to perform.

Lets set it up and then we can see some tips and tricks.

 - Download the [Cygwin installer][]
 - Move the installer (setup.exe) to `c:\dev\cygwin` and launch it
 - Set the _Root Directory_ to `c:\dev\cygwin` and the _Local Package Directory_
   to `c:\dev\cygwin\packages`
 - Choose at least the following packages to install. You won’t probably need
   all of them but in my experience these are the most commonly used and they
   don’t take much space actually:

   Admin
   : shutdown

   Archive
   : unzip, zip

   Base
   : bash, findutils, grep, gzip, run, tar, sed, termcap, terminfo

   Database
   : sqlite3

   Devel
   : binutils, automake, cvs, cygport, gcc, make, subversion

   Editors
   : nano, vim

   Graphics
   : ImageMagick

   Interpreters
   : m4, perl, python, ruby

   Net
   : curl, openssh, openssl, rsync

   Shells
   : bash, bash-completion

   Text
   : less, tidy

   Utils
   : bzip2, cygutils, diffutils, gnupg, patch, scree

   Web
   : cadaver, curl, httping, links, lynx, wget

 - Now wait for all packages to download and install (it will take a while)
 - Once the installation is complete we can launch the Cygwin system by running
   `c:\dev\cygwin\cygwin.bat`
 - On the first run it’ll create a new configuration and home directory for our
   user. Follow the instructions given on the terminal to complete the installation.

Ok, so Cygwin is now setup and it’s time to learn a few tips.

On a standard installation Cygwin will create a home directory for the user in 
`c:\dev\cygwin\home\[USER]`. However we might want to re-use our Windows folder
so we have a unique location for our stuff. To do it we just need to create an
environment variable (in _System Preferences_) called `HOME` with the path to our
profile folder (`c:\Users\[USER]` in Vista). Now we have to edit `/etc/passwd`
and change the home folder to our Windows profile one (`/cygdrive/c/Users/[USER]`),
we can move the contents of the old home folder to the new one with the following
commands:

    $ mv /home/[USER]/* /cygdrive/c/Users/[USER]/.
    $ mv /home/.* /cygdrive/c/Users/[USER]/.

By default the Windows drive letters are accessible in `/cygdrive/[DRIVE]`, that
is ok but it’s used often so we can save a few key strokes by creating symlinks
at the root of the file system. Create one for each of your drive letters so you
can access them as `/[DRIVE]/my/path/to/a/file`.

    $ ln -s /cygdrive/c /c

As we have seen Cygwin uses Unix like paths so to launch Windows programs from
the shell we have to make an extra step and that is to convert between paths.
Fortunately there is a little tool called `cygpath`. When used without modifiers
it will translate a Windows path to a Cygwin one and when used with the **-w** or
the **-m** modifiers it will do the opposite conversion.

Another nice tool is cygstart which launches a program (or the default program
associated with a document). The good about it is that it will launch the program
and detach the process from the console.

For commonly used programs it’s a bit uncomfortable to use `cygpath` and `cygstart`,
like for example to launch our favourite text editor. In this example I’m going
to use Notepad as an example. We just have to change our bash init script (`~/.bashrc`)
to include a function to launch Notepad easily from the command line. Add the
following to your `.bashrc` file:

    notepad () {
        cygstart "c:/Windows/System32/notepad.exe" "`cygpath -w $1`"
    }

Now we can edit the contents of a text file just doing `notepad /var/log/setup.log`.
This is a great way to really integrate Cygwin with Windows, which actually makes
the Cygwin system ready for real work.

Another useful utility is [cdargs][] which while not an official part of the Cygwin
system can be compiled from source. To install it we just have to download
its [latests source tarball][1] and unpack it into your Cygwin home directory. Then
issue the following commands:

    $ cd cdargs-1.XX
    $ ./configure
    $ make
    $ make install
    $ cp contrib/cdargs-bash.sh /etc/profile.d/.
    $ source /etc/profile.d/cdargs-bash.sh

Explaining how to use this tool is beyond the scope of this article. There is a
nice [mini tutorial at Linux.com][2] and [Google][3] will give you plenty of
information about this tool.

There is a lot of software compatible with Cygwin beyond the packages included
in the official repository. The [Cygwin Ports project][4] offers a few dozens of
applications already compiled and ready to be installed. It’s well worth a look.
Besides there are many Unix/Linux applications which can be compiled to be used
in Cygwin even if they don’t redistribute the binary packages.


[Cygwin]: http://www.cygwin.com/
[Cygwin installer]: http://www.cygwin.com/
[cdargs]: http://www.skamphausen.de/cgi-bin/ska/CDargs
[1]: http://www.skamphausen.de/downloads/cdargs
[2]: http://www.linux.com/articles/114073
[3]: http://www.google.com/search?q=cdargs%2Btutorial
[4]: http://cygwinports.dotsrc.org/
