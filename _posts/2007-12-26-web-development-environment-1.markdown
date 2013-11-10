---
layout: post
title: A web development environment (I) - Introduction
category: Code
tags: [software, webdev]
disqus: http://pollinimini.net/blog/a-web-development-environment-i-the-introduction
---

> This will be a series of posts dedicated to document my current
> development setup. This setup tries to be the one of a Ninja. It won’t end
> up with a bunch of boring application windows typical of a bald engineer. It
> also won’t be a group of black terminal windows running vi as a pseudo
> operating system like the average geek wannabe. I’m in the search of the Ninja
> feeling, with white on black text editors, translucent terminals and a dose of
> eye candy so that I feel special without having to resort to browsing youtube
> with Lynx.

After many years I am finally happy with my current development setup. It fits
my needs and this series of articles should serve myself as a reminder on how
to setup the different pieces. However I guess that it will also be of inspiration
for other developers who haven’t already found their peace of mind with their
environment.

I’ll focus on Microsoft Windows systems but most of the stuff can be easily
implemented in other operating systems. Actually much of the things I do for
windows come standard in several operating system distributions, it’s just that
I happen to like Windows (which obviously harms my geek status).

The main building blocks for this environment are the following ones:

Cygwin
:   A collection of very useful Unix utilities for Windows.

coLinux
:   Wonderful _virtualization_ software to run Linux side by side Windows.

Debian
:   The only Linux distro I know a bit about. It’s fantastic so I don’t have the
    need to search for a better one.

PHP5
:   Currently the programming language of my choice.

Console2
:   An excellent terminal emulator with lots of eye candy.

Firefox
:   The browser that came to rule them all.

A lightweight text editor
:   Everyone has its favorite

A heavy IDE
:   Komodo and Eclipse to the rescue

Several utilities to ease our lives
:   TortoiseSVN, kdiff3, wincachegrind, total commander…


Before we begin I would like to note the following:

 - All tools are installed in `C:\dev`. I don’t like polluting the standard Windows
   installation with the development tools. Besides, it allows to easily backup
   most of the environment.
 - I’m using a 32bit version of Windows Vista since coLinux is not compatible
   with 64bit versions.
