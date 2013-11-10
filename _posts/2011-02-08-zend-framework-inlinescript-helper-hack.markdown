---
layout:   post
title:    Zend Framework InlineScript helper hack
category: Code
tags: [ php, zendframework ]
---

> Pepe -_blacky_- Jiménez has been kind enough to act as special guest in this 
> blog and write about a _hack_ he found, when including Javascript chunks into 
> PHP files, while using [Zend Framework](http://framework.zend.com)'s 
> [InlineScript](http://framework.zend.com/manual/en/zend.view.helpers.html#zend.view.helpers.initial.inlinescript) view helper.
>
> If you are looking for a talented web frontend programmer I can only speak good words about this bloke.

## Why this hack? ##

Syntax highlighting is essential for developers. If you are familiar with 
[Zend Framework](http://framework.zend.com) you will know that [InlineScript](http://framework.zend.com/manual/en/zend.view.helpers.html#zend.view.helpers.initial.inlinescript) 
view helper doesn't need the `<script>` tag. The reason is simple, that tag is
automatically included at the view rendering stage. There is one big disadvantage
however when you are developing in your favorite IDE... No syntax highlighting for
your JavaScript piece of code.

When I noticed that, I searched for a solution at Google. No luck this time... So 
I started thinking how to solve this issue. As far as I know, IDEs detect JavaScript 
language in source files thanks to the `<script>` tag, so that should be a good
start. If we could find a way to keep the tag in the source file and remove it 
before rendering it the problem would disappear.

## How it works? ##

The [InlineScript](http://framework.zend.com/manual/en/zend.view.helpers.html#zend.view.helpers.initial.inlinescript) 
inherits from [HeadScript](http://framework.zend.com/manual/en/zend.view.helpers.html#zend.view.helpers.initial.headscript) 
who is responsible for introducing JavaScript content (literal source code or file).
Taking a look at the [HeadScript](http://framework.zend.com/manual/en/zend.view.helpers.html#zend.view.helpers.initial.headscript) 
`__call` method, the `createData` function is the best candidate to solve this 
tag issue. If we look at Zend Framework's source code, the 3rd parameter is the 
one containing our JavaScript code (potentially including the `<script>` tag).

Once we have this function located is very easy to remove the `<script>` tag. We 
just need to create a custom view helper extending Zend Framework's one in order
to override the `createData` method. At this point take a look at the source code
below to see how it works.

I hope this post will prove useful to other developers who have been in the 
same situation as me.

> Note: Don't forget that custom view helpers prefix and paths have to be properly 
> configured in your application to be automatically loaded and used.


## Code ##

{% highlight php %}

    <?php
    /**
     * Remove <script> tags
     *
     * @author      Jose Luis Jiménez <jljc.work@gmail.com>
     */
    class Pepe_Zend_View_Helper_InlineScript extends Zend_View_Helper_InlineScript
    {
      /**
       * Create data item containing all necessary components of script
       *
       * @param  string $type
       * @param  array $attributes
       * @param  string $content
       * @return stdClass
       */
      public function createData($type, array $attributes, $content = null)
      {
        // Replace <script> tag
        if (!empty($content)) {
          $content = preg_replace('@^\s*<script[^>]*>@i', '', $content);
          $content = preg_replace('@</script>\s*$@i', '', $content);
        }

        // Call parent
        return parent::createData($type, $attributes, $content);
      }
    }

{% endhighlight %}




