---
layout: post
title: A web development environment (III) - Firefox
category: Code
tags: [software, webdev]
---

Firefox is a great browser and is also a great development tool in itself. There
are some problems though with the numerous extension available to developers. They
are a great resource when programming but they slow down (and in some scenarios
they might even break) our normal web browsing.

So the idea is to have a normal Firefox installation to use as our browser and
then a separate install (and profile) used only for development purposes. This
way we can install tons of development related addons without worrying about
slowing down our normal browsing. Of course this is only useful if you use Firefox
as your primary browser.

 - Download the [Firefox installer][1]
 - Launch the installer
 - Set the destination folder to `c:\dev\Develfox`
 - Uncheck the options to create shortcuts on desktop, start menu…
 - Uncheck the option to launch Firefox on finishing the setup
 - Go to the installation directory and start a command prompt there

   - Run Firefox with the following command: `firefox.exe -no-remote -ProfileManager`

     - Create a new profile and name it _Devel_
     - Exit the profile manager

   - Create a new batch file name `develfox.bat` with the following contents. It’ll
     copy on each run the firefox executable to `develfox.exe` so we can tell it
     apart from our normal browser on the task manager (we copy it on each run so
     that automatic updates are correctly applied).

         @echo off
         copy "c:\dev\develfox\firefox.exe" "c:\dev\develfox\develfox.exe" > null
         start "" "c:\dev\develfox\develfox.exe" -no-remote -P "Devel"

 - Still on the installation directory go to the `chrome` folder and create in
   there a directory named `icons` and inside that one another called `default`.
   Put in there a custom icon with the name `main-window.ico` to be used as the
   application icon. Check out [IconBase][2] for some nice ones.

   - Create a shortcut on your desktop or another suitable place and use the
     following properties:

     - Target: `c:\dev\develfox\develfox.bat`
     - Start in: `c:\dev\develfox`
     - Change the icon to `c:\dev\develfox\chrome\icons\default\main-window.ico`

   - Launch the shortcut to execute our new Firefox installation. It’ll be a
     vanilla one so now it’s time to install our development addons ( Firebug,
     Webdev toolbar, Yslow, Clearcache, Venkman… ) and also a custom theme so we
     can easily know in which firefox we are at each moment.
   - To further customize our new Firefox installation we can install the 
     [Firesomething][3] addon, which allows to change the window title to anything
     we want.


Update 2008–11–03
-----------------

A great extension for Flash/Flex development is [FlashSwitcher][4] which allows to
easily change the Flash player version used in Firefox. One problem though is that
it'll interfere with your default Firefox installation. To solve this you can edit
its settings dialog and point the _Firefox Plugin directory_ to `c:\dev\develfox\plugins`
instead of the default location. This way the Flash player changes will only
affect our development firefox installation.


[1]: http://www.getfirefox.com/
[2]: http://www.iconbase.com/
[3]: http://addons.mozilla.org/en-US/firefox/addon/31
[4]: http://www.sephiroth.it/firefox/flash_switcher/