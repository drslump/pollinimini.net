---
layout:   post
title:    Better keyboard handling in Terminal.app  
category: Technology
tags: [ osx, mac, terminal, keyboard ]
---

Apple OSX's default terminal application, _Terminal.app_, has matured 
quite a bit over the last years. It offers a good balance between compatibility with
modern shells, nice font rendering and a functional user interface with support 
for tabs. For people comming from other operating systems however, it's a bit 
frustrating getting used to mac's keyboard shortcuts.

The default behaviour of _home_, _end_ and _page_ keys is specially traumatic, so
after googling a fair bit[^1] I came up with the following recipies.

Key            | Action        | Behaviour
---------------|---------------|---------------------------------
home           | `\033[1~`     | Move to the start of the line
end            | `\033[4~`     | Move to the end of the line
page up        | `\033[5~`     | Search previous in the history 
page down      | `\033[6~`     | Search next in the history
option left    | `\033b`       | Move one word left
option right   | `\033f`       | Move one word right 
forward delete | `\033[3~`     | Delete next char


> To change the behaviour of a key on Terminal.app we need to access the preferences
> and navigate to the _keyboard_ tab. There we can modify and create new key
> mappings. To input `\033` just press the Esc key.


Now for they to work properly we need configure _readline_ by either editing as
root `/etc/inputrc` or just creating an user file at `~/.inputrc`

    # Be 8bit clean
    set input-meta on
    set output-meta on
    set convert-meta off

    # allow the use of Home/End keys
    "\e[1~": beginning-of-line
    "\e[4~": end-of-line

    # allow the use of Delete/Insert keys
    "\e[3~": delete-char
    "\e[2~": quoted-insert

    # page up/down to search history
    "\e[5~": history-search-backward
    "\e[6~": history-search-forward


Time to restart your terminal session and get all the previous changes to work.

By the way, if you work with tabs there are two lesser known keyboard shortcuts to 
change between them: `Cmd+Shift+Left` and `Cmd+Shift+Right` will change the active 
tab to the left or the right.

As a bonus, we can modify all _Cocoa_ based apps (Safari, Word, Mail ...) to 
behave a bit more as our newly configured terminal by creating a custom keyboard
binding in `~/Library/KeyBindings/DefaultKeyBinding.dict`:

    {
        "\UF729" = "moveToBeginningOfLine:"; 
        "\UF72B" = "moveToEndOfLine:"; 
        "$\UF729" = "moveToBeginningOfLineAndModifySelection:";
        "$\UF72B" = "moveToEndOfLineAndModifySelection:";
        "\UF72C" = "pageUp:"; 
        "\UF72D" = "pageDown:"; 
        "$\UF72C" = "pageUpAndModifySelection:"; 
        "$\UF72D" = "pageDownAndModifySelection:"; 
    }
    


[^1]: [http://tech.inhelsinki.nl/gnu_developement_under_mac_os_x/](http://tech.inhelsinki.nl/gnu_developement_under_mac_os_x/)





