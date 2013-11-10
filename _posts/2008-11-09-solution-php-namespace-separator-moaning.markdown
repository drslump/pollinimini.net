---
layout: post
title: A solution to PHP's new namespace separator moaning
category: Code
tags: [irony, namaspace, php, webdev]
disqus: http://pollinimini.net/blog/solution-phps-new-namespace-separator-moaning
---

I've been quite busy lately but I've obviously been exposed to all the fud about
the PHP internals decission of choosing the back-slash as the namespace separator.

So to keep everyone happy I've spent a few minutes working on a solution to the
problem and here it goes:

{% highlight php %}
<?php
class NsFixerFileStream {
    protected $fp;
    protected $separator = ':::';
    protected $isPHP = false;
    public $context;

    function stream_open($path, $mode, $options, &$opened_path)
    {
        if (!$this->context) {
                $this->context = stream_context_get_default();
        }
        $opts = stream_context_get_options($this->context);
        if (!empty($opts['file']) && !empty($opts['file']['separator'])) {
                $this->separator = $opts['file']['separator'];
        }

        $this->isPHP = pathinfo($path, PATHINFO_EXTENSION) === 'php';

        stream_wrapper_restore('file');

        $this->fp = fopen($path, $mode);

        stream_wrapper_unregister('file');
        stream_wrapper_register('file', get_class($this));

        return !empty($this->fp);
    }

    function stream_read($count)
    {
        $data = fread($this->fp, $count);
        if ($this->isPHP && !empty($data)) {
                $data = str_replace($this->separator, '\\', $data);
        }

        return $data;
    }

    function stream_write($data)
    {
        return fwrite($this->fp, $data);
    }

    function stream_tell()
    {
        return ftell($this->fp);
    }

    function stream_eof()
    {
        return feof($this->fp);
    }

    function stream_seek($offset, $whence)
    {
        return fseek($this->fp, $offset, $whence);
    }

    function stream_stat()
    {
        return fstat($this->fp);
    }
}


// Replace default stream wrapper with out custom one
stream_wrapper_unregister('file');
stream_wrapper_register("file", "NsFixerFileStream")
    or die("Failed to register protocol");

// Define the default namespace separator
stream_context_set_default(array(
        'file' => array(
                'separator' => ':::'
        )
));
{% endhighlight %}

For the least versed on PHP's stream wrappers, what it does is replace the
standard file i/o stream with one that replaces on the fly everything you like
to be a namespace separator with an ugly back-slash. Just place this on a file
on your server and add its location to your `auto_prepend_file` ini directive.

Now you can spend your time writing stuff like the following instead of blogging
about how the ugly back-slash in your code can ruin your way of life :)

{% highlight php %}
<?php
namespace DRSLUMP:::test;

class foo {
    static public function bar(){
        :::printf('Hello %s!', 'world');
    }
}

:::DRSLUMP:::test:::foo::bar();
{% endhighlight %}
