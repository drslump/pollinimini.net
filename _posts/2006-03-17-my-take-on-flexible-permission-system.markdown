---
layout:   post
title:    My take on a flexible persmission system
category: Code
tags: [ webdev ]
---

Since I started programming using data sources and more specially web apps, I’ve
always been looking for a flexible enough permission system to use in my
projects. No matter how complicated the permission system implemented was that
the client would ask for a given combination which isn’t supported by it >:(

Just recently a fellow developer told me about OpenLdap permissions system.
I’ve been using a central repository (I call it registry) for all entities in
my database schemas, this allows me to do a very light-weight pseudo object
oriented data layer on top of a relational database like MySQL. This system is
a bit similar to an LDAP datastore, after all it’s nothing more than a
hierarchical object database. However, studying more in detail OpenLdap’s
permission system I had all of the sudden the following idea.

Permission checks must be flexible and very fast, say you have a database with
10 thousend contacts which can be readed by the users in the same group as the
owner and edited by the administration group and by the owner. Obviously you
can’t waste 2 seconds just to query the database for the contacts an user is
able to see in a listing. So I tried to simplify the whole concept, starting by
what is a permission, when applied to an object/entity/resource a permission
can be None, Read, Write or Delete. Things like Print or Export are in fact the
Read permission, only with a different presentation layer. Since it’s only four
possible values we can represent it with a simple integer like 0, 1, 2 and 4
respectively. So now, in this system, you have a registry with all the entities
and another table with all the users. The only missing piece is to relate the
entities with the users, for that the simplest thing to do (and the more
flexible) is just to create a relation table which has a composite primary key
of the entity id and the user id, as an attribute we put the access level we
described as an int above. Now, we said we had 10.000 contacts or entities for
this matter, and say we have 100 users, the resulting relation table could be
upto 10.000×100 = 1 million rows! That is quite a lot of rows, even if it’s
quite doubtfull that we will use the maximum of rows, it’s clear that this
system has a drawback and this is that it won’t scale well with a huge number
of users. I can live with it actually, at least it serves my purposes. If
someone needs an application for some hundreds of users he may probably spend
some bucks on a powerfull server :)

So now we have a system which allows for really flexible permissions but which
only requires a simple table join to check them. Obviously it’s not operative
right now, since we need a way to build the ACL table. In this task is where the
OpenLdap method comes in handy. Basicly it allows to create rules based on the
entity attributes (aka entity fields), so we can create a simple parser for this
rules and populate the ACL table accordingly. Take the following example acl,
it defines that all users can read any entity and the owner can write to it:

     access to *
           by self  write
           by users read
           by *     none

I’m not saying we need to implement OpenLdap’s syntax, it probably doesn’t fit
too well a relational model, however it helps to ilustrate how we can achieve a
very complex permissions system. One thing to note is that when the permission
definition is modified, the whole ACL table needs to be recalculated. However,
when we add a new entry we just need to calculate that new entry, so the overall
performance is quite good.

In my opinion what this method offers compared to other commonly used permission
systems in web applications is that it calculates the permission when
creating/updating objects (or modifying the permission definitions) instead of
performing complex (many times also slower) calculations when selecting data,
which is most cases is the most frequent operation.
