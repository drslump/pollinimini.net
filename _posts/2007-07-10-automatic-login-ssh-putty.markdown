---
layout: post
title: Automatic login to SSH with Putty
category: Technology
tags: [ssh, putty]
disqus: http://pollinimini.net/blog/automatic-login-ssh-with-putty
---

Go to the [PuTTY homepage][1] and download PuTTY, PuTTYgen and Pageant. Put them
in an easily accessible directory like `%PROGRAMFILES%\Putty`.

Launch `puttygen.exe` and click on _Generate_, then move your mouse in the space
below the progress bar to create some entropy for the key randomness. Once the
key is generated lets complete the available fields:

 - **Key comment** is just a comment so anything will do, putting username-putty
    seems quite logical.
 - **Key passphrase** is actually a password to unlock the key. Put something
    complex in here but make sure you’ll remember it in the future!!!
 - **Confirm passphrase**, here you just input again the password to confirm
    you know which is it.

Now click on _Save private key_ to store it permanently on your hard disk. Choose
a secure place for it, I can’t strength enough how important is that this key
remains secret. A good location could be `%USERPROFILE%\ssh\putty.ppk`.

Do not close PuTTYgen just yet, we need to copy the public key to our server
(or servers). Connect to the remote server with your username and password as
normal, go to your home directory and create a directory named `.ssh` if it
doesn’t exists already. Create a text file named `authorized_keys2` in the `.ssh/`
directory, inside that file copy the public key from PuTTYgen in a single line,
save the file and exit the shell. Make sure the `.ssh` directory and its contents
are only accessible by you (`chmod -R og= .ssh`). Repeat this step for each
server you want to access with your public key.

The next step is to configure PAgeant (PuTTY Authentication Agent) to
automatically start with Windows. Just create a shortcut in your _Startup folder_,
the target should be something similar to
`%PROGRAMFILES%\Putty\pageant.exe "%USERPROFILE%\ssh\putty.ppk"`, change it to
suit the paths you’ve used.

Double click it to avoid having to restart to launch it, a small pop-up window
should show asking for your passphrase, type it and press Ok. If you have typed
the correct passphrase a small blueish icon should show on you system tray,
right click it to start a new session or launch a pre-configured one. If everything
is allright PAgeant should take care of authenticate you.

Just a simple tip in case you don’t know, you can specify an username together
with the server address by using this syntax: _username@server.com_. This way the
authentication is completely automatic.

There are also another couple of great companion tools from PuTTY: PSCP and PSFTP.
The first is a command line tool to transfer files securely between computers,
the second is a text mode FTP client using a secure SSH connection. Specially
the PSCP can be handy to be used in batch files to automatize some tasks.

**PLEASE READ:** Be careful with using public keys authentication to connect to
a server. The steps I described are ok if you have the access to your computer
restricted, do not leave PAgeant running while you’re away from your computer!


[1]: http://www.chiark.greenend.org.uk/~sgtatham/putty