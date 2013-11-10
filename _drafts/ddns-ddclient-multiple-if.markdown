---
layout:   post
title:    DDNS, ddclient and multiple interfaces 
category: System
tags: [ webdev, system, osx ]
---

This is mostly a note to the future me that won't remember how I finally 
configured this.

Since most of my work are web pages and I'm working on them from the same
computer in different networks (office, home, parents ...), I resorted to 
having a wildcard subdomain pointing to 127.0.0.1 for my projects. This allows 
me to have the local web server configured for different projects with 
_Virtual Hosts_ instead of ports.

However when I want to show something I have on my local web server to a 
co-worker, he has to come and watch it on my laptop. This is not always 
easy since he might be sitting next to me, in another floor or even in another 
city.

By using a DDNS provider like [dyndns](http://dyndns.com) or [no-ip](http://no-ip.com) I can improve this experience by resorting to use my
_LAN_ ip address for that domain instead of my loopback interface. The setup
is very simple by using [ddclient](http://sourceforge.net/apps/trac/ddclient).

Since I already have a DNS server I can use a free account for the DDNS provider
and provide wildcard subdomain support in my DNS server with a CNAME entry.

    *.me.pollinimini.net CNAME drslump-latop.dyndns.org

Unfortunately I'm not always connected thru the same network interface. Sometimes
I'm enjoying a low latency ethernet while others I'm connected thru WiFi. To
instruct _ddclient_ to fallback to the WiFi interface if the Ethernet one is not
connected turns out to be quite simple in OSX.

    -cmd "ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null"

It will return the IP address assigned to en0 (Ethernet) but if not connected
will fetch the IP from en1 (WiFi).

Now I just need to figure out how to obtain the VPN IP when I'm telecommuting.
