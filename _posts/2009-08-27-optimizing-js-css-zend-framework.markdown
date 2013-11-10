---
layout: post
title: Optimizing Javascript and CSS downloads with Zend Framework
category: Code
tags: [ zf, php, scale, webdev, zend, javascript, css ]
---

Modern web sites and applications require the use of many javascript and css
files. If not done with care this can affect the user's experience. One of the
easiest methods to improve the performance is by concatenating and minimizing
the individual files into _bundles_, reducing this way the number of downloads
and the total size to be downloaded.

One problem with this approach though is that during development phases it's
important to work with the original source files, so it's easier to debug or
perform changes in them. From the developer's point of view it's ideal to work
with small files.

Zend Framework offers an interesting way to include external javascript and css
files in your pages. The `headLink` and `headScript` view helpers allow to
include files in the page at any point in the execution which will be finally
added to the head section of your layout just before sending the page to the
browser. Since all the files are actually added to page at the end of the request
we can override those helpers and filter their contents to replace the individual
files with our bundles.

Fortunately, both helpers implement the Iterator interface, which means that's
very easy to attach a filter mechanism to them. First thing we need is a
filtering iterator as shown here:

{% highlight php %}
<?php
/** vim: ff=unix fenc=utf8 tw=80 ts=4 sw=4 et ai
 *
 * Implements a filter iterator designed to modify the default behaviour of Zend
 * view helpers HeadLink and HeadScript to support the runtime replacement
 * of individual javascript and css files for its corresponding bundles.
 *
 * License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * @copyright   Copyright (c) 2009 Iván Montes
 * @author      Iván -DrSlump- Montes <drslump@pollinimini.net>
 */
class BundlesFilterIterator extends FilterIterator
{
    /** @var array */
    protected $_files = array();
    /** @var array */
    protected $_included = array();

    /**
     * Constructor
     *
     * @param Iterator $iterator
     * @param array $bundles
     */
    public function __construct($iterator, $bundles)
    {
        // Reverses the array placing the individual files as keys and the
        // bundle files as values
        foreach ( $bundles as $bundle => $files ) {
            foreach ($files as $file) {
                $this->_files[$file] = $bundle;
            }
        }

        parent::__construct($iterator);
    }

    /**
     * Performs the filtering
     *
     * @return bool
     */
    public function accept()
    {
        // Get the current item
        $item = $this->getInnerIterator()->current();

        // Check if it is an external javascript or css file
        $type = 'js';
        $src = isset($item->attributes['src']) ? $item->attributes['src'] : null;
        if (empty($src)) {
            $type = 'css';
            $src = isset($item->href) ? $item->href : null;
        }

        if (!empty($src) &&
            // The individual file is in a bundle
            isset($this->_files[$src]) &&
            // Check if it is a normal include
            empty($item->attributes['defer']) &&
            empty($item->attributes['conditional']) &&
            empty($item->attributes['conditionalStylesheet'])) {

            // Get the bundle file
            $bundle = $this->_files[$src];

            // If its bundle was not yet included do so now
            // The HeadXXXX helpers will also check for this but still...
            if (empty($this->_included[$bundle])) {
                $this->_included[$bundle] = true;
                if ($type === 'js') {
                        $item->attributes['src'] = $bundle;
                } else {
                        $item->href = $bundle;
                }
                return true;
            }

            // Otherwise we do nothing with this item
            return false;
        }

        return true;
    }
}
{% endhighlight %}

Now we need to override the view helpers to add the filtering iterator


{% highlight php %}
<?php
class DrSlump_View_Helper_HeadLink extends Zend_View_Helper_HeadLink {
    /**
     * Override the default iterator with a filtering one
     *
     * @return BundlesFilterIterator
     */
    public function getIterator()
    {
        $iterator = $this->getContainer()->getIterator();
        $bundles = Zend_Registry::get('bundles');

        return empty($bundles) ? $iterator : new BundlesFilterIterator( $iterator, $bundles );
    }
}

class DrSlump_View_Helper_HeadScript extends Zend_View_Helper_HeadScript {
        /**
         * Override the default iterator with a filtering one
         *
         * @return BundlesFilterIterator
         */
        public function getIterator()
        {
                $iterator = $this->getContainer()->getIterator();
                $bundles = Zend_Registry::get('bundles');
 
                return empty($bundles) ? $iterator : new BundlesFilterIterator( $iterator, $bundles );
        }
}
{% endhighlight %}

Now we just need to map our small individual files with the bundle files in
which they are contained:


{% highlight php %}
<?php
$bundles = array(
    // For jQuery we use a public CDN
    'http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js' => array(
        '/js/jquery-1.3.2.js'
    ),
    '/resources/bundle-plugins.js' => array(
        '/js/jquery/jquery.event.drag.js',
        '/js/jquery/password_strength_plugin.js'
    ),
    '/resources/bundle.css' => array(
        '/css/reset.css',
        '/css/global.css',
        '/css/forms.css'
    )
);

// Store the bundles configuration in the registry so that it can be fetched by the view helpers
Zend_Registry::set('bundles', $bundles);
{% endhighlight %}

When defining the bundles mapping we're assigning the bundle URL as key to an
array of the individual files URLs we're using in the code.

> Note: This code does **NOT** create the bundles. There are several tools available
> for that task. The purpose of the examples above is to show how to use those
> bundles in an application without having to think about them when coding or
> even apply them to an existing application without having to modify the source
> code.

