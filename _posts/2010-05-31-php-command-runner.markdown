---
layout:   post
title:    PHP command runner class
category: Code
tags: [ php, shell, command, proc_open ]
---

PHP offers [multiple methods to execute external applications](http://php.net/exec),
for simple things they are more than enough but sometimes we need more flexibility.
The following class acts as a wrapper around [proc_open](http://php.net/proc_open).

It implements a _fluent interface_ to ease its configuration and non-blocking
pipes for stdout and stderr. The output can be obtained at the end of the program
execution or incrementally by using a callback function.

{% highlight php %}
<?php
$cmd = Command::factory('/usr/bin/svn');
$cmd->option('--username', 'drslump')
    ->option('-r', 'HEAD')
    ->option('log')
    ->argument('http://code.google.com/drslump/trunk');
    ->run();
if ($cmd->getExitCode() === 0) {
    echo $cmd->getStdOut();
} else {
    echo $cmd->getStdErr();
}
{% endhighlight %}

Incremental updates can be accomplished with a callback function, like in the
following example (PHP 5.3+):

{% highlight php %}
<?php
$cmd = Command::factory('ls');
$cmd->setCallback(function($pipe, $data){
        if ($pipe === Command::STDOUT) echo 'STDOUT: ';
        if ($pipe === Command::STDERR) echo 'STDERR: ';
        echo $data === NULL ? "EOF\n" : "$data\n";
        // If we return "false" all pipes will be closed
        // return false;
    })
    ->setDirectory('/tmp')
    ->option('-l')
    ->run();
if ($cmd->getExitCode() === 0) {
    echo $cmd->getStdOut();
} else {
    echo $cmd->getStdErr();
}
{% endhighlight %}

Some more features:

 - StdIn data can be provided to the process as a parameter to `run()`
 - Set environment variables for the process with `setEnv()`
 - Second argument to `option()` and argument to `argument()` are automatically escaped.
 - Options separator is white space by default, it can be changed by manually setting it
   as third argument to `option()` or setting a new default with `setOptionSeparator()`.
 - The `proc_open` wrapper is exposed as a static method for your convenience `Command::exec()`


And finally the class which makes all that possible :)

<script src="http://gist.github.com/420268.js?file=Command.php">.</script>



