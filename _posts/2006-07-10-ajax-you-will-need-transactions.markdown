---
layout: post
title: Doing Ajax? you'll need transactions!
category: Code
tags: [webdev, javascript]
---

In an embarrassing attempt to bring some more visits to this blog I’ll start to
post about buzzwords. After some months of fighting against it I’ve finally
understood that there is no point in teaching people that AJAX, Web 2.0 and the
like are just silly buzzwords about quite old technologies. So from now on I’ll
get into the bandwagon and start using those buzzwords.

Getting into the stuff that matters, lets start with the basics. As you should
already know, the web works on top of the HTTP protocol, which by design is
based on a request-response paradigm. It’s a proven design which works like a
charm for the typical web, where static pages are loaded from an URL, however
the Web is evolving to a new kind of pages. The current trend is to make web
pages which act like the typical thin client, where the bulk of the operations
and domain logic (model) is performed on the server but the application flow
(controller) and display (view) is handled on the client side with the help of
JavaScript and DOM.

Looking at the whole picture, you’ll need perspective here, AJAX web pages are
Web Service Brokers. This exposes a big problem, since we’re sill using server
side software focussed (read optimized) on the traditional web, while the client
side is moving to support the thin client paradigm. The main trouble here is the
design concept of the web where each page is an atomic unit, so we need to take
some considerations when developing ajaxified web pages if we don’t want to hurt
performance seriously.

Most AJAX frameworks expose some simple examples to demonstrate their
functionality. They work ok, they do quite cool things, but looking at them a
bit closer there are some grey areas. Besides the popular live-search, update
on checkbox click or the plain spellchecker, there is a lot more functionality
promised by the AJAX hype. Take for example a datagrid widget, like an Excel
spreadsheet, there are some complex processes running on the background when
working with it. When editting a cell we need to send the new value to the
server, check if it worked ok and fetch any other updates on calculated cells
which could have been affected by that change. So we have several weak points
(mainly by the inherent network unreliability) which would need checks. In the
previous example of the datagrid, imagine that the fetch of the affected cells
fails, the application state on the client side and on the server side will be
different and this is a major concern when working with thin clients.

To solve this problem we have to use transactions (already popular on the RDBMS
world). Transactions will allow us to emulate the web principle that each
page/action is atomic. In the case that something goes wrong we can rollback
the changes and our application state will be kept the same on both sides.

Extending on this idea, we can even optimize the request-response cycle by using
an Unit of Work pattern for example. We compose a list of actions and send it
when finished to the server instead of sending individual actions. Network
latency is always an issue and the asynchronous nature of AJAX is not used too
often in practice, when we make a change we expect an inmediate update. By
packing the actions in Units of Work we can optimize the client-server
interaction and support transactions quite easily.

Remember that for the tipical RPC the web server needs to spawn (or fork) a new
process, load the dynamic language interpretter, parse thousends of lines of
code, perform a DB connection and do the actual work. Even when having a
properly setup backend (opcode cache, fast-cgi), the overhead of a RPC is huge.
Packing actions together seems like a great solution for performance problems.


*[AJAX]: Asynchronous Javascript and XML
*[DOM]: Document Object Model
*[RDBMS]: Relational Database Management System
*[RPC]: Remote Procedure Call