---
layout:   post
title:    PHP post_max_size issue
category: Code
tags: [ php, upload, ini ]
---

PHP's ability to manage uploaded files has always left mixing feelings in me, on one
hand it's really trivial to implement file upload functionality on PHP scripts but
in the other, managing big files uploads (just anything above a couple megabytes)
is far from reliable.

Recently a couple solutions became popular to implement _progressive uploads_ in PHP,
[PECL's uploadprogress extension](http://pecl.php.net/package/uploadprogress) and recent
[APC](http://www.php.net/manual/es/apc.configuration.php#ini.apc.rfc1867) versions. But
anyway, the default PHP behaviour when uploading a file is to wait until it's been
fully transferred to the server before executing the php script.

This design decision from the PHP folks greatly simplifies the most common case, 
since you always get the full file when your PHP code runs, but also means that
_big_ files can cause some serious trouble. To defend itself, PHP has a few ini
options that tune its ability to work with big files.

`upload_max_filesize` tells PHP the maximum size an uploaded file can have, files
bigger will be reported as an error in the `$_FILES` array. `max_input_time` control
the maximum time PHP can spend receiving data from the client, this is important
because if you have many visitors with slow connections (or a malevolent attacker)
a lot of PHP processes will be idling in memory collecting data slowly, consuming
your server resources and potentially provoking your server to become unresponsive.
Finally, we have `post_max_size`, which is a bit tricky, it limits the maximum amount
of data a request from the client can hold. The tricky part is that if that limit is
reached PHP won't error out or signal the problem anyhow to your script, instead
it will continue normal script execution but won't populate `$_POST` or `$_FILES`
superglobals, leaving them empty.

So if your `post_max_size` is set to 2Mb and a client uploads a 3Mb file, nor `$_POST`
neither `$_FILES` will have any content. Even if you set your `upload_max_filesize` to
2Mb or below, if size of the file (or files) is bigger you will find yourself with
those superglobals empty.

There is however a way to detect this condition, like shown in the following code snippet.

{% highlight php %}
<?php

if (in_array($_SERVER['REQUEST_METHOD'], array('POST', 'PUT'))) {
  if (empty($_POST) && empty($_FILES)) {

    // Get maximum size and meassurement unit
    $max = ini_get('post_max_size');
    $unit = substr($max, -1);
    if (!is_numeric($unit)) {
      $max = substr($max, 0, -1);
    }

    // Convert to bytes
    switch (strtoupper($unit)) {
      case 'G':
        $max *= 1024;
      case 'M':
        $max *= 1024;
      case 'K':
        $max *= 1024;
    }

    // Assert the content length is within limits
    $length = $_SERVER['CONTENT_LENGTH'];
    if ($max < $length) {
      throw new Exception('Maximum content length size (' . $max . ') exceeded');
    }
  }
}
{% endhighlight %}

With that code in place you can gracely detect the issue and act accordingly by
showing the user an error page explaining what just happened for example.




