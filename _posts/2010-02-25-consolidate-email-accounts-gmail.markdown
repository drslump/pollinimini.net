---
layout: post
title: Consolidate e-mail accounts in GMail
category: Technology
tags: [email, gmail, pop3, imap, smtp]
---

Over time GMail has been giving options to easily consolidate email accounts
with them, however they offer it under its conditions, which might not always
match your requirements.

For example, they allow to fetch mail from a remote account with POP3 only, not
IMAP. Moreover, the frequency by which they fetch new mails is not very reliable,
going from 5 minutes to upto an hour!

Recently they introduced the posibility to use a remote SMTP server to deliver
emails from consolidated email addresses, _fixing_ the issue with Outlook mail
clients displaying the infamous _"on behalf of"_ tag. However they only support
remote SMTP servers offering secured connections (TLS) or at least secured
logins (STARTTLS).

To solve the mail forwarding issue, a veteran program by the name of [fetchmail][]
can be easily used. Here is my config to fetch email via the IMAP protocol and
forward it using a _sendmail_ like command line _MDA_ tool.

In `/etc/fetchmailrc`

    set daemon 120

    poll MY.IMAP.SERVER imap
        username "MY_REMOTE_USERNAME" password "MY_REMOTE_PASSWORD"
        smtpname "MY_GMAIL_USERNAME+MY_TAG@gmail.com"
        keep
        mda '/usr/sbin/sendmail MY_GMAIL_USERNAME@gmail.com'


Fetchmail will even allow to specify which IMAP folders to fetch, so you can
configure it to also forward your _Sent_ folder for example.

Since I didn't want to install a full SMTP server just for forwarding the
email, I went with [msmtp][], which is a SMTP client for relaying to a
SMTP mailhub or _smart host_. Note that we can't use GMail's SMTP server for
this task, since it'll rewrite the _From_ header from the messages, meaning that
all the emails will look like they come from ourselves.

In `/etc/msmtprc`

    defaults
    tls off
    logfile /var/log/msmtp.log

    account MY_ACCOUNT
    host SMTP.HOST.NET
    port 25
    auth login
    user SMTP_USERNAME
    password SMTP_PASSWORD
    from SMTP_EMAIL_ADDRESS

    account default : MY_ACCOUNT


_msmtp_ should install a _symlink_ under `/usr/sbin/sendmail` so it gets somewhat
compatible with it for the most simple tasks. Note that it won't do local delivery
but instead connect to the configured SMTP server to relay the email messages.

With this setup I can get new messages almost instantly in GMail. Now I needed
to solve the use of a custom SMTP server in GMail, to avoid the _"on behalf of"_
issue with Outlook recipients.

Since the SMTP server of my consolidated account didn't offer TLS neither
STARTTLS, I had to create a secure tunnel for it in my hosting server with [stunnel][].
You can learn to generate a certificate for the SSL connections from its site
and documentation. What follows is just the section of the configuration to
secure the SMTP tunnel.

    [ssmtp]
    accept = 587
    connect = REMOTE.SMTP.SERVER:25
    protocol = smtp


Now in GMail settings I can simply configure a remote SMTP server for my
consolidated email by using the address of the server running the
tunnel on port 587, which upon a connection will _proxy_ the request to the
actual remote SMTP server.


Finally I have a really consolidated external email address in GMail. The setup
is quite easy to implement and light on resources.


[fetchmail]: http://fetchmail.berlios.de
[msmtp]: http://msmtp.sourceforge.net
[stunnel]: http://stunnel.org
